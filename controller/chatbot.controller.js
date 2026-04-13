const config = require("../configuration/config");
const chatBotModel = require("../model/chatbot.model");
const common = require("./common.controller");
const Messages = require("../utils/constant/messages");
const { HttpStatus } = require("../utils/constant/constant");

const chatbotController = {
  processChat: async (req, res) => {
    try {
      const { message, history } = req.body;
      const groupId = req.params.group_id;
      const userId = req.user.user_id;

      // 1. Check Rate Limit
      const usage = await chatBotModel.checkAndIncrementAiUsage(userId, config.CHATBOT_DAILY_LIMIT);
      if (!usage.allowed) {
        return common.successResponse(res, Messages.SUCCESS, HttpStatus.OK, {
          text: `Daily AI limit reached (${config.CHATBOT_DAILY_LIMIT} messages). Please try again tomorrow.`,
          remainingMessages: 0,
        });
      }

      // 2. Define Tools (OpenAI format)
      const tools = [
        {
          type: "function",
          function: {
            name: "getGroupFinancialSummary",
            description: "Provides a summary of total group spending, whether it is settled, and member count.",
            parameters: {
              type: "object",
              properties: {
                groupId: { type: "string", description: "The unique ID of the group" },
              },
              required: ["groupId"],
            },
          },
        },
        {
          type: "function",
          function: {
            name: "getMyPersonalSpending",
            description: "Provides the total number of expenses and total amount the current user has paid for in this group.",
            parameters: {
              type: "object",
              properties: {
                groupId: { type: "string", description: "The ID of the group" },
                userId: { type: "string", description: "The ID of the user" },
              },
              required: ["groupId", "userId"],
            },
          },
        },
        {
          type: "function",
          function: {
            name: "findExpensesByName",
            description: "Searches for specific expenses in the group by name (e.g., 'Pizza', 'Rent').",
            parameters: {
              type: "object",
              properties: {
                groupId: { type: "string" },
                name: { type: "string", description: "The name or keyword to search for" },
              },
              required: ["groupId", "name"],
            },
          },
        },
        {
          type: "function",
          function: {
            name: "getExpensesByAmountRange",
            description: "Finds expenses within a specific price range (e.g., between 500 and 2000).",
            parameters: {
              type: "object",
              properties: {
                groupId: { type: "string" },
                minAmount: { type: "number" },
                maxAmount: { type: "number" },
              },
              required: ["groupId", "minAmount", "maxAmount"],
            },
          },
        },
        {
          type: "function",
          function: {
            name: "predictMonthlySpending",
            description: "Fetches historical data to predict what the total spending will be by the end of the month.",
            parameters: {
              type: "object",
              properties: {
                groupId: { type: "string" },
              },
              required: ["groupId"],
            },
          },
        },
        {
          type: "function",
          function: {
            name: "getExpensesByCategory",
            description: "Provides a list of expenses for a specific category (e.g., 'Food', 'Grocery', 'Bills').",
            parameters: {
              type: "object",
              properties: {
                groupId: { type: "string" },
                category: { type: "string", description: "The category to filter by (e.g., Food, Grocery, Bills, Shopping, Cab, Entertainment, Health, Others)" },
              },
              required: ["groupId", "category"],
            },
          },
        },
        {
          type: "function",
          function: {
            name: "getSpendingByCategory",
            description: "Provides a summary of total spending broken down by category (e.g., Food: 500, Bills: 1200).",
            parameters: {
              type: "object",
              properties: {
                groupId: { type: "string" },
              },
              required: ["groupId"],
            },
          },
        },
      ];

      // 3. Build system prompt context
      const systemMsg = {
        role: "system",
        content: `Role: You are 'Hisabkar Assistant', a smart and concise financial helper.
Objective: Give clear, short answers for Group ID [${groupId}]. Your User ID is [${userId}]. Date: ${new Date().toLocaleDateString("en-IN")}.

Context:
- Current Group ID: ${groupId}
- Your User ID: ${userId} (Use this for personal tool calls)

Response Protocol:
- BE CONCISE: Get straight to the point. Avoid long introductions or elaborate fluff.
- SIMPLE WORDS: Use plain English that is easy to understand.
- FORMATTING: Use bullet points for lists and bolding for amounts (e.g., **₹520**).
- ACTIONABLE: If tools show high spending, give 1 short tip.
- NO AI DISCLOSURE: Do not mention being an AI model.

Keep it simple, short, and helpful. One or two short paragraphs or a few bullets is enough.`,
      };

      // 4. Prepare messages
      const apiMessages = [systemMsg, ...(history || []), { role: "user", content: message }];

      // 5. Fallback Strategy Implementation
      let finalResponse = null;
      let lastError = null;

      for (const model of config.OPENROUTER.MODELS) {
        try {
          console.log(`Trying model: ${model}`);
          const result = await callOpenRouterWithTools(model, apiMessages, tools, groupId, userId);
          if (result) {
            finalResponse = result;
            break;
          }
        } catch (error) {
          console.error(`Error with model ${model}:`, error.message || error);
          lastError = error;
          // Retry on 429 (Rate Limit), 500 (Internal Error), or Timeout/Network errors
          if (error.status === 429 || error.status >= 500 || error.status === "TIMEOUT") {
            continue;
          } else {
            // For other errors (like 400 Bad Request), we might not want to retry as they probably won't succeed on other models either
            break;
          }
        }
      }

      if (!finalResponse) {
        throw lastError || new Error("All models failed");
      }

      return common.successResponse(res, Messages.SUCCESS, HttpStatus.OK, {
        text: finalResponse,
        remainingMessages: usage.isInfinite ? 999 : config.CHATBOT_DAILY_LIMIT - usage.currentCount,
      });
    } catch (error) {
      console.error("Chatbot Controller Error:", error);
      return common.successResponse(res, Messages.SUCCESS, HttpStatus.OK, {
        text: "Service temporarily unavailable, please try again.",
        remainingMessages: 0,
      });
    }
  },
};

// Helper to call OpenRouter API
async function callOpenRouterWithTools(model, messages, tools, groupId, userId) {
  const timeout = 30000; // 30 seconds timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(`${config.OPENROUTER.BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.OPENROUTER.API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://hisabkar.com",
        "X-Title": "Hisabkar",
      },
      body: JSON.stringify({
        model: model,
        messages: messages,
        tools: tools,
        tool_choice: "auto",
        max_tokens: 800,
        temperature: 0.1,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw {
        status: response.status,
        message: errorData.error?.message || response.statusText,
      };
    }

    const data = await response.json();
    const choice = data.choices[0];
    const message = choice.message;

    if (message.tool_calls && message.tool_calls.length > 0) {
      // Handle tool calls
      const updatedMessages = [...messages, message];

      for (const toolCall of message.tool_calls) {
        const functionName = toolCall.function.name;
        const args = JSON.parse(toolCall.function.arguments);
        let callResult;

        console.log(`Executing tool: ${functionName}`, args);

        if (functionName === "getGroupFinancialSummary") {
          callResult = await chatBotModel.getGroupSummaryForAi(args.groupId || groupId);
        } else if (functionName === "getMyPersonalSpending") {
          // Safety: Always use the session userId for personal spending
          callResult = await chatBotModel.getUserExpensesForAi(groupId, userId);
        } else if (functionName === "findExpensesByName") {
          callResult = await chatBotModel.findExpensesByName(args.groupId || groupId, args.name);
        } else if (functionName === "getExpensesByAmountRange") {
          callResult = await chatBotModel.getExpensesByAmountRange(args.groupId || groupId, args.minAmount, args.maxAmount);
        } else if (functionName === "predictMonthlySpending") {
          callResult = await chatBotModel.getPredictionDataForAi(args.groupId || groupId);
        } else if (functionName === "getExpensesByCategory") {
          callResult = await chatBotModel.getExpensesByCategory(args.groupId || groupId, args.category);
        } else if (functionName === "getSpendingByCategory") {
          callResult = await chatBotModel.getSpendingByCategory(args.groupId || groupId);
        }

        updatedMessages.push({
          role: "tool",
          tool_call_id: toolCall.id,
          name: functionName,
          content: JSON.stringify(callResult || { status: "no data found" }),
        });
      }

      // Call back with tool results
      return await callOpenRouterWithTools(model, updatedMessages, tools, groupId, userId);
    }

    return message.content;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === "AbortError") {
      throw { status: "TIMEOUT", message: "Request timed out" };
    }
    throw error;
  }
}

module.exports = chatbotController;

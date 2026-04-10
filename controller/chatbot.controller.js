const { GoogleGenerativeAI } = require("@google/generative-ai");
const config = require("../configuration/config");
const chatBotModel = require("../model/chatbot.model");
const common = require("./common.controller");
const Messages = require("../utils/constant/messages");
const { HttpStatus } = require("../utils/constant/constant");

const genAI = new GoogleGenerativeAI(config.GEMINI.API_KEY);

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

      // 2. Define Tools
      const tools = [
        {
          functionDeclarations: [
            {
              name: "getGroupFinancialSummary",
              description: "Provides a summary of total group spending, whether it is settled, and member count.",
              parameters: {
                type: "OBJECT",
                properties: {
                  groupId: { type: "STRING", description: "The unique ID of the group" },
                },
                required: ["groupId"],
              },
            },
            {
              name: "getMyPersonalSpending",
              description: "Provides the total number of expenses and total amount the current user has paid for in this group.",
              parameters: {
                type: "OBJECT",
                properties: {
                  groupId: { type: "STRING", description: "The ID of the group" },
                  userId: { type: "STRING", description: "The ID of the user" },
                },
                required: ["groupId", "userId"],
              },
            },
            {
              name: "findExpensesByName",
              description: "Searches for specific expenses in the group by name (e.g., 'Pizza', 'Rent').",
              parameters: {
                type: "OBJECT",
                properties: {
                  groupId: { type: "STRING" },
                  name: { type: "STRING", description: "The name or keyword to search for" },
                },
                required: ["groupId", "name"],
              },
            },
            {
              name: "getExpensesByAmountRange",
              description: "Finds expenses within a specific price range (e.g., between 500 and 2000).",
              parameters: {
                type: "OBJECT",
                properties: {
                  groupId: { type: "STRING" },
                  minAmount: { type: "NUMBER" },
                  maxAmount: { type: "NUMBER" },
                },
                required: ["groupId", "minAmount", "maxAmount"],
              },
            },
            {
              name: "predictMonthlySpending",
              description: "Fetches historical data to predict what the total spending will be by the end of the month.",
              parameters: {
                type: "OBJECT",
                properties: {
                  groupId: { type: "STRING" },
                },
                required: ["groupId"],
              },
            },
            {
              name: "getExpensesByCategory",
              description: "Provides a list of expenses for a specific category (e.g., 'Food', 'Grocery', 'Bills').",
              parameters: {
                type: "OBJECT",
                properties: {
                  groupId: { type: "STRING" },
                  category: { type: "STRING", description: "The category to filter by (e.g., Food, Grocery, Bills, Shopping, Cab, Entertainment, Health, Others)" },
                },
                required: ["groupId", "category"],
              },
            },
            {
              name: "getSpendingByCategory",
              description: "Provides a summary of total spending broken down by category (e.g., Food: 500, Bills: 1200).",
              parameters: {
                type: "OBJECT",
                properties: {
                  groupId: { type: "STRING" },
                },
                required: ["groupId"],
              },
            },
          ],
        },
      ];

      // 3. Initialize Model with Tools
      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
        tools: tools,
      });

      // 4. Start Chat
      const chat = model.startChat({
        history: history || [],
      });

      // 5. Build system prompt context
      const systemContext = `Role: You are 'Hisabkar Assistant', a smart and concise financial helper.
      Objective: Give clear, short answers for Group ID [${groupId}]. Date: ${new Date().toLocaleDateString("en-IN")}.
      
      Response Protocol:
      - BE CONCISE: Get straight to the point. Avoid long introductions or elaborate fluff.
      - SIMPLE WORDS: Use plain English that is easy to understand.
      - FORMATTING: Use bullet points for lists and bolding for amounts (e.g., **₹520**).
      - ACTIONABLE: If tools show high spending, give 1 short tip.
      - NO AI DISCLOSURE: Do not mention being an AI model.
      
      Keep it simple, short, and helpful. One or two short paragraphs or a few bullets is enough.`;

      // 6. Send message and handle tool calls
      let result = await chat.sendMessage(`${systemContext}\n\nUser Question: ${message}`);
      let response = result.response;
      const functionCalls = response.functionCalls();

      if (functionCalls) {
        const functionResponses = [];

        for (const call of functionCalls) {
          let callResult;
          if (call.name === "getGroupFinancialSummary") {
            callResult = await chatBotModel.getGroupSummaryForAi(call.args.groupId);
          } else if (call.name === "getMyPersonalSpending") {
            callResult = await chatBotModel.getUserExpensesForAi(call.args.groupId, call.args.userId);
          } else if (call.name === "findExpensesByName") {
            callResult = await chatBotModel.findExpensesByName(call.args.groupId, call.args.name);
          } else if (call.name === "getExpensesByAmountRange") {
            callResult = await chatBotModel.getExpensesByAmountRange(call.args.groupId, call.args.minAmount, call.args.maxAmount);
          } else if (call.name === "predictMonthlySpending") {
            callResult = await chatBotModel.getPredictionDataForAi(call.args.groupId);
          } else if (call.name === "getExpensesByCategory") {
            callResult = await chatBotModel.getExpensesByCategory(call.args.groupId, call.args.category);
          } else if (call.name === "getSpendingByCategory") {
            callResult = await chatBotModel.getSpendingByCategory(call.args.groupId);
          }

          // The Gemini API requires 'response' to be an Object (Struct), not an Array.
          // Wrapping the result in { data: result } prevents "Proto field is not repeating" errors.
          const formattedResponse = typeof callResult === "object" && callResult !== null && !Array.isArray(callResult) ? callResult : { data: callResult };

          functionResponses.push({
            functionResponse: {
              name: call.name,
              response: formattedResponse,
            },
          });
        }

        // Send function results back to Gemini
        result = await chat.sendMessage(functionResponses);
        response = result.response;
      }

      const finalResponseText = response.text();

      return common.successResponse(res, Messages.SUCCESS, HttpStatus.OK, {
        text: finalResponseText,
        remainingMessages: usage.isInfinite ? 999 : config.CHATBOT_DAILY_LIMIT - usage.currentCount,
      });
    } catch (error) {
      console.error("Chatbot Controller Error:", error);

      // Catch ANY model error (Quota limits, 404s, Network issues, etc.)
      // Return a successful HTTP 200 with the error text so it natively renders inside the UI chatbox instead of firing a toast.
      return common.successResponse(res, Messages.SUCCESS, HttpStatus.OK, {
        text: "The AI model is currently out of limits or temporarily unavailable. Please try again later.",
        remainingMessages: 0,
      });
    }
  },
};

module.exports = chatbotController;

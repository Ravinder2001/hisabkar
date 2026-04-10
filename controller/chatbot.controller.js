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
        model: "gemini-1.5-flash",
        tools: tools,
      });

      // 4. Start Chat
      const chat = model.startChat({
        history: history || [],
      });

      // 5. Build system prompt context
      const systemContext = `Role: You are 'Hisabkar Financial Sensei', a sophisticated AI specialized in group expense analysis and financial health strategy.
      Objective: Analyze Group ID [${groupId}] for User ID [${userId}]. Today is ${new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}.
      
      Core Competencies:
      1. Deep Data Analysis: Don't just list expenses. Correlate them. Identify patterns (e.g., 'You spend 3x more on weekends').
      2. Strategic Forecasting: Use historical burn rates to predict month-end totals.
      3. Proactive Budgeting: Compare spending against group norms and provide corrective advice.
      
      Response Protocol (MANDATORY):
      - BE COMPREHENSIVE: If data is available, provide a multi-layered response. Use at least 2-3 paragraphs for complex queries.
      - FORMATTING: Use Markdown tables for comparisons, bolding for amounts (e.g., **₹5,200**), and clear headers (###).
      - NO GENERIC ANSWERS: Every response must be tailored to the numbers returned by your tools. If tools return nothing, explain how the user can start adding data.
      - TONE: Professional, wise, and proactive. Use phrases like 'Based on your recent transactions...' or 'Strategically speaking...'.
      - NO AI DISCLOSURE: Stay in character. You are the Sensei. Never mention being a language model.
      
      Logic for Tool Outputs:
      - getGroupFinancialSummary: Look at the 'isSettled' status. If unsettled, highlight the largest outstanding balance.
      - getSpendingByCategory: Identify the 'Dominant Category' and provide a tip on how to reduce spending in that specific area.
      - predictMonthlySpending: Break down the prediction. Show the math: (Current Total / Days Elapsed) * Days in Month.
      
      Final Instruction: Always aim to surprise the user with your depth of understanding. If they ask a simple question like 'How much did I spend?', give them an expert's report including category splits and daily averages.`;

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

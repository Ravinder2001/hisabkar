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
        return common.errorResponse(res, `Daily AI limit reached (${config.CHATBOT_DAILY_LIMIT} messages). Please try again tomorrow.`, HttpStatus.TOO_MANY_REQUESTS);
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
          ],
        },
      ];

      // 3. Initialize Model with Tools
      const model = genAI.getGenerativeModel({
        model: "gemini-flash-latest",
        tools: tools,
      });

      // 4. Start Chat
      const chat = model.startChat({
        history: history || [],
      });

      // 5. Build system prompt context
      const systemContext = `You are a helpful financial assistant for the 'Hisabkar' app. 
      You are currently chatting with a user in the group context of Group ID: ${groupId}.
      User ID is: ${userId}.
      Always be polite, concise, and professional. 
      Use the provided tools to answer specific financial questions. 
      If a user asks about group info, use getGroupFinancialSummary. 
      If they ask about their own expenses/added items, use getMyPersonalSpending.`;

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
          }

          functionResponses.push({
            functionResponse: {
              name: call.name,
              response: callResult,
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
        remainingMessages: config.CHATBOT_DAILY_LIMIT - usage.currentCount,
      });
    } catch (error) {
      console.error("Chatbot Controller Error:", error);
      common.handleAsyncError(error, res);
    }
  },
};

module.exports = chatbotController;

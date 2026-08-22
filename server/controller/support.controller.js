const supportModel = require("../model/support.model");
const common = require("./common.controller");
const { HttpStatus } = require("../utils/constant/constant");
const Messages = require("../utils/constant/messages");
const sendTicketEmails = require("../helpers/sendTicketEmail");

module.exports = {
  createTicket: async (req, res) => {
    try {
      const ticket = await supportModel.createTicket(req.body);
      // Send success response first
      common.successResponse(res, Messages.SUCCESS, HttpStatus.OK);

      // Send email in the background
      setImmediate(() => {
        sendTicketEmails(ticket).catch((error) => console.error("Email error:", error));
      });
    } catch (error) {
      common.handleAsyncError(error, res);
    }
  },
  getSupportCatList: async (req, res) => {
    try {
      const ticket = await supportModel.getSupportCatList();
      // Send success response first
      return common.successResponse(res, Messages.SUCCESS, HttpStatus.OK, ticket, ticket.length);
    } catch (error) {
      common.handleAsyncError(error, res);
    }
  },
  getBugPrioritiesList: async (req, res) => {
    try {
      const ticket = await supportModel.getBugPrioritiesList();
      // Send success response first
      return common.successResponse(res, Messages.SUCCESS, HttpStatus.OK, ticket, ticket.length);
    } catch (error) {
      common.handleAsyncError(error, res);
    }
  },
};

const Joi = require("joi");
const constant = require("../../utils/constant/constant");

module.exports = {
  addExpense: Joi.object().keys({
    expenseName: Joi.string().required().max(constant.LENGTH_VALIDATIONS.NAME),
    splitType: Joi.string().required().max(constant.LENGTH_VALIDATIONS.NAME),
    description: Joi.string().optional().allow("").max(constant.LENGTH_VALIDATIONS.DES),
    amount: Joi.number().required().min(1).max(constant.LENGTH_VALIDATIONS.AMOUNT),
    expenseType: Joi.string().required(),
    members: Joi.array()
      .items({
        userId: Joi.number().required().max(constant.LENGTH_VALIDATIONS.ID),
        amount: Joi.number().required().max(constant.LENGTH_VALIDATIONS.AMOUNT),
      })
      .required()
      .min(1),
  }),
  sendOpenExpenseEmail: Joi.object().keys({
    email: Joi.string().email().optional().allow("", null),
    groupName: Joi.string().required().max(100),
    totalExpenses: Joi.number().optional().allow(0),
    totalAdvances: Joi.number().optional().allow(0),
    members: Joi.array()
      .items(
        Joi.object({
          name: Joi.string().required(),
          netBalance: Joi.number().optional().allow(0),
        })
      )
      .optional(),
    expenses: Joi.array()
      .items(
        Joi.object({
          description: Joi.string().required(),
          amount: Joi.number().required(),
          paidByName: Joi.string().required(),
          type: Joi.string().valid("expense", "advance").optional(),
          receiverName: Joi.string().optional().allow(null, ""),
          date: Joi.string().optional().allow(null, ""),
          shares: Joi.array()
            .items(
              Joi.object({
                memberName: Joi.string().required(),
                amount: Joi.number().required(),
              })
            )
            .optional(),
        })
      )
      .optional(),
    settlements: Joi.array()
      .items(
        Joi.object({
          from: Joi.string().required(),
          to: Joi.string().required(),
          amount: Joi.number().required(),
        })
      )
      .optional(),
  }),
};

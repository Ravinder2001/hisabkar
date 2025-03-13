const Joi = require("joi");
const constant = require("../../utils/constant/constant");

module.exports = {
  createTicket: Joi.object().keys({
    ticketType: Joi.string().valid("SUPPORT", "FEEDBACK", "BUG").required(),
    email: Joi.string().email().required().max(constant.LENGTH_VALIDATIONS.EMAIL),
    phone: Joi.string().optional().allow("").max(constant.LENGTH_VALIDATIONS.PHONE),
    description: Joi.string().required().max(constant.LENGTH_VALIDATIONS.DES),
    categoryId: Joi.when("ticketType", {
      is: "SUPPORT",
      then: Joi.number().required(),
      otherwise: Joi.forbidden(),
    }),
    priorityId: Joi.when("ticketType", {
      is: "BUG",
      then: Joi.number().required(),
      otherwise: Joi.forbidden(),
    }),
  }),
};

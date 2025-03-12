const Joi = require("joi");
const constant = require("../../utils/constant/constant");

module.exports = {
  createGroup: Joi.object().keys({
    groupTypeId: Joi.number().integer().required().max(constant.LENGTH_VALIDATIONS.ID),
    groupName: Joi.string().min(3).max(constant.LENGTH_VALIDATIONS.NAME).required(),
  }),
  joinGroup: Joi.object().keys({
    groupId: Joi.number().integer().required().max(constant.LENGTH_VALIDATIONS.ID),
    code: Joi.string()
      .length(6)
      .pattern(/^\d{6}$/)
      .required(),
  }),
  addGroupMember: Joi.object().keys({
    userIds: Joi.array().items(Joi.number().integer().required().max(constant.LENGTH_VALIDATIONS.ID)).required(),
  }),
  editGroupDetails: Joi.object().keys({
    groupName: Joi.string().min(3).max(constant.LENGTH_VALIDATIONS.NAME).required(),
    groupTypeId: Joi.number().integer().required().max(constant.LENGTH_VALIDATIONS.ID),
    removedMembers: Joi.array().items(Joi.number().integer()),
  }),
};

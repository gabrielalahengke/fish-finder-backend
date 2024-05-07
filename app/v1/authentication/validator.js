const Joi = require('joi');

const Schema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

const refreshTokenSchema = Joi.object({
  refresh_token: Joi.string().required(),
});

module.exports = { Schema, refreshTokenSchema };

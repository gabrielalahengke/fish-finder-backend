const Joi = require('joi');

const Schema = Joi.object({
  latitude: Joi.number().required(),
  longitude: Joi.number().required(),
});

module.exports = Schema;

const Joi = require('joi');

module.exports = {
  validateBody: (schema) => {
    return (req, res, next) => {
      const result = Joi.validate(req.body, schema);
      if (result.error) {
        return res.status(400).json(result.error);
      }

      if (!req.value) { req.value = {}; }
      req.value['body'] = result.value;
      next();
    }
  },

  schemas: {
    authSchema: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
      firstName:Joi.string(),
      lastName:Joi.string(),
      middleName:Joi.string(),
      houseNoStreet:Joi.string(),
      barangay:Joi.string(),
      city:Joi.string(),
      province:Joi.string(),
      zipcode: Joi.string(),
      userType: Joi.string()
    })
  }
}
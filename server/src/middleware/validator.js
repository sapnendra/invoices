const Joi = require('joi');

/**
 * Validate middleware wrapper
 */
const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));

      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors,
      });
    }

    next();
  };
};

/**
 * Payment validation schema
 */
const paymentSchema = Joi.object({
  amount: Joi.number()
    .positive()
    .precision(2)
    .required()
    .messages({
      'number.positive': 'Payment amount must be greater than 0',
      'number.base': 'Payment amount must be a number',
      'any.required': 'Payment amount is required',
    }),
  paymentDate: Joi.date()
    .max('now')
    .optional()
    .messages({
      'date.max': 'Payment date cannot be in the future',
    }),
});

/**
 * Archive/Restore validation schema
 */
const archiveSchema = Joi.object({
  invoiceId: Joi.string()
    .required()
    .messages({
      'any.required': 'Invoice ID is required',
    }),
});

module.exports = {
  validate,
  paymentSchema,
  archiveSchema,
};

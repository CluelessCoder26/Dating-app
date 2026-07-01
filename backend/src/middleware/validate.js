import { z } from 'zod';
import { ValidationError } from '../utils/errors.js';

export const validate = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (err) {
    if (err instanceof z.ZodError) {
      next(new ValidationError('Validation failed', err.errors));
    } else {
      next(err);
    }
  }
};

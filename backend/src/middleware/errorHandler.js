import logger from '../utils/logger.js';
import { AppError } from '../utils/errors.js';

export const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    logger.error(`[Error] ${err.message}`, { stack: err.stack });
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
      details: err.details || undefined
    });
  }

  // Production error response
  if (err.isOperational) {
    logger.warn(`[Operational Error] ${err.message}`);
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      details: err.details || undefined
    });
  }

  // Programming or other unknown errors: don't leak error details
  logger.error(`[Unhandled Error] 💥`, err);
  return res.status(500).json({
    status: 'error',
    message: 'Something went very wrong!'
  });
};

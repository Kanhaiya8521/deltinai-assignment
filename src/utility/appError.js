
export class AppError extends Error {
  statusCode;
  success;
  isOperational;

  constructor(message, statusCode) {
    super(message);
    this.message = message;
    this.statusCode = statusCode || 500;
    this.success = false;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const sendUnAuthorizedError = (res, message = "UNAUTHORIZED") => {
  try {
    return res.status(401).json({
      success: false,
      message
    });
  } catch (err) {
    throw err;
  }
};

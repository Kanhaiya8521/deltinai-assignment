import { Prisma } from "@prisma/client";

const sendErrorToDev = function (error, res) {
  return res.status(error.statusCode).json({
    success: error.success !== undefined ? error.success : false,
    error,
    message: error.message,
    stack: error.stack
  });
};

const sendErrorToProd = function (error, res) {
  if (error.constructor.name === "PrismaClientValidationError") {
    console.log(error.message);
    return res.status(400).json({ success: false, message: "Validation error" });
  } else {
    return res.status(error.statusCode).json({
      success: error.success !== undefined ? error.success : false,
      message: error.message
    });
  }
};

export default (err, req, res, next) => {
  err.statusCode = err.statusCode && typeof err.statusCode === "number" ? err.statusCode : 500;

  let isPrismaValidationError = err.constructor.name === "PrismaClientValidationError";
  let isPrismaKnownRequestError = err.constructor.name === "PrismaClientKnownRequestError";

  if (isPrismaKnownRequestError) {
    if (err.code === "P2002") {
      let name = err.meta?.target?.[0] || "field";
      return res.status(400).json({
        success: false,
        message: `This ${name} already exists. Please choose a different ${name}.`
      });
    }
  }

  if (!isPrismaValidationError) {
    if (process.env.NODE_ENV === "development") {
      return sendErrorToDev(err, res);
    } else {
      let error = { ...err, message: err.message };
      return sendErrorToProd(error, res);
    }
  } else {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/errorhandler";

module.exports = (err:any, req:Request, res:Response, next:NextFunction) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  //Wrong Mongodb Id Error
  if (err.name === "CastError") {
    const message = `Resource Not Found. Invalid : ${err.path}`;
    return ErrorHandler(message, 400, res, next);
  }

  //Mongodb duplicate key error
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(0)} Entered`;
    return ErrorHandler(message, 400, res, next);
  }

  //Wrong JWT  Error
  if (err.name === "JsonWebTokenError") {
    const message = `Json Web Token is invalid, try again`;
    return ErrorHandler(message, 400, res, next);
  }

  //JWT Expire Error
  if (err.name === "TokenExpiredError") {
    const message = `Json Web Token is Expired, try again`;
    return ErrorHandler(message, 400, res, next);
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};

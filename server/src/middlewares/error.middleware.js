// src/middleware/error.middleware.js
import { ZodError } from "zod";

export const notFoundHandler = (req, res, next) => {
  const err = new Error(`Not Found - ${req.originalUrl}`);
  err.statusCode = 404;
  next(err);
};

export const errorHandler = (err, req, res, next) => {
  // Zod validation errors
  if (err instanceof ZodError) {
    return res.status(400).json({
      message: "Validation error",
      status_code: 400,
      errors: err.issues.map((i) => ({
        path: i.path.join("."),
        message: i.message,
      })),
      stack: process.env.NODE_ENV === "production" ? null : err.stack,
    });
  }

  // Mongo duplicate key error (e.g. unique email/slug)
  if (err?.code === 11000) {
    const fields = Object.keys(err.keyValue || {});
    return res.status(409).json({
      message: `Duplicate value for: ${fields.join(", ")}`,
      status_code: 409,
      stack: process.env.NODE_ENV === "production" ? null : err.stack,
    });
  }

  // Invalid ObjectId (CastError)
  if (err.name === "CastError" && err.kind === "ObjectId") {
    return res.status(404).json({
      message: "Resource not found",
      status_code: 404,
      stack: process.env.NODE_ENV === "production" ? null : err.stack,
    });
  }

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    message: err.message || "Internal Server Error",
    status_code: statusCode,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

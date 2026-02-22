/* If a request reaches this middleware,
   it means no route has been matched for the requested URL */
const notFoundHandler = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

/* Global error handler */
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // Handle invalid MongoDB ObjectId errors
  if (err.name === "CastError" && err.kind === "ObjectId") {
    statusCode = 404;
    message = "Resource not found";
  }

  res.status(statusCode).json({
    message,
    status_code: statusCode,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

export { notFoundHandler, errorHandler };

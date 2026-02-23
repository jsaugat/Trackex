class AppError extends Error {
  constructor(message, statusCode) {
    super(message); // Call parent Error class constructor eg. new Error(message)
    this.statusCode = statusCode;
    this.isOperational = true; // Useful to distinguish known errors from bugs

    /**
     * Capture the stack trace starting from where this error
     * was instantiated, excluding this constructor function.
     *
     * This prevents the stack log from including internal
     * error class frames and makes debugging easier by showing
     * only the relevant application call path.
     */
    Error.captureStackTrace(this, this.constructor); // Error.captureStackTrace(targetObject, constructorToExclude)
  }
}

export default AppError;

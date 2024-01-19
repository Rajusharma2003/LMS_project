const errorMiddleware = (err, req, res, next) => {

  // if we cannot write any error so this is for safety purposes.
  err.message = err.message || 'something went wrong for error middleware';
  err.statusCode = err.statusCode || 500;

  return res.status(err.statusCode).json({
    success: false,
    message: err.message,
    stack : err.stack,
  });
};

export default errorMiddleware;

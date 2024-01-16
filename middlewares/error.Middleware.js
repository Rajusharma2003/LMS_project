// const errorMiddleware = (err , req , res , next) => {
 
//   console.log("enter middleware");
//     // if we cannot write any error so this is for a safety perpose.
//     err.message = err.message || 'something went worng for errormiddleware'
//     err.statusCode = err.statusCode || 500


//      return res.status(err.statusCode).json({
//         success : false,
//         message : err.message,
//         stack : err.stack

//       })
// }

// export default errorMiddleware






const errorMiddleware = (err, req, res, next) => {

  console.log("enter middleware");
  // if we cannot write any error so this is for safety purposes.
  err.message = err.message || 'something went wrong for error middleware';
  err.statusCode = err.statusCode || 500;

  return res.status(err.statusCode).json({
    success: false,
    message: err.message,
    stack : err.stack,
  });
};
console.log("exit middleware")
export default errorMiddleware;

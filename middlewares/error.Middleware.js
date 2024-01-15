const errorMiddleware = (err , res , req , next) => {
 
    // if we cannot write any error so this is for a safety perpose.
    err.message = err.message || 'something went worng for errormiddleware'
    err.statusCode = er.statusCode || 500


      res.status(err.statusCode).json({
        success : false,
        message : err.message,
        stack : err.stack

      })
}

export default errorMiddleware
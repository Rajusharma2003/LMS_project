import AppError from "../utils/appError.utils.js"
import jwt from "jsonwebtoken"


const isLoggedIn = async (req , res , next) =>{
    // get the user token for inside the cookies.
    const token = req.cookies.token

    console.log(token);
    // if cookies is not available the throw the error.
    if(!token) {
        return next( new AppError('User token is not available pls login ' , 400))
    }

    // extraect the cookies details by using 'jwt.verify'. 
    const userDetails = await jwt.verify(token , process.env.JWT_SECRET)

    // and finaly send the user info by "req.user"
    req.user = userDetails

    next()
}


export {
    isLoggedIn
}
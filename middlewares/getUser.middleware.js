import AppError from "../utils/appError.utils.js"
import jwt from "jsonwebtoken"


// used 1.=> getUser
const isLoggedIn = async (req , res , next) =>{
    // get the user token for inside the cookies.
    const token = req.cookies.token

    // if cookies is not available the throw the error.
    if(!token) {
        return next( new AppError('User token is not available pls login ' , 400))
    }

    // extrect the cookies details by using 'jwt.verify'. 
    const userDetails = await jwt.verify(token , process.env.JWT_SECRET)

    // and finaly send the user info by "req.user"
    req.user = userDetails

    next()
}


// This role is define inside the userSchema.
const authValidUserCheck = (...role) => async(req , res , next) => {

    const currentUserRole = req.user.role  //req.user have a full info bec we define inside the isLoggedIn => middleware  

    // check which role is inside the currentUserRole.
    if(!role.includes(currentUserRole)){

        return next(
            new AppError('You are not authorized for this type of work' , 403)
        )
    }

    next();
}


export {
    isLoggedIn,
    authValidUserCheck
}
import { LmsUser } from "../models/user.model.js"
import AppError from "../utils/appError.utils.js"

const cookieOptions = {
    maxAge : 7*24*60*60*1000 , //for days only
    httpOnly : true,
    secure : true
}

const register = async (req , res , next) => {

    // these all the perameter provide by the user from frontend.
    const {fullName , email , password} = req.body

    if(!fullName || !email || !password){
        return next(new AppError("all fields are required" , 400))
    }
   
    // check inside the db if user is already exist or not.
    const userExist =  await LmsUser.findOne({
        $or : [{email} , {fullName}]
    })

    if (userExist) {
        return next(new AppError("user is already exist" , 400))
    }

    // create user inside the db using .creater method.
    const user = await LmsUser.create({
        fullName,
        email,
        password,
        avatar : {
            public_id : email,
            secure_url : "give here the url"
        }
    })

    if (!user) {
        return next( new AppError('User registration failed , please try againg' , 400))
        
    }


    // flie upload 
    // Than we are save our data inside the db. by using .save method.
    await user.save()
    // when we are send res(allways do not send password so that way password is allways undefiend)
    user.password = undefined


    const token = user.generateJwtToken()


    res.cookies("token" , token , cookieOptions) //cookiesOption is a constant and define at the top.


    res.status(200).json({
        success : true,
        message : "user registration successfully",
        user,
    })

}


const login = (req , res ,next) =>{

  try {

    const {email , password} = req.body

    if(!email || !password) {
        return next(new AppError("email and password is required"))
    }

    // find inside the db user is exist or not.
    const user = LmsUser.findOne({ email }).select('+password')

    if (!user || !user.comparePassword(password)) {
        return next(new AppError("user is not exist please register yourself" , 400))
    }

    // if user is exist then we create jwt and send this req.
    const token = user.generateJwtToken()
    user.password = undefined;

    res.cookies("token" , token , cookieOptions )

    
    res.status(200).json({
        success : true,
        message : 'User loggedin successfully',
        user
    })

  } catch (error) {
    return next(new AppError(error.message , 500))
  }


}

const logout = (req , res , next) => {

    res.cookies( " token" , null , {
        secure : true,
        maxAge : 0,
        httpOnly : true
    })


    res.status(200).json({
        success : true,
        message : 'User logged out successfully'
    })
}

const getProfile = ( req , res , next) => {

}




export {
    register,
    login,
    logout,
    getProfile
}
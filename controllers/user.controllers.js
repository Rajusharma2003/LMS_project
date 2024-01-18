
import { LmsUser } from "../models/user.model.js"
import AppError from "../utils/appError.utils.js"
import cloudinary from "cloudinary"
import fs from "fs/promises"

const cookieOptions = {
    maxAge : 7*24*60*60*1000 , //for days only
    httpOnly : true,
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
        return next( new AppError('User registration failed , please try again' , 400))
        
    }


    // flie upload 
 
    console.log('file details' , JSON.stringify(req.file));
    if(req.file){

      try {
        
        const result = await cloudinary.v2.uploader.upload(req.file.path , {    //how to upload filename and somemodification
           folder : "lms",
           width : 250,
           height : 250,
           gravity : "faces",
           crop : "fill"
        } );

        if(result){
          user.avatar.public_id = result.public_id;  //replace your public_id and secure_url to cloudinary public_id and secure_url
          user.avatar.secure_url = result.secure_url;

          // when file upoaded remove from our server.
          fs.rm(`upload/${req.file.filename}`)
        }
        
      } catch (error) {
        return next( new AppError( 'your file is not uploaded successfully'))
      }
    }
    // Than we are save our data inside the db. by using .save method.
    await user.save() 
    // when we are send res(allways do not send password so that way password is allways undefiend)
    user.password = undefined

// generate jwt token
    const token = await user.generateJwtToken()

    res.cookie("token" , token , cookieOptions) //cookiesOption is a constant and define at the top.


    res.status(200).json({
        success : true,
        message : "user registration successfully",
        user,
    })

}



const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new AppError("email and password is required"));
    }

    // find inside the db user is exist or not base on email.
    const user = await LmsUser.findOne({ email }).select("+password");

    if (!(user && (await user.comparePassword(password)))) {
      return next(
        new AppError("user is not exist please register yourself", 400)
      );
    }

    // if user is exist then we create jwt and send this req.
    const token = await user.generateJwtToken();
    user.password = undefined;

    // send the user info inside the db.
    res.cookie("token", token, cookieOptions); //cookiesOPtion is constant at the top.

    // And finally send the success info and the user data.
    res.status(200).json({
      success: true,
      message: "User loggedin successfully",
      user,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};



const logout =async (req , res , next) => {

  const { email , password} = req.body

  // if you are not enter your every field.
  if (!email || !password){
    return next( new AppError("pls fill all the fields every field is required" , 400 ))
  }

  // check if user is exist or not if it is not exist they can not be able to logout.
  const userExisted =await LmsUser.findOne({ email }).select('+password')

  // check 
  if(!(userExisted && await(userExisted.comparePassword(password)))){
    return next( new AppError('your are not exist pls login and then try again'))
  }



    // In the logout section send the "cookie" always null 
    res.cookie( " token" , null , {
        secure : true,
        maxAge : 0,
        httpOnly : true
    })


    res.status(200).json({
        success : true,
        message : 'User logged out successfully'
    })
}

const getProfile = async ( req , res , next) => {

   try {
     // get the user id by the user.
     const userInfo = req.user.id;
     // and check the user is exist or not inside the db.
     const user = await LmsUser.findById(userInfo)
 
     res.status(200).json({
         success : true,
         message : 'your details is fetch successfully',
         user
     })
   } catch (error) {
    return next( new AppError("failed to fetch profile" , 400))
   }
}




export {
    register,
    login,
    logout,
    getProfile
}
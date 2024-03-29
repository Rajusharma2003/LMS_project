
import {LmsUser}  from "../models/user.model.js"
import AppError from "../utils/appError.utils.js"
import cloudinary from "cloudinary"
import fs from "fs/promises"
import sendMail from "../utils/sendEmail.utils.js"
import crypto from "crypto"

const cookieOptions = {
    maxAge : 7*24*60*60*1000 , //for 7 days only
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
        $or : [{email}]
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
    // console.log('file details' , JSON.stringify(req.file));
    if(req.file){

      try {
        
        // cloudinary config is set inside the index.js
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
        new AppError("user and password is not match or exist please register yourself", 400)
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
    return next( new AppError("pls give me email and password every field is required" , 400 ))
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
     const userInfo = req.user.id;  //we get the user details inside the ("req.user") from isLoggedIn middleware.
     
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


const forgotPassword = async (req , res , next) => {

  const {email} = req.body

  if(!email){
    return next( new AppError('pls fill the email field' ,400))
  }

  // check user is available inside the db.
  const user = await LmsUser.findOne({email})

  if(!user){
    return next( new AppError('email is not register' , 500))
  }


  // ResetToken is created.
  const resetToken = await user.generateResetPasswordToken();  //this is a method inside the model.js
console.log(resetToken);

  // after the token was created we can save inside the db.
  await user.save()


  // this is a frontend url we can send our url inside the user mail.
  const resetTokenUrl = `${process.env.FRONTEND_URL}/forgot-Password/${resetToken}`  //this is a frontend url

  // send email funcrion.
console.log(resetTokenUrl);
const subject = 'forgot-Password'
const message = `You can reset your password by clicking <a href=${resetTokenUrl} target="_blank"> reset your password </a>\nif the above link does not work for some resion then copy past this link in new tab ${resetTokenUrl} .\n if you have not requested this , kindly ignore it`

  try {
    // send mail inside the utils files.
    await sendMail(email , subject , message)


    res.status(200).json({
      success : true,
      message : `email is sending successfull on your email ${email}`
    })

    
  } catch (error) {

    user.forgotPasswordToken = undefined
    user.forgotPasswordExpiry = undefined

    await user.save()
    return next ( new AppError(error.message , 500))
  }

}





const resetPassword = async (req , res , next) => {

  // get a resetToken from req.params.
  const {resetToken} = req.params;

  // get a resetToken from req.body
  const {password} = req.body;

  if(!password) {
    return next( new AppError('pls enter the Password field is required ' , 400))
  }

  // this is for checking url("resetToken") who we are send to user same or not
  const forgotPasswordToken = crypto
                                     .createHash('sha256')
                                     .update(resetToken)
                                     .digest('hex')

  // for checking ("forgotPasswordToken") and ("forgotPasswordExpiry") inside the db.
  const user =  await LmsUser.findOne({  //await is improtent
    forgotPasswordToken,
    forgotPasswordExpiry : { $gt : Date.now()}
  })
 
  console.log({ "userdataishere" : user});

  if(!user){
    return next( new AppError('Token is invailed or Expired , pls try again' , 400))
  }

  // change password to new password.
  user.password = password
  // when password is changed we also set undefined the ("forgotPasswordExpiry") and ("forgotPasswordToken")
  user.forgotPasswordToken = undefined
  user.forgotPasswordExpiry = undefined

  // And finally save all the data inside the db.
   await user.save()


  res.status(200).json({
    success : true,
    message : 'Your password is changed successfully'
  })

}



const changePassword = async (req , res , next) => {

  const {oldPassword , newPassword} = req.body
  // 'req.user' is define inside the "isLoggedin" middlerware save all the user info.
  const {id} = req.user

  if(!oldPassword || !newPassword){
    return next( new AppError("All fields are menditary" , 400))
  }

  try {
    
    // search inside the db is user exist there.
  const user = await LmsUser.findById(id).select("+password")

  if(!user){
    return next( new AppError("User details is not found" , 400))

  }

  // campare new and old password indsidet this.
  const vaildPassword = await user.comparePassword(oldPassword);

  if(!vaildPassword){
    return next( new AppError("password does not match successfully pls try again" , 400))
  }

  // if all condition is good than change the old password.
  user.password = newPassword
  // and finally save inside the db.
 await user.save()
//  and always remember send anything you undefined the password.
 user.password = undefined

  res.status(200).json({
    success : true,
    message : ' password changed successfully'

  })
  } catch (error) {
     return next ( new AppError('Error changing password'))
  }

}



const updateProfile = async (req , res , next) => {

  // get the user name by user.
const {fullName } = req.body

const {id} = req.user   // user info save inside the isLoggenin method.


try {

// find the user is exist or not inside the db.
const user = await LmsUser.findById(id)

if(!user){
  return next ( new AppError('user is does not exist pls try again' , 400))
}

// if user is send New fullName then change the old fullName inside the db.
if(fullName){
user.fullName = fullName
}

// if user is send our new user profile then we use "destroy" inside the coudinary and upload new image.
if(req.file){
  // delete the old image in cloudinary.
  await cloudinary.v2.uploader.destroy(user.avatar.public_id)


  // past

  try {
        
    // upload new image inside the cloudinary.
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

// And also save all the information inside the db.
await user.save()

res.status(200).json({
  success : true,
  message : 'user update successfully'
})
  
} catch (error) {
  
  return next( new AppError('Error to update user profile' , 400))
}



}

export {
    register,
    login,
    logout,
    getProfile,
    forgotPassword,
    resetPassword,
    changePassword,
    updateProfile
}


















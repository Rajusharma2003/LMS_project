import { LmsUser } from "../models/user.model"
import AppError from "../utils/appError.utils"

const register = async (req , res , next) => {

    const {fullName , email , password} = req.body

    if(!fullName || !email || !password){
        return next(new AppError("all fields are required" , 400))
    }
   
    
    const userExist =  await LmsUser.findOne({
        $or : [{email} , {fullName}]
    })

    if (userExist) {
        return next(new AppError("user is already exist" , 400))
    }




}


const login = (req , res ,next) =>{

}

const logout = (req , res , next) => {

}

const getProfile = ( req , res , next) => {

}




export {
    register,
    login,
    logout,
    getProfile
}
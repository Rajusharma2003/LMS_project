import Course from "../models/coursesSchema.models.js"
import AppError from "../utils/appError.utils.js"

const courses = async function (req , res , next ) {

    try {
    const courses = await Course.find({}).select("-lectures")

    if(!courses){
        return next(
            new AppError("there is no courses pls create some courses" , 400)
        )
    }


    res.status(200).json({
        success : true,
        message : "This is your courses",
        courses
    })
        
    } catch (error) {
        return next(
            new AppError('Not able to find courses pls try again' , 500)
        )
    }
}


const getLetcureByCourseId = async function (req , res ,next) {

}


export {
    courses,
    getLetcureByCourseId
}
import Course from "../models/coursesSchema.models.js"
import AppError from "../utils/appError.utils.js"

const courses = async function (req , res , next ) {

    try {

    const courses = await Course.find({}).select("-lectures");

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

    try {
        
        const {id} = req.params;
        const courses = await Course.findById(id);

        if(!courses){
            return next(
                new AppError('courses lecture in not find' , 400)
            )
        }

        req.status(200).json({
            success : true,
            message : 'courses lecture is fetch successfully',
            lectures : courses.lectures
        })
    } catch (error) {
        return next(
            new AppError(error.message , 500)
        )
    }
}


export {
    courses,
    getLetcureByCourseId
}
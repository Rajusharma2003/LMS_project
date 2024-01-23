import Course from "../models/coursesSchema.models.js"
import AppError from "../utils/appError.utils.js";
import cloudinary from 'cloudinary';
import fs from 'fs'

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


const createCoures = async function (req , res , next) {

    try {
        
        const {title , description , category , createdBy  } = req.body

    if(!title || !description || category || createdBy){
        return next(
            new AppError('All fields are required' , 400)
        )
    }


    // create instence.
    const course = await Course.create({
        title,
        description,
        category,
        createdBy,
        thumbnail : {
            public_id : 'dummy',
            secure_url : 'dummy', //because these file is required.
        }
    })

    if(!course){
        return next(
            new AppError('!! Error course could not created ' , 500)
        )
    }


    if(req.file){

        try {

            const result = await cloudinary.v2.uploader.upload(req.file.path , {
                folder : 'lms'
            })
    
            if(result){
                course.thumbnail.public_id = result.public_id;
                course.thumbnail.secure_url = result.secure_url;
            }
    
            fs.rmSync(`upload/${req.file.filename}`);

        } catch (error) {
            return next(
                new AppError('!! Error file is not upload successfully' , 500)
            )
        }
      
    }

    await course.save();

    res.status(200).json({
        success : true,
        message : 'course created successfully'
    });

    } catch (error) {
        
        return next(
            new AppError(' !! Error course created unsuccessfully' , 500)
        )
    }




}


const updateCoures = async function (req , res , next) {

 try {
    
    const {id} = req.params;

 
    const course = await Course.findByIdAndUpdate(id,{$set : req.body} , {runValidators : true})

    if(!course){
        return next(
            new AppError('coures with given id does not exist !! try again')
        )
    }


    res.status(200).json({
        success : true,
        message : 'course updated successfully'
    });


 } catch (error) {
    return next(
        new AppError('!! Error coures is not update successfully !! try again')
    )
 }


}


const deleteCoures = async function (req , res , next) {

}

export {
    courses,
    getLetcureByCourseId,
    createCoures,
    updateCoures,
    deleteCoures
}
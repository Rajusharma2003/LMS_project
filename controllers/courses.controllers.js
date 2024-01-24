import Course from "../models/coursesSchema.models.js"
import AppError from "../utils/appError.utils.js";
import cloudinary from 'cloudinary';
import fs from 'fs/promises'

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
        
        // get all the details from the user.
        const {title , description , category , createdBy } = req.body


        // check some condition 
    if(!title || !description || !category || !createdBy){
        return next(
            new AppError('All fields are required' , 400)
        )
    }


    // create instence inside the database.
    const course = await Course.create({
        title,
        description,
        category,
        createdBy,
        thumbnail : {
            public_id : 'dummy',
            secure_url : 'dummy', //because these file is required.
        },
    })

    // console.log(course);


    if(!course){
        return next(
            new AppError('!! Error course could not created ' , 500)
        )
    }


    // Incase user send any file then this feature is exicute.
    if(req.file){
    // console.log(req.file);

        try {

            // upload on cloudinary
            const result = await cloudinary.v2.uploader.upload(req.file.path , {
                folder : 'lms'
            })
    
            // set config 
            if(result){
                course.thumbnail.public_id = result.public_id;
                course.thumbnail.secure_url = result.secure_url;
            }
    
            // when file is upload successfully file is remove inside the local server.
            fs.rm(`upload/${req.file.filename}`);

        } catch (error) {
            console.log(error.message);
            return next(
                new AppError('!! Error file is not upload successfully' , 500)
            )
        }
      
    }

    // And finally save all the data inside the database.
    await course.save();

    res.status(200).json({
        success : true,
        message : 'course created successfully'
    });

    } catch (error) {
        console.log(error.message);
        return next(
            new AppError(' !! Error course created unsuccessfully' , 500)
        )
    }


}




const updateCoures = async function (req , res , next) {

 try {
    
    const {id} = req.params;

 
    const course = await Course.findByIdAndUpdate(id, {$set : req.body} , {runValidators : true})

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

    try {
        
        const {id} = req.params;

    const course = Course.findById(id);

    if(!course){
        return next(
            new AppError('coures with given id does not exist !! try again')
        )
    }

    await course.findByIdAndDelete(id)

    res.status(200).json({
        success : true,
        message : 'Your course is delete successfully'
    })


    } catch (error) {
        return next(
            new AppError('!! Error coures is not delete successfully !! try again')
        )
    }



}

export {
    courses,
    getLetcureByCourseId,
    createCoures,
    updateCoures,
    deleteCoures
}
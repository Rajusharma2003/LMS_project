
import multer from "multer"
import path from "path"


const upload = multer({

    dest : "upload/",

    limits : { fileSize :50*1024*1024},  //50mb in size max limit.
    
    // how to upload this is a storage type.
    storage : multer.diskStorage({
        // we know about the diskstorage inside this there is two object "destination" , "filename"

        destination : "upload/",
        filename : (_req , file , cb) => {
            cb( null , file.originalname)
        }
    }),

    // some important check is here.

    fileFilter : (_req , file , cb) => {

        let fileExistType = path.extname(file.originalname)

        if (fileExistType !== ".jpg" 
             &&
             fileExistType !== ".jpeg"
             &&
             fileExistType !== ".png"
             &&
             fileExistType !== ".mp4"
             &&
             fileExistType !== ".webp") {
            
                cb( new Error(`unsupported file type ${fileExistType}` , false));
                return;
        }

        cb(null , true)
    }
})


export default upload

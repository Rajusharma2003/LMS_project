import {  Schema, model } from "mongoose";


const courseSchema = new Schema({

    title : {
        type : String,
        required : [true , "title is required"],
        minlength : [8 , "title should be at least 8 characters"],
        maxlength : [59 , "title should be less than 59 characters"],
        trim : true
    },

    description : {
        type : String,
        required : [true , "description is required"],
        minlength : [8 , "description should be at least 8 characters"],
        maxlength : [200 , "description should be less than 200 characters"],

    },

    category : {
        type : String,
        required : [true , "category is required"],

    },

    thumbnail : {
        public_id : {
            type: 'String'
        },

        secure_url : {
            type: 'String'
        }
    },

    lectures : [
        {
            title : {
                type : String
                //if you can add some validation.
            },

            description : {
                type : String
                //if you can add some validation.
            },

            lecture : {
                public_id : {
                    type: String,
                    
                },
        
                secure_url : {
                    type: String,
                    
                }
            }


        }
    ],


    numberOfLectures : {
        type : Number,
        default : 0
    },

    createdBy : {
        type : String,
        required : true,
        

    }


} , {
    timestamps : true
})


const Course = model( "Course" , courseSchema)

export default Course
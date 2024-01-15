import { Schema , model  } from "mongoose"



const userSchema  = new Schema({

    fullName : {
        type : 'String',
        required : [true , "username is required"], //check username field is not empty.
        minlength : [5 , 'Name must be at least 5 character'],
        maxlength : [50 , 'Name should be less than 50 characters'],
        lowercase : true,
        trim : true
    },

    email : {
        type : 'String',
        required : [true , "email is required"], //check email is define or not.
        lowercase : true,
        trim : true,
        unique : true

    },

    password : {
        type : 'String',
        required : [true , "password is required"],  //check password is define or not.
        select : false
    },

    role : {
        type : "String",
        enum : ['USER' , 'ADMIN'],
        default : 'USER'
    }, 

    avatar : {
        public_id : {
            type: 'String'
        },

        secure_url : {
            type: 'String'
        }

    },

    forgotPasswordToken : String,
    forgotPasswordExpiry : Date



}, {
    timestamps : true
})



export const LmsUser = model("LmsUser" , userSchema)
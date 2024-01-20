import { Schema , model  } from "mongoose"
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'


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


// This code for bcrypt our password for more security.
userSchema.pre("save" ,async function (next) {

    // condition if password is modified then we can change it otherwise we not.
    if (!this.isModified("password")) {
        return next()
    }

    // if its changed then.
    this.password = await bcrypt.hash(this.password , 10)
})

// create jwt token for store all the user info inside this token.
userSchema.methods = {
    // create a method for store all the info about the user inside the jwt token.
    generateJwtToken : async function() {
        return await jwt.sign(
            {id : this._id , email : this.email , subscription : this.subscription , role : this.role},

            process.env.JWT_SECRET,

            {
               expiresIn : process.env.JWT_EXPIRY
            }
        )
    },

    // Create a method for campare password.
    comparePassword : async function(plainTextPassword){
        return await bcrypt.compare(plainTextPassword , this.password)
    },


    generateResetPasswordToken :async function () {

        // create a reset Token url.
        const resetToken = crypto.randomBytes(20).toString('hex');

        // save all the user info inside the db for double check the user.
        this.forgotPasswordToken = crypto
                                         .createHash('sha256')
                                         .update(resetToken)
                                         .digest('hex');

        this.forgotPasswordExpiry = Date.now() + 50 * 60 * 1000; // vaild upto 15 min.
        return resetToken  // if you not return the resetToken the url is show ("undefiend").
    }


}





export const LmsUser = model("LmsUser" , userSchema)
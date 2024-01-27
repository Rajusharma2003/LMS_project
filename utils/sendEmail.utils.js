// import here the nodemailer code.
import nodemailer from "nodemailer"
import AppError from "./appError.utils.js";


// use inside the forgot password
const sendMail = async function(email , subject , message ){
try {


  if(!email || !subject || !message){
    return next(
      new AppError("email subject message are not available pls give all the information" , 403)
    )
  }
    
    // console.log('email :'  , email);
    // console.log('message :'  , message);
    // console.log('subject :'  , subject);
    
    // there all property get from the mailtrap website.
let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port : process.env.SMTP_PORT,
    secure : false,
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD,
    },
  
  });
  
  
  
   await transporter.sendMail({
      from : process.env.SMTP_FROM_EMAIL,  // sender email.
      to : email,  // user email
      subject : subject,  // subject line
      html : message  // html body    
  
   })


} catch (error) {
    return next( new AppError('Error sending email' , error , 400))
    
}

}

export default sendMail


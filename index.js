import app from"./app.js";
import connectionToDb from "./config/dbConnection.js";
import cloudinary from 'cloudinary';
import razorpay from "razorpay"



// This all config is from cloudinary website.
cloudinary.v2.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.API_KEY, 
  api_secret: process.env.API_SECRET 
});


export const razorpay = new Razorpay({
      key_id : process.env.RAZORPAY_KEY_ID, 
      key_secret : process.env.RAZORPAY_SECRET  //input here
}) 

const PORT = process.env.PORT || 5000

app.listen( PORT , async () => {
    await connectionToDb() // before app the listenting check the db is successfully connected or not.
    console.log(`server is listen at http://localhost:${PORT}`);
})
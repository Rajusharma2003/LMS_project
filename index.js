import app from"./app.js"
import connectionToDb from "./config/dbConnection.js";
import cloudinary from 'cloudinary'



          
cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.API_KEY, 
  api_secret: process.env.API_SECRET 
});

const PORT = process.env.PORT || 5000

app.listen( PORT , async () => {
    await connectionToDb() // before app the listenting check the db is successfully connected or not.
    console.log(`server is listen at http://localhost:${PORT}`);
})
import mongoose from "mongoose";

mongoose.set("strictQuery" , false) 

// Connected db 
const connectionToDb = async () => {

    try {
        const connectionUrl =  await mongoose.connect(process.env.MONGO_URL)
    
        // conditons for check Db is connected or not .
        if (connectionUrl) {
            console.log(`Your db is connected successfully ${connectionUrl.connection.host}`);
    
        }
    } catch (e) {
        console.log(`${e} db connection is not successfully`)
        process.exit(1)
        
    }
   
}

export default connectionToDb
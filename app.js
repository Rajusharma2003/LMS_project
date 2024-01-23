import  express, { urlencoded } from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import errorMiddleware from "./middlewares/error.Middleware.js"
import router from "./routers/user.router.js"
import courseRouter from "./routers/course.router.js"

import {config} from'dotenv'
config()

import morgan from "morgan"  // if any person access a random request so "morgan" => is a nodejs middleware , print the error in our terminal.

// made a app with the help of express.
const app = express()




// some middleware
app.use(express.urlencoded({extended : true}))
// read and expect the json data.
app.use(express.json())
// set cors were you sent your origin only accept all type of request form this root.
app.use(cors({
    origin:[ process.env.FRONTEND_URL],
    credentials : true
}))
// filter the cookie and help to extrect the user data.
app.use(cookieParser())
// tell were user send request and also handle the error.
app.use(morgan("dev"))
  

// import router form here for control all the routers.
app.use("/users" , router)
app.use('/api/v1/courses' , courseRouter)

// This is a demo 
app.use('/ping' , function(req , res){
    res.send('pong')
})
// if user access any default router who we can not made.
app.all('*' , (req , res) => {
    res.send("OPPS !! error 404 page not found")
})

// this is a middleware to handle all type of error.
app.use(errorMiddleware)

export default app
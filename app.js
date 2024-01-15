import  express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import {config} from'dotenv'
config()

import morgan from "morgan"  // if any person access a random request so "morgan" => is a nodejs middleware , print the error in our terminal.

// made a app with the help of express.
const app = express()




// some middleware
app.use(express.json())
app.use(cors({
    origin:[ process.env.FRONTEND_URL],
    credentials : true
}))
app.use(cookieParser())
app.use(morgan("dev"))
  

// import router form here for control all the routers.
import router from "./routers/user.router"
import errorMiddleware from "./middlewares/error.Middleware"
app.use("api/v1/users" , router)


// if user access any default router who we can not made.
app.all('*' , (req , res) => {
    res.send("OPPS !! error 404 page not found")
})

app.use(errorMiddleware)

export default app
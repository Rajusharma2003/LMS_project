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
  


app.get('/demo' , (req , res) => {
    res.status(200).json({
        success : true,
        message : "The demo site is working properly"
    })
})

app.all('*' , (req , res) => {
    res.send("OPPS !! error 404 page not found")
})


export default app
import Router from "express"
import { getProfile, login, logout, register } from "../controllers/user.controllers.js"
import { isLoggedIn } from "../middlewares/getUser.middleware.js"


const router = Router()


router.post("/register" , register )
router.post("/login" , login )
router.post("/logout" , logout )
router.get("/me" , isLoggedIn, getProfile ) // isLoggedIn is a middleware.



export default router
import Router from "express"
import { changePassword, forgotPassword, getProfile, login, logout, register, resetPassword, updateProfile } from "../controllers/user.controllers.js"
import { isLoggedIn } from "../middlewares/getUser.middleware.js"
import upload from "../middlewares/multer.middleware.js"


const router = Router()


router.post("/register" , upload.single("avatar") , register )
router.post("/login" , login )
router.post("/logout" , logout )
router.get("/me" , isLoggedIn, getProfile ) // isLoggedIn is a middleware.
router.post("/forgotPassword" , forgotPassword)
router.post("/resetPassword/:resetToken" , resetPassword)
router.post("/changePassword" , isLoggedIn , changePassword)
router.put( "/update" , isLoggedIn , upload.single("avatar") , updateProfile )


export default router
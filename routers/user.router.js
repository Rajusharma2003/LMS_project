import Router from "express"
import { getProfile, login, logout, register } from "../controllers/user.controllers"


const router = Router()


router.post("/regsiter" , register )
router.post("/login" , login )
router.post("/logout" , logout )
router.post("/me" , getProfile )



export default router
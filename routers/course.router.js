
import {Router} from 'express'
import { courses, getLetcureByCourseId } from '../controllers/courses.controllers.js'

const router = Router();



router.get("/" , courses)
router.get("/" , getLetcureByCourseId)


export default router
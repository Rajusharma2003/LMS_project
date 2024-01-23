
import {Router} from 'express'
import { courses, getLetcureByCourseId } from '../controllers/courses.controllers.js'
import { isLoggedIn } from '../middlewares/getUser.middleware.js';

const router = Router();

router.route("/").get(courses)
router.route('/:id').get(isLoggedIn , getLetcureByCourseId)

// router.get("/" , courses);
// router.get("/:id" , isLoggedIn, getLetcureByCourseId);


export default router
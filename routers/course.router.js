
import {Router} from 'express'
import { courses, createCoures, deleteCoures, getLetcureByCourseId, updateCoures } from '../controllers/courses.controllers.js'
import { isLoggedIn } from '../middlewares/getUser.middleware.js';
import upload from '../middlewares/multer.middleware.js';

const router = Router();

router.route("/")
            .get(courses)
            .post(
                upload.single('thumbnail'),
                createCoures)
router.route('/:id')
            .get(isLoggedIn , getLetcureByCourseId)
            .put(updateCoures)
            .delete(deleteCoures)

// router.get("/" , courses);
// router.get("/:id" , isLoggedIn, getLetcureByCourseId);


export default router
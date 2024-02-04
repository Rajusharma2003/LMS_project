
import {Router} from 'express'
import { addLectureToCourseById, courses, createCoures, deleteCoures, deleteLecture, getLetcureByCourseId, updateCoures } from '../controllers/courses.controllers.js'
import { authValidUserCheck, isLoggedIn } from '../middlewares/getUser.middleware.js';
import upload from '../middlewares/multer.middleware.js';

const router = Router();

router.route("/")
            .get(courses)
            .post(
                isLoggedIn, // getUser midddleware.
                authValidUserCheck("ADMIN"), //getUser middleware.
                upload.single('thumbnail'), //middleware
                createCoures)

router.route('/:id')
            .get(
                isLoggedIn,
                getLetcureByCourseId)

            .put(
                isLoggedIn,
                authValidUserCheck("ADMIN"),
                updateCoures)

            .delete(
                isLoggedIn,
                authValidUserCheck("ADMIN"),
                deleteCoures)

            .post(
                isLoggedIn,
                authValidUserCheck("ADMIN"),
                upload.single('lecture'), //middleware
                addLectureToCourseById
            )


            .delete(
                isLoggedIn,
                authValidUserCheck("ADMIN"),
                deleteLecture
            )    

// router.get("/" , courses);
// router.get("/:id" , isLoggedIn, getLetcureByCourseId);


export default router
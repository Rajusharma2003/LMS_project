import { Router } from "express";
import { allPayment, buySubscription, cancelSubscription, getRazorpayApiKey, verifySubscription } from "../controllers/payments.controllers.js";
import { authValidUserCheck, isLoggedIn } from "../middlewares/getUser.middleware.js";


const router = Router();


router
      .route("/razorpay-key")
      .get(getRazorpayApiKey)


router
      .route("/subscription")
      .post(
        isLoggedIn,
        buySubscription
        )


router
      .route("/verify")
      .post(
        isLoggedIn,
        verifySubscription
        )


router
      .route('/unsubscription')
      .post(
        isLoggedIn,
        cancelSubscription
        )


router
      .route('/')
      .post(
        isLoggedIn,
        authValidUserCheck("ADMIN"),
        allPayment
        )



export default router
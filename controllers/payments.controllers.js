import  {razorpay}  from '../index.js'
import Payment from "../models/payment.Schema.js"
import { LmsUser } from "../models/user.model.js"
import AppError from "../utils/appError.utils.js"
import crypto from 'crypto'

export const getRazorpayApiKey = async (req , res , next) => {

    try {
        
        res.status(200).json({
            success : true,
            message : 'Razorpay-Api-key',
            key : process.env.RAZORPAY_KEY_ID  
        })
    } catch (error) {
        return next(
            new AppError(error.message, 500)
        )
    }
} 


export const buySubscription = async (req , res , next) => {
    
    try {
        
        const {id} = req.user
    
        const user = await LmsUser.findById(id)
    
        if(!user){
            return next(
                new AppError('unAuthorized , pls login' , 400)
            )
        }
    
        if(user.role === "ADMIN"){
            return next(
                new AppError('Admin cannot purchase subscription' , 400)
            )
        }
    
        const subscription = await razorpay.subscriptions.create({
            plan_id : process.env.RAZORPAY_PLAN_ID,
            customer_notify : 1
        })
        
        
        user.subscription.id = subscription.id;
        user.subscription.status = subscription.status;
    
        await user.save();
    
    
        res.status(200).json({
            success : true,
            message : 'Subscription successfully',
            subscription_id : subscription.id
        })
    } catch (error) {
        return next(
            new AppError(error.message, 500)
        )
    }




} 



export const verifySubscription = async (req , res , next) => {
    
    try {
        
        const {id} = req.user
        const {razorpay_payment_id , razorpay_subscription_id , razorpay_signature} = req.body
    
        const user = await LmsUser.findById(id)
    
        if(!user){
            return next(
                new AppError('unAuthorized user pls login' , 400)
            )
        } 
    
        const subscription_id =  user.subscription.id
    
        const generatedSignature = crypto
                                         .createHmac( 'sha256' , process.env.RAZORPAY_SECRET)
                                         .update(`${razorpay_payment_id} | ${subscription_id}`)
                                         .digest('hex')
    
        if(generatedSignature !== razorpay_signature){
            return next(
                new AppError('payment is not verify pls try again' , 400)
            )
        }
    
    
    
        await Payment.create({
            razorpay_payment_id,
            razorpay_subscription_id,
            razorpay_signature
    
        })
    
        user.subscription.status = "active"
        await user.save();
    
        res.status(200).json({
            success : true,
            message : 'payment verify successfully !',
    
        })
    } catch (error) {
        return next(
            new AppError(error.message, 500)
        )
    }


} 


export const cancelSubscription = async (req , res , next) => {
    
    try {
        
        // get user is from isLoggedin middleware.
        const {id} = req.user
    
        // check user is exist or not.
        const user = await LmsUser.findById(id)
    
        if(!user){
            return next(
                new AppError('unAuthorized , pls login' , 400)
            )
        }
    
        if(user.role === "ADMIN"){
            return next(
                new AppError('Admin cannot purchase subscription' , 400)
            )
        }
    
    
        // get subscription_id from save our user details.
        const subscription_id = user.subscription.id
    
        // set cancel_subscription.
        const cancelSubscription = await razorpay.subscriptions.cancel(subscription_id) 
    
        // cancel subscription status.
        user.subscription.status = cancelSubscription.status
    
        // and finally save inside the db.
        await user.save();


    } catch (error) {
        console.log('error inside to cancel subscriptions');
        return next(
            new AppError(error.message, 500)
        )
    }

} 


export const allPayment = async (req , res , next) => {
    
} 
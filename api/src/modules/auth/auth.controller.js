import bcrypt, { hashSync } from 'bcrypt'
import { customAlphabet } from "nanoid"
import { User } from "../../../database/index.js"
import { AppError } from "../../utils/appError.js"
import { messages } from "../../utils/constant/messages.js"
import { sendEmail } from '../../utils/email.js'
import { generateToken, verifyToken } from '../../utils/token.js'

const generateOTP = customAlphabet("0123456789", 5)
// signup
export const signup = async(req,res,next)=>{
    // get data from req
    let { firstname,lastname, email , password ,recoveryEmail , phone } = req.body
    // check existance
    const userExist = await User.findOne({$or: [{email},{phone}]})
    if(userExist){
        return next(new AppError(messages.user.alreadyExist ,409))
    }
    // hash password
    const hashedPassword = bcrypt.hashSync(password, 8);

    const otp = generateOTP();
    const otpExpired = Date.now() + 9 * 60 * 1000
    // prepare data
    const user = new User({
        firstname,
        lastname,
        email,
        recoveryEmail,
        password:hashedPassword,
        phone,
        otp , 
        otpExpired
    })
    // add to database
    const createdUser = await user.save()
    if(!createdUser){
        return next(new AppError(messages.user.failToCreate ,500))
    }
    // generate token
    const token =  generateToken({payload:{email , _id : createdUser._id} })
    // send email
    sendEmail({
        to: email ,
        subject:"confirm your email" , 
        html :`<p>Your OTP is ${otp} to confirm your email click <a href='${req.protocol}://${req.headers.host}/auth/verify/${token}'>link</a></p>`})
     
    // send response
    return res.status(201).json({
        message: messages.user.createdSuccessfully,
        success: true,
        data: createdUser
    })
}
// confirm email
export const confirmEmail = async (req,res,next) =>{
    const {email , otp} = req.body
   
    const user = await User.findOne({email})
    if(!user){
        return next(new AppError(messages.user.invalidCredentials, 404))
    }
   if(user.confirmEmail === true){
        return next(new AppError("Email already confirmed", 400))
    }
   if(user.otp !== otp){
    return next(new AppError(messages.user.invalidCredentials, 404))
   }
   const currentDate = new Date()
   if(currentDate > user.otpExpired){
    return next(new AppError("OTP Expired", 404))
   }
   user.confirmEmail = true
   await user.save()
    // send response
    return res.status(201).json({
        message:"Email Confirmed Successfully",
        success: true,
    })
}
// resent otp code
export const resendOtp = async(req,res,next) =>{
    const { email } = req.body;

    //const token =  generateToken({payload:{email , _id : createdUser._id} })

    const user = await User.findOne({email})
    if(!user){
        return next(new AppError(messages.user.invalidCredentials, 404))
    }
    if(user.confirmEmail === true){
        return next(new AppError("Email already confirmed", 400))
    }
    const currentDate = new Date()
    if (user.otpExpired > currentDate) {
        const timeDifference = (user.otpExpired - currentDate) / (1000 * 60); // Difference in minutes
        return next(new AppError(`Last OTP still valid, you can try after ${timeDifference.toFixed(2)} minutes`, 400));
    }
     // Generate new OTP and expiration
     const otp = generateOTP();
     const otpExpired = Date.now() + 9 * 60 * 1000;
     
     // Update user with new OTP and expiration
     user.otp = otp;
     user.otpExpired = otpExpired;
     await user.save();
     
    sendEmail({
        to: email ,
        subject:"Resend OTP" , 
        html :`<h1> Your OTP is ${otp} </h1> `
    })

     // Send response
     return res.status(200).json({
        message: "OTP Resent Successfully",
        success: true,
    });
}
// login
export const login = async(req,res,next)=>{
    //get data from req
    const {email ,recoveryEmail, phone , password} = req.body
    // check existanse
    const userExist = await User.findOne({$or : [{email} ,{ recoveryEmail }, {phone}],})
    if(!userExist){
        return next(new AppError(messages.user.invalidCredentials , 400))
    }
    // check password
    const match = bcrypt.compareSync(password , userExist.password)
    if(!match){
        return next(new AppError(messages.user.invalidCredentials , 400))
    }
    // Update user status to online
    userExist.status = 'Online';
    await userExist.save();
    // generate token
    const token = generateToken({payload:{_id: userExist._id , email}})
    // send response
    return res.status(200).json({
        message: "Login Successfully", 
        success: true ,
        token
    })
}
//activate account
export const verifyAccount = async(req,res,next) =>{
    //get data from request
    const {token} = req.params
    const payload = verifyToken({token})
    // update status
    await User.findOneAndUpdate({email:payload.email},{status:"Online"})
    // send response
    return res.status(200).json({
        message: "User Verified Successfully",
        success: true,
    })      
}

// update password 
export const updatePassword = async(req,res,next) =>{
    const { email, oldPassword, newPassword } = req.body;
    const userId =  req.params.userId
    const authUserId = req.authUser?._id
    // Ensure the logged-in user is the owner of the account they are trying to update
    if (authUserId.toString() !== userId) {
        return next(new AppError(messages.user.notAuthorized, 403)); // Forbidden if not the owner
    }
    // check existanse
    const userExist = await User.findOne({email})
    if(!userExist){
        return next(new AppError(messages.user.invalidCredentials , 400))
    }
    // check password
    const match = bcrypt.compareSync(oldPassword , userExist.password)
    if(!match){
        return next(new AppError(messages.user.invalidCredentials , 400))
    }
    // update 
    const hashedPassword = bcrypt.hashSync(newPassword, 8);
    // Update the password in the database
    userExist.password = hashedPassword;
    await userExist.save();
    // send response
    return res.status(200).json({
        message: "Password Updated Successfully,",
        success: true,
    })
}
// Forget password 
export const sendForgetCode = async (req,res,next) => {

    const { email } = req.body;

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
        return next(new AppError(messages.user.notFound, 404));
    }

    // Generate OTP and its expiration time
    const otp = generateOTP(); 
    const otpExpired = Date.now() + 9 * 60 * 1000; 

    // Hash the OTP before saving it in the database
    const hashedOTP = bcrypt.hashSync(otp, 8);
    user.otp = hashedOTP;
    user.otpExpired = otpExpired;
    await user.save();

    // Send OTP via email or SMS (preferably email)
    await sendEmail({
        to: email,
        subject: "Password Reset OTP",
        text: `Your OTP is ${otp}. It will expire in 9 minutes.`,
    });

    // Send response
    return res.status(200).json({
        message: "OTP sent to your email successfully",
        success: true,
    });
}
export const resetPassword = async(req,res,next) =>{
    const { email, otp, newPassword } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
        return next(new AppError(messages.user.notFound, 404));
    }

    // Check if OTP has expired
    const currentTime = Date.now();
    if (user.otpExpired < currentTime) {
        return next(new AppError("OTP has expired", 400));
    }

    // Compare the provided OTP with the hashed OTP in the database
    const isOtpValid = bcrypt.compareSync(otp, user.otp);
    if (!isOtpValid) {
        return next(new AppError("Invalid OTP", 400));
    }

    // Hash the new password before saving it
    const hashedPassword = bcrypt.hashSync(newPassword, 8);
    user.password = hashedPassword;

    // Clear OTP and expiration after successful password reset
    user.otp = undefined;
    user.otpExpired = undefined;

    await user.save();

    // Send success response
    return res.status(200).json({
        message: "Password reset successfully",
        success: true,
    });
}
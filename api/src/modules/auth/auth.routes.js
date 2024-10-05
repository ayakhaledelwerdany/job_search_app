import { Router } from "express";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { isValid } from "../../middleware/validation.js";
import { signupValidation ,loginValidation ,updatePassValidation ,resetPassValidation} from "./auth.validation.js";
import { signup , verifyAccount, login, updatePassword, confirmEmail, resendOtp, resetPassword, sendForgetCode} from "./auth.controller.js";
import { roles } from "../../utils/constant/enum.js";
import { isAuthenticated } from "../../middleware/authentication.js";
import { isAuthorized } from "../../middleware/authorization.js";
export const authRouter = Router()

//signup
authRouter.post('/signup',isValid(signupValidation),asyncHandler(signup) )
authRouter.post('/login',isValid(loginValidation), asyncHandler(login))
authRouter.get('/verify/:token',asyncHandler(verifyAccount))
authRouter.post('/resendOtp',asyncHandler(resendOtp))
authRouter.post('/confirmEmail',asyncHandler(confirmEmail))

authRouter.put('/updatePass/:userId',
    isValid(updatePassValidation),
    isAuthenticated(),
    isAuthorized([roles.USER]),
    asyncHandler(updatePassword))

authRouter.post('/forgetPassword', 
    asyncHandler(sendForgetCode)
);
authRouter.patch('/resetPassword',
    isValid(resetPassValidation),
    asyncHandler(resetPassword)
      );
export default authRouter
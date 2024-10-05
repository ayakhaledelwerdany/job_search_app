import { Router } from "express";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { isValid } from "../../middleware/validation.js";
import { roles } from "../../utils/constant/enum.js";
import { isAuthenticated } from "../../middleware/authentication.js";
import { isAuthorized } from "../../middleware/authorization.js";
import {updateUser ,deleteUser ,getMyAccData , getAccData, getAccountsByRecoveryEmail} from "./user.controller.js";
import { updateUserValidation ,deleteUserValidation} from "./user.validation.js";

const userRouter = Router()
userRouter.put('/:userId',
    isValid(updateUserValidation),
    isAuthenticated(),
    isAuthorized([roles.USER]),
    asyncHandler(updateUser))
    
userRouter.delete('/:userId',
    isValid(deleteUserValidation),
    isAuthenticated(),
    isAuthorized([roles.USER]),
    asyncHandler(deleteUser))

userRouter.get('/',
    isAuthenticated(),
    isAuthorized([roles.USER]),
    asyncHandler(getMyAccData)
)
userRouter.get('/:userId',
    asyncHandler(getAccData)
)
userRouter.post('/accounts-by-recovery-email', 
    asyncHandler (getAccountsByRecoveryEmail));


export default userRouter
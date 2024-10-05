import joi from 'joi'
import { generalFields } from '../../middleware/validation.js'

export const signupValidation = joi.object({
    firstname: generalFields.firstname.required(),
    lastname: generalFields.lastname.required(),
    email:generalFields.email.required(),
    recoveryEmail :generalFields.email.required(),
    phone: generalFields.phone.required(),
    password: generalFields.password.required(),
    cPassword: generalFields.cPassword.required(),
    DOB:generalFields.DOB.required()

})
export const loginValidation = joi.object({
    email: generalFields.email,
    recoveryEmail: generalFields.recoveryEmail,
    phone: generalFields.phone,

    // Password is always required
    password: generalFields.password.required()
}).or('email', 'recoveryEmail', 'phone');

export const getValidation = joi.object({
    userId: joi.string().required(), 
})

export const updatePassValidation = joi.object({
    userId: joi.string().required(), 
    email:generalFields.email.required(),
    oldPassword:generalFields.password.required(),
    newPassword:generalFields.password.required(),
})
export const resetPassValidation = joi.object({
    email:generalFields.email.required(),
    password: generalFields.password.required(),
    newPassword: generalFields.password.required(),
    otp: generalFields.otp.required()
})

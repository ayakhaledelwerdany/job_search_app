import joi from 'joi'
import { generalFields } from '../../middleware/validation.js'

export const updateUserValidation = joi.object({
    userId: joi.string().required(), 
    firstname: generalFields.firstname.optional(),
    lastname: generalFields.lastname.optional(),
    email:generalFields.email.required(),
    recoveryEmail :generalFields.email.optional(),
    phone: generalFields.phone.optional(),
    DOB:generalFields.DOB.optional(),
})
export const deleteUserValidation = joi.object({
    userId: joi.string().required(), 
    email:generalFields.email.required(),
    password: generalFields.password.required(),
    cPassword: generalFields.cPassword.required(),
})

import joi from 'joi'
import { generalFields } from '../../middleware/validation.js'

export const companyValidation = joi.object({
    companyName:generalFields.companyName.required(),
    description:generalFields.description.required(),
    industry:generalFields.industry.required(),
    address:generalFields.address.required(),
    numberOfEmployees:generalFields.numberOfEmployees.required(),
    companyEmail:generalFields.email.required(),
    companyHR:generalFields.companyHR.required(),

})
export const companyUpdateValidation = joi.object({
    companyId: joi.string().required(), 
    companyName:generalFields.companyName.required(),
    description:generalFields.description.required(),
    industry:generalFields.industry.required(),
    address:generalFields.address.required(),
    numberOfEmployees:generalFields.numberOfEmployees.required(),
    companyEmail:generalFields.email.required(),
    companyHR:generalFields.companyHR.required(),

})
export const companyDeleteValidation = joi.object({
    companyId: joi.string().required(), 
    companyHR:generalFields.companyHR.required(),

})
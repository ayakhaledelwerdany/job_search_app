import joi from 'joi'
import { AppError } from '../utils/appError.js'

export const generalFields = {
  firstname: joi.string(),
  lastname: joi.string(),
  description: joi.string().max(2000),
  objectId :joi.string().hex().length(24),
  email: joi.string().email(),
  recoveryEmail: joi.string().email(),
  phone: joi.string().pattern(new RegExp(/^[\+]?[0-9]{0,3}[\W]?[0-9]{3}[\W]?[0-9]{3}[\W]?[0-9]{4,6}$/im
)),
  password: joi.string().pattern(new RegExp(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/)),
  cPassword : joi.string().valid(joi.ref('password')),
  DOB: joi.string(),
  companyName:joi.string(),
  industry:joi.string(),
  address:joi.string(),
  numberOfEmployees:joi.string(),
  //companyEmail: joi.string().email(),
  companyHR: joi.string().hex().length(24),
  jobTitle:joi.string(),
  jobLocation:joi.string(),
  workingTime:joi.string(),
  seniorityLevel:joi.string(),
  jobDescription:joi.string(),
  technicalSkills:joi.string(),
  softSkills:joi.string(),
  companyId: joi.string().hex().length(24),
  otp: joi.string().length(5).required(),
}
export const isValid = (schema)=>{
    return (req,res,next)=>{
        let data = {...req.body , ...req.params, ...req.query}

      const {error}=  schema.validate(data,{abortEarly : false})
      if(error){
        let errArray = [];
        error.details.forEach(err => {
            errArray.push(err.message)
        });
        return  next(new AppError( errArray , 400))
      }
      next()
    }
}
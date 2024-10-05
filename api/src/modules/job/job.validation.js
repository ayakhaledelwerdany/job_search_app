import joi from 'joi'
import { generalFields } from '../../middleware/validation.js'

export const addJobValidation = joi.object({
    jobTitle:generalFields.jobTitle.required(),
    jobLocation:generalFields.jobLocation.required(),
    workingTime:generalFields.workingTime.required(),
    seniorityLevel:generalFields.seniorityLevel.required(),
    jobDescription:generalFields.jobDescription.required(),
    technicalSkills:generalFields.technicalSkills.required(),
    softSkills:generalFields.softSkills.required(),
    companyId: generalFields.companyId.required(),
})
export const updateJobValidation = joi.object({
    jobId: joi.string().required(), 
    jobTitle:generalFields.jobTitle.required(),
    jobLocation:generalFields.jobLocation.required(),
    workingTime:generalFields.workingTime.required(),
    seniorityLevel:generalFields.seniorityLevel.required(),
    jobDescription:generalFields.jobDescription.required(),
    technicalSkills:generalFields.technicalSkills.required(),
    softSkills:generalFields.softSkills.required(),
})
export const deleteJobValidation = joi.object({
    jobId: joi.string().required(), 
})
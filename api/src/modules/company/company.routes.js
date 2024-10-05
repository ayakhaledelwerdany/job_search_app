import { Router } from "express";
import { isAuthorized } from "../../middleware/authorization.js";
import { roles } from "../../utils/constant/enum.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { addCompany, deleteCompany, getCompany, getJobApplications, getApplicationsByDate,searchCompany, updateCompany } from "./company.controller.js";
import { isValid } from "../../middleware/validation.js";
import { companyDeleteValidation, companyUpdateValidation, companyValidation } from "./company.validation.js";
import { isAuthenticated } from "../../middleware/authentication.js";

const companyRouter = Router()

companyRouter.post('/',
    isValid(companyValidation),
    isAuthenticated(),
    isAuthorized([roles.HR]),
    asyncHandler(addCompany)
)
companyRouter.put('/:companyId',
    isValid(companyUpdateValidation),
    isAuthenticated(),
    isAuthorized([roles.HR]),
    asyncHandler(updateCompany))

companyRouter.delete('/:companyId',
    isValid(companyDeleteValidation),
    isAuthenticated(),
    isAuthorized([roles.HR]),
    asyncHandler(deleteCompany))

companyRouter.get('/:companyId',
    isValid(companyDeleteValidation),
    isAuthenticated(),
    isAuthorized([roles.HR]),
    asyncHandler(getCompany))

companyRouter.get('/',
    isAuthenticated(),
    isAuthorized([roles.HR, roles.USER]),
    asyncHandler(searchCompany))

companyRouter.get('/:jobId',
    isAuthenticated(),
    isAuthorized([roles.HR]),
    asyncHandler(getJobApplications))

companyRouter.get('/:companyId/:date',
    isAuthenticated(),
    isAuthorized([roles.HR]), 
    asyncHandler(getApplicationsByDate)
    )
export default companyRouter
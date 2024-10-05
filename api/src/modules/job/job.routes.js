import { Router } from "express";
import { isValid } from "../../middleware/validation.js";
import { isAuthenticated } from "../../middleware/authentication.js";
import { isAuthorized } from "../../middleware/authorization.js";
import { roles } from "../../utils/constant/enum.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { addJob, applyToJob, deleteJob, getFilteredJobs, getJob, getJobs, updateJob } from "./job.controller.js";
import { addJobValidation ,updateJobValidation , deleteJobValidation } from "./job.validation.js";
import { cloudUpload } from "../../utils/multer-cloud.js";

const jobRouter = Router()

jobRouter.post('/',
    isValid(addJobValidation),
    isAuthenticated(),
    isAuthorized([roles.HR]),
    asyncHandler(addJob)
)
jobRouter.put('/:jobId',
    isValid(updateJobValidation),
    isAuthenticated(),
    isAuthorized([roles.HR]),
    asyncHandler(updateJob)
)
jobRouter.delete('/:jobId',
    isValid(deleteJobValidation),
    isAuthenticated(),
    isAuthorized([roles.HR]),
    asyncHandler(deleteJob)
)
jobRouter.get('/',
    isAuthenticated(),
    isAuthorized([roles.HR, roles.USER]),
    asyncHandler(getJobs)
)
jobRouter.get('/get-jobs-by-company',
    isAuthenticated(),
    isAuthorized([roles.HR, roles.USER]),
    asyncHandler(getJob)
)
jobRouter.get('/filter-jobs',
    isAuthenticated(),
    isAuthorized([roles.HR, roles.USER]),
    asyncHandler(getFilteredJobs)
)
jobRouter.post('/apply',
    isAuthenticated(),
    isAuthorized([roles.USER]), 
    cloudUpload({}).fields([ { name: 'userResume', maxCount: 1 }]),
    asyncHandler(applyToJob)
    );

export default jobRouter
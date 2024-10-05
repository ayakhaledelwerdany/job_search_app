import { Job } from "../../../database/models/job.model.js";
import { messages } from "../../utils/constant/messages.js";
import { AppError } from "../../utils/appError.js";
import { Company } from "../../../database/models/company.model.js";
import { ApiFeatures } from "../../utils/apiFeatures.js";
import { Application } from "../../../database/models/application.model.js";
import cloudinary from "../../cloud.js";

// add job
export const addJob = async(req,res,next) =>{
  // get data from request
const { jobTitle, jobLocation, workingTime, seniorityLevel, jobDescription, technicalSkills, softSkills ,companyId} = req.body;

   // prepare data
   const job = new Job({
        jobTitle,
        jobLocation,
        workingTime,
        seniorityLevel,
        jobDescription,
        technicalSkills,
        softSkills,
        companyId,
        addedBy: req.authUser._id
   });
   // add to database
   const newJob = await job.save()
   if(!newJob){
       return next(new AppError(messages.company.failToCreate ,500))
   }
   // ssend response
   return res.status(201).json({
       message: messages.job.createdSuccessfully, 
       success: true,
       data: newJob 
   });
}
export const updateJob = async(req,res,next) =>{
      // get data from request
      const {jobId} = req.params
      const {jobTitle,jobLocation,workingTime,seniorityLevel,jobDescription,technicalSkills,softSkills,} = req.body
      
      const updatedJob = await Job.findByIdAndUpdate(jobId, req.body, { new: true });
  
      if (!updatedJob) {
          return next(new AppError(messages.job.notFound ,500))
      }
      // send response
      return res.status(201).json({
          message: messages.job.updatedSuccessfully, 
          success: true,
          data: updatedJob 
      });
}
export const deleteJob = async(req,res,next) =>{
    const {jobId} = req.params
    const deletedJob = await Job.findByIdAndDelete(jobId,req.body, { new: true });

    if (!deletedJob) {
        return next(new AppError(messages.job.notFound ,500))
    }
    // send response
    return res.status(201).json({
        message: messages.job.deletedSuccessfully, 
        success: true,
        data: deletedJob 
    });
}
export const getJobs = async(req,res,next) =>{
     // get data from request
     const jobs = await Job.find()
     .populate({
       path: 'addedBy',  // Assuming 'addedBy' refers to the company HR (which is a User)
       model: 'User',
       select: 'firstname lastname email' // Select specific fields to populate from User model (or CompanyHR)
     })
     .populate({
       path: 'companyId', // Assuming each job has a reference to the company
       model: 'Company',
       select: 'companyName industry address' // Select company-specific fields to populate
     });
     if (!jobs.length) {
             return next(new AppError(messages.job.notFound, 404));
     }
     // return response
     res.status(200).json({
       message: 'Job data retrieved successfully',
       data: jobs
     });
}
export const getJob = async(req,res,next) =>{
    const { companyName } = req.query;

      if (!companyName) {
        return res.status(400).json({ message: "Company name is required" });
      }
      // Find the company by its name
      const company = await Company.findOne({ companyName: companyName.trim() });

      if (!company) {
        return res.status(404).json({ message: "Company not found" });
      }

      // Fetch jobs related to the company
      const jobs = await Job.find({ companyId: company._id })
        .populate({
          path: 'addedBy',  // Populate HR or user who added the job
          model: 'User',
          select: 'firstname lastname email'
        })
        .populate({
          path: 'companyId',  // Populate the company's data
          model: 'Company',
          select: 'companyName industry address'
        });

      if (!jobs ) {
        return res.status(404).json({ message: "No jobs found for this company" });
      }

      // Return the jobs along with the company details
      res.status(200).json({
        message: "Jobs retrieved successfully",
        data: jobs
      });
}
export const getFilteredJobs = async (req, res, next) => {
    // Create an instance of the JobAPIFeatures class
    const features = new ApiFeatures(Job.find().populate('companyId', 'companyName companyEmail'), req.query)
    .filter();  // Apply the filter

    // Execute the query
    const jobs = await features.mongooseQuery;
    // Return the response
    res.status(200).json({
        message: 'Jobs retrieved successfully',
        data: jobs
    });
}
// apply to job 
export const applyToJob = async (req, res, next) => {
    
    // Upload user resume to Cloudinary
    const { secure_url: resumeUrl, public_id: resumePublicId} = await cloudinary.uploader.upload(
        req.files.userResume[0].path,  // Assuming multer stores the file in req.files.userResume[0]
        { folder: 'linkedin/resumes' }  // Upload to a specific folder in Cloudinary
    );
    req.failUploads = [];
    req.failUploads.push(resumePublicId , resumeUrl);  // Store public ID for potential cleanup

    // Create new job application
    const { jobId, userTechSkills, userSoftSkills } = req.body;

    // Create new application
    const newApplication = await Application.create({
        jobId,
        userId: req.authUser._id,  // Assuming req.authUser is populated with authenticated user details
        userTechSkills,
        userSoftSkills,
        userResume: resumeUrl,  // Store only the resume URL here
        resumePublicId  
    });
    // send response
    res.status(201).json({
        message: 'Job application submitted successfully',
        data: newApplication
    });
}


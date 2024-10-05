import { Company } from "../../../database/models/company.model.js";
import { messages } from "../../utils/constant/messages.js";
import { AppError } from "../../utils/appError.js";
import { Job } from "../../../database/models/job.model.js";
import { Application } from "../../../database/models/application.model.js";
import ExcelJS from 'exceljs';
import moment from 'moment';  // For easier date handling

// add company
export const addCompany = async(req,res,next) =>{
    // get data from request
    const { companyName, description, industry, address, numberOfEmployees, companyEmail, companyHR } = req.body;
   // check existance
    const companyExist = await Company.findOne({companyEmail})
    if(companyExist){
        return next(new AppError(messages.company.alreadyExist , 404))
    }
    // prepare data
    const company = new Company({
      companyName,
      description,
      industry,
      address,
      numberOfEmployees,
      companyEmail,
      companyHR
    });
    // add to database
    const newCompany = await company.save()
    if(!newCompany){
        return next(new AppError(messages.company.failToCreate ,500))
    }
    // ssend response
    return res.status(201).json({
        message: messages.company.createdSuccessfully, 
        success: true,
        data: newCompany 
    });
}
// update company
export const updateCompany = async(req,res,next) =>{
    // get data from request
    const {companyId} = req.params
    const { companyName,description, industry, address, numberOfEmployees, companyEmail, companyHR} = req.body
    
    const updatedCompany = await Company.findByIdAndUpdate(companyId, req.body, { new: true });

    if (!updatedCompany) {
        return next(new AppError(messages.company.notFound ,500))
    }
    // send response
    return res.status(201).json({
        message: messages.company.updatedSuccessfully, 
        success: true,
        data: updatedCompany 
    });
}
// delete company
export const deleteCompany = async (req,res,next) =>{
    const {companyId} = req.params
    const { companyHR} = req.body
    const deletedCompany = await Company.findByIdAndDelete(companyId,req.body, { new: true });

    if (!deletedCompany) {
        return next(new AppError(messages.company.notFound ,500))
    }
    // send response
    return res.status(201).json({
        message: messages.company.deletedSuccessfully, 
        success: true,
        data: deletedCompany 
    });
}
// get company data and all jobs related to this company
export const getCompany = async (req,res,next) => {
    // get data from request
    const {companyId} = req.params
    const company = await Company.findById(companyId).populate([{path:"jobs"}])
    if (!company) {
            return next(new AppError(messages.company.notFound, 404));
    }
    // Return the company with the jobs embedded
    res.status(200).json({
      message: 'Company data retrieved successfully',
      data: company
    });
}
// search about company with name
export const searchCompany = async(req,res,next)=>{

    const { companyName } = req.query;

    if (!companyName) {
      return res.status(400).json({
        message: 'Please provide a company name to search',
      });
    }
    // check existanse
    const companyExist = await Company.findOne({ companyName });

    if (!companyExist) {
        return next(new AppError(messages.company.notFound , 404))
      }
    // send response
    res.status(200).json({
        message: 'Company found',
        success: true,
        data: companyExist,
    })
}
// Get all applications for specific Job
export const getJobApplications = async (req, res) => {

    const { jobId } = req.params;
  
    // Find the job by jobId and ensure it belongs to the authenticated user's company
    const job = await Job.findOne({ _id: jobId, companyOwner: req.authUser._id });  // Assuming Job has companyOwner field
      
      if (!job) {
        return res.status(403).json({
          message: "You don't have access to this job's applications.",
        });
    }
   // Fetch applications for the specified job and populate user data
   const applications = await Application.find({ jobId }).populate('name email role');  // Populate 'userId' to include user data
    
   if (applications.length === 0) {
     return res.status(404).json({
       message: 'No applications found for this job',
     });
   }
    // Send the applications with full user data
      res.status(200).json({
        message: 'Applications retrieved successfully',
        data: applications,
    });
}
export const getApplicationsByDate = async (req, res) => {

    const { companyId, date } = req.params;
  
      // Parse the date and calculate the start and end of the day
      const startDate = moment(date).startOf('day').toDate();
      const endDate = moment(date).endOf('day').toDate();
  
      // Find all jobs for the specific company
      const jobs = await Job.find({ companyOwner: companyId });
  
      // Extract the jobIds from the jobs
      const jobIds = jobs.map(job => job._id);
  
      // Find all applications for those jobs on the specific day
      const applications = await Application.find({
        jobId: { $in: jobIds },
        createdAt: { $gte: startDate, $lte: endDate }
      }).populate('userId', 'name email');  // Populate user data
  
     // console.log(applications);

      if (applications.length === 0) {
        return res.status(404).json({
          message: 'No applications found for this company on the specified date',
        });
      }
  
      // Create a new workbook and worksheet
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Applications');
  
      // Define the columns for the Excel sheet
      worksheet.columns = [
        { header: 'Job ID', key: 'jobId', width: 25 },
        { header: 'User Name', key: 'userName', width: 25 },
        { header: 'User Email', key: 'userEmail', width: 30 },
        { header: 'Tech Skills', key: 'userTechSkills', width: 30 },
        { header: 'Soft Skills', key: 'userSoftSkills', width: 30 },
        { header: 'Resume URL', key: 'userResume', width: 40 },
        { header: 'Application Date', key: 'createdAt', width: 25 },
      ];
  
      // Add rows to the worksheet from the applications data
      applications.forEach(app => {
        worksheet.addRow({
          jobId: app.jobId.toString(),
          userName: app.userId.name,
          userEmail: app.userId.email,
          userTechSkills: app.userTechSkills.join(', '),
          userSoftSkills: app.userSoftSkills.join(', '),
          userResume: app.userResume,
          createdAt: moment(app.createdAt).format('YYYY-MM-DD HH:mm:ss'),
        });
      });
  
      // Set the response headers for downloading an Excel file
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      );
      res.setHeader(
        'Content-Disposition',
        `attachment; filename=applications_${companyId}_${date}.xlsx`
      );
  
      // Write the Excel file to the response stream
      await workbook.xlsx.write(res);
      res.status(200).end();
  
    } 
export class ApiFeatures{
    constructor(mongooseQuery , queryData){
        this.mongooseQuery = mongooseQuery;
        this.queryData = queryData
    }
    
    
    filter(){
        let { workingTime, jobLocation, seniorityLevel, jobTitle, technicalSkills } = this.queryData;
        // Initialize an empty filter object
        const filter = {};
        // Add filters to the filter object if they exist in query
        if (workingTime) filter.workingTime = workingTime;
        if (jobLocation) filter.jobLocation = jobLocation;
        if (seniorityLevel) filter.seniorityLevel = seniorityLevel;
        if (jobTitle) filter.jobTitle = new RegExp(jobTitle, 'i');  // Use regex for case-insensitive match
        if (technicalSkills) filter.technicalSkills = { $in: technicalSkills.split(',') };  // Match any of the technical skills
        this.mongooseQuery.find(filter)
        return this     
    }
}
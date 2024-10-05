import { model, Schema } from "mongoose";
import { location, level, time} from "../../src/utils/constant/enum.js";


// schema 
const jobSchema = new Schema({
    jobTitle: {
    type: String,
    required: true,
    trim: true
    },
    jobLocation: {
    type: String,
    enum: Object.values(location),
    required: true
    },
    workingTime: {
    type: String,
    enum: Object.values(time),
    required: true
    },
    seniorityLevel: {
    type: String,
    enum: Object.values(level),
    required: true
    },
    jobDescription: {
    type: String,
    required: true
    },
    technicalSkills: {
    type: [String],
    required: true
    },
    softSkills: {
    type: [String],
    required: true
    },
    addedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User', // Assuming the company HR is from the User collection
    required: true
    },
    companyId:{
        type: Schema.Types.ObjectId,
        ref:"Company",
        required: true
      }
}, { timestamps: true });
// model
export const Job = model('Job', jobSchema);

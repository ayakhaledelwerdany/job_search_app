import { model, Schema } from "mongoose";

// model
const companySchema = new Schema({
  companyName: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  industry: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    required: true
  },
  numberOfEmployees: {
    type: String,
    enum: ['1-10', '11-20', '21-50', '51-100', '101-200', '201-500', '500+'],
    required: true
  },
  companyEmail: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  companyHR: {
    type: Schema.Types.ObjectId,
    ref: 'User', // Assuming the HR is from the User collection
    required: true
  },
  jobs:[{
    type: Schema.Types.ObjectId,
    ref:"Job"
  }]
}, { timestamps: true });

export const Company =  model('Company', companySchema);



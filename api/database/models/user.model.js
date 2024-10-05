import { model, Schema } from "mongoose";
import { roles, status } from "../../src/utils/constant/enum.js";

// schema
const userSchema = new Schema({
    firstname: {
        type: String,
        required: true,
        trim: true
      },
    lastname: {
        type: String,
        required: true,
        trim: true
      },
    username: {
        type: String,
        unique: true,
       // required: true
      },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
      },
    password:{
        type: String,
        required: true
    },
    recoveryEmail: {
        type: String,
        trim: true,
        lowercase: true
      },
    phone:{
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    role:{
        type: String,
        enum: Object.values(roles),
        default: roles.USER
    }, 
    status:{
        type: String,
        enum: Object.values(status),
        default: status.OFLINE
    },
    DOB:{
        type: String,
        default: Date.now()
    },
    otp:String,
    otpExpired : Date,
    confirmEmail: { 
    type: Boolean, 
    default: false 
},  

},
   {
        timestamps: true
    })
    userSchema.pre('save', function (next) {
        this.username = `${this.firstname}${this.lastname}`.toLowerCase(); // Make username lowercase
        next();
      });
// model
export const User = model("User", userSchema)
import bcrypt, { hashSync } from 'bcrypt'
import { User } from "../../../database/index.js"
import { AppError } from "../../utils/appError.js"
import { messages } from "../../utils/constant/messages.js"

// update user
export const updateUser = async (req,res,next) => {
    // get data to update from request 
    let { email, phone, recoveryEmail, DOB, lastname, firstname} = req.body
    const userId =  req.params.userId
    const authUserId = req.authUser?._id
    // Ensure the logged-in user is the owner of the account they are trying to update
    if (authUserId.toString() !== userId) {
        return next(new AppError(messages.user.notAuthorized, 403)); // Forbidden if not the owner
    }
    // Check if the email or mobile number is being updated and ensure uniqueness
    if (email || phone) {
        const conflictCheck = await User.findOne({
            $or: [{ email }, { phone }],
            _id: { $ne: userId } // Exclude the current user from the search
        });
        if (conflictCheck) {
            return next(new AppError(messages.user.conflictData, 409)); // Conflict if the email or mobile number is already taken
        }
    }
    // add to database
    // Prepare dynamic update fields
    let updateFields = {
        ...(email && { email }), 
        ...(phone && { phone }), 
        ...(recoveryEmail && { recoveryEmail }),
        ...(DOB && { DOB }),
        ...(lastname && { lastname }),
        ...(firstname && { firstname })
    };

    // Fetch the current user details if either firstname or lastname is being updated
    if (firstname || lastname) {
        const currentUser = await User.findById(userId);
        if (!currentUser) {
            return next(new AppError(messages.user.notFound, 404)); 
        }

        // Update the username by concatenating firstname and lastname
        const updatedFirstname = firstname || currentUser.firstname;
        const updatedLastname = lastname || currentUser.lastname;
        updateFields.username = `${updatedFirstname}${updatedLastname}`.toLowerCase();  // Example: john.doe
    }

    // Update the user and return the updated document
    const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: updateFields },  // Dynamically set the provided fields
        { new: true }  // Return the updated document
    );

    if(!updatedUser){
        return next(new AppError(messages.user.failToUpdate ,500))
    }
    // send response
    return res.status(200).json({
        message: messages.user.updatedSuccessfully,
        success: true,
        data: updatedUser,
    })
}
// delete user
export const deleteUser = async (req,res,next) =>{
    // get data to update from request 
      let { email, password , cPassword} = req.body
      const userId =  req.params.userId
      const authUserId = req.authUser?._id
  // check existanse
    const userExist = await User.findOne({email})
    if(!userExist){
        return next(new AppError(messages.user.invalidCredentials , 400))
    }
    // check password
    const match = bcrypt.compareSync(password , userExist.password)
    if(!match){
        return next(new AppError(messages.user.invalidCredentials , 400))
    }
    // Ensure the logged-in user is the owner of the account they are trying to update
    if (authUserId.toString() !== userId) {
        return next(new AppError(messages.user.notAuthorized, 403)); // Forbidden if not the owner
    }
      // delete from database
      const deletedUser = await User.findByIdAndDelete(userId, req.body, { new: true })
      if(!deletedUser){
          return next(new AppError(messages.user.failToDelete ,500))
        }
      // send response
      return res.status(200).json({
          message: messages.user.deletedSuccessfully,
          success: true,
          data: deletedUser,
    })
}
// get my account data
export const getMyAccData = async (req,res, next) =>{
    // Send response  
    return res.status(200).json({
        success: true,
        data: req.authUser,
    });
}
// get data of another account 
export const getAccData = async(req,res,next) =>{
    // get data from request
    const userId =  req.params.userId
    const user = await User.findById(userId).select('-password -__v'); // Exclude password and version
    if (!user) {
            return next(new AppError(messages.user.notFound, 404));
    }
    // Send response with 
    return res.status(200).json({
        success: true,
        data: user,
    });
}
// Get all accounts associated to a specific recovery Email 
export const getAccountsByRecoveryEmail = async (req, res, next) => {

    const { recoveryEmail } = req.body;

    // check existanse
    if (!recoveryEmail) {
        return next(new AppError("Please provide a recovery email", 400));
    }
    // Find all users with the given recoveryEmail
    const users = await User.find({ recoveryEmail });

    if (users.length === 0) {
        return res.status(404).json({
            message: "No accounts found for this recovery email",
            success: false,
        });
    }
    // Send the response with the found users
    return res.status(200).json({
        message: "Accounts found",
        success: true,
        data: users
    })
}
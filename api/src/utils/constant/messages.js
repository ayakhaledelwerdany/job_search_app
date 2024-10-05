
const generateMessage = (entity)=>( { 
    alreadyExist : `${entity} Already Exist`,
    notFound : `${entity} Not Found`,
    failToCreate : `Fail To Create ${entity}`,
    failToUpdate : `Fail To Update ${entity}`,
    failToDelete : `Fail To Delete ${entity}`, 
    createdSuccessfully : `${entity} Created Successfully`,
    updatedSuccessfully : `${entity} Updated Successfully`,
    deletedSuccessfully : `${entity} Deleted Successfully`
})

export const messages ={
    company : generateMessage('company'),
    job : generateMessage('job'),

    user :{...generateMessage('user'),
    invalidCredentials: "Invalid Credentials",
    notAuthorized: "User Not Authorized",
    conflictData : "Conflict Data"
    },

}
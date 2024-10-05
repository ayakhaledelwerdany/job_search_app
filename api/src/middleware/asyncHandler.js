import fs from 'fs'
import { AppError } from '../utils/appError.js'
import path from 'path'
import { deleteFile } from '../utils/file-functions.js'
import { deleteCloudFile } from '../cloud.js'
export const asyncHandler = (fn) =>{
    return (req,res,next) =>{
        fn(req,res,next).catch((err)=>{
            return next (new AppError(err.message , err.statusCode))
        })
    }
}
export const globalErrorHandling = async (err,req,res,next)=>{
    // rollback file system
    if(req.file){
        deleteFile(req.file.path)
    }
    //rollback cloud
    if(req.failFile){
       await deleteCloudFile(req.failFile.puplic_id)
    }
    if(req.failFile?.length > 0){
        for (const public_id of req.failFile) {
            await deleteCloudFile(public_id)
        }
    }
    return res.status(err.statusCode || 500).json({message: err.message , success: false })
}
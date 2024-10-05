import fs, { mkdirSync } from 'fs'
import path from 'path';
import multer from 'multer';
const { diskStorage } = multer;
import { nanoid } from 'nanoid';

const fileValidation = {
    file: ['application/pdf'],
    
}
export const cloudUpload = ({allowType = fileValidation.file})=>{
   const storage =  diskStorage({})
const fileFilter = (req,file,cb)=>{
    if(allowType.includes(file.mimetype)){
        return cb(null , true)
    }
    return cb(new Error('invalid file format',400),false)
}
    return multer({storage, fileFilter})
}

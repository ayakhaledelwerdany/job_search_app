import fs from 'fs'
import path from 'path'

export const deleteFile = (filePath) =>{
    let fullPath = path.resolve(filePath) // to select the right file path
    fs.unlinkSync(fullPath)  // to delete the file

}

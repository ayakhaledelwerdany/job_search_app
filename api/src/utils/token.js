import jwt from 'jsonwebtoken'

export const generateToken = ({payload , secretKey = 'secretKey'})=>{
   return jwt.sign(payload, secretKey)
}
export const verifyToken =({token , secretKey ='secretKey'}) =>{
    try{
        return jwt.verify(token, secretKey)
    }catch(error){
        return {message : error.message}
    }
}
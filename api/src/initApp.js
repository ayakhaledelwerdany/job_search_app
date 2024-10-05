//import { } from "./modules/index.js"
import { globalErrorHandling } from "./middleware/asyncHandler.js"
import {authRouter} from "./modules/index.js"
import { companyRouter } from "./modules/index.js"
import {userRouter} from "./modules/index.js"
import {jobRouter} from "./modules/index.js"
export const initApp = (app, express)=>{
    //parse req
    app.use(express.json())
    app.use('/uploads',express.static('uploads'))
    //routing
    app.use('/auth', authRouter)
    app.use('/company', companyRouter)
    app.use('/job', jobRouter)
    app.use('/user', userRouter)


    //global error handling
    app.use(globalErrorHandling)   
}

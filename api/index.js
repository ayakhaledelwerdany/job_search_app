import path from 'path'
import express from 'express'
import dotenv from 'dotenv';
import { dbConnect } from './database/dbConnection.js'
import { initApp } from './src/initApp.js'
const app = express()
const port = 5000
dotenv.config({path: path.resolve('./config/.env')})
dbConnect()
initApp(app,express)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
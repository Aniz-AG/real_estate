import express from "express";
import { registerHandler, sendOtp, verifyOtp } from "../controllers/authController.js";
import { singleUpload } from '../middlewares/multer.js'


const route = express.Router();


route.post('/register',singleUpload, registerHandler)
route.post('/send-otp', sendOtp);
route.post('/verify-otp', verifyOtp);


export default route;
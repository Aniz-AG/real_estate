import express from "express";
import { registerHandler, sendOtp, verifyOtp, logoutHandler } from "../controllers/authController.js";
import { singleUpload } from '../middlewares/multer.js'
import { isAuthenticated } from '../middlewares/auth.js'


const route = express.Router();


route.post('/register', singleUpload, registerHandler)
route.post('/send-otp', sendOtp);
route.post('/verify-otp', verifyOtp);
route.post('/logout', isAuthenticated, logoutHandler);


export default route;
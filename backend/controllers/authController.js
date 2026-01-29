import { TryCatch } from "../middlewares/error.js";
import { ErrorHandler } from '../utils/utility.js'
import { User } from '../models/userModel.js'
import { Otp } from '../models/optModel.js'
import { sendToken } from '../utils/features.js'
import twilio from 'twilio';
import { uploadFilesToCloudinary } from '../utils/features.js'





// const sendOtp = TryCatch(async (req, res, next) => {
//   const { phone } = req.body;
//   console.log("phone is: ", phone)

//   if (!phone) {
//     return next(new ErrorHandler("Phone number is required", 400));
//   }

//   const user = await User.findOne({ phone });
//   if (!user) {
//     return next(new ErrorHandler("User not found", 404));
//   }

//   const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
//   ;



//   const otp = Math.floor(100000 + Math.random() * 900000);
//   const expireTime = new Date(Date.now() + 5 * 60 * 1000);

//   console.log("otp: ", otp);
//   // Send OTP using Twilio

//   const message = await client.messages.create({
//     body: `Your OTP code is: ${otp} sent by Ajay as Morax from realState`,
//     from: `+${process.env.TWILIO_PHONE_NUMBER}`,
//     to: `+91${phone}`,
//   });

  
//   console.log("OTP sent created:", message.sid);

//   // Save OTP to the database
//   await Otp.create({
//     phone,
//     otp,
//     expireTime,
//   });


//   res.status(200).json({
//     success: true,
//     message: "OTP sent successfully",
//   });
// });


const sendOtp = async (req, res, next) => {
  try {
    const { phone } = req.body;
    console.log("phone is: ", phone);

    if (!phone) {
      return next(new ErrorHandler("Phone number is required", 400));
    }

    const user = await User.findOne({ phone });
    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );

    const otp = Math.floor(100000 + Math.random() * 900000);
    const expireTime = new Date(Date.now() + 5 * 60 * 1000);

    console.log("otp: ", otp);

    // Send OTP using Twilio
    const message = await client.messages.create({
      body: `Your OTP code is: ${otp} sent by Ajay as Morax from realState`,
      from: `+${process.env.TWILIO_PHONE_NUMBER}`,
      to: `+91${phone}`,
    });

    console.log("OTP sent created:", message.sid);

    // Save OTP to the database
    await Otp.create({
      phone,
      otp,
      expireTime,
    });

    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.error("Error in sendOtp:", error);
    next(error); // Pass error to your central error handler middleware
  }
};


const verifyOtp = TryCatch(async (req, res, next) => {
  const { phone, otp } = req.body;

  console.log("phone: ", phone);
  console.log("otp: ", otp);

  // Check if both phone and otp are provided
  if (!phone || !otp) {
    return next(new ErrorHandler("Phone and OTP are required", 400));
  }

  // Find the user by phone number
  const user = await User.findOne({ phone });
  if (!user) {
    return next(new ErrorHandler("User not found. Please log in.", 401));
  }

  // Get the most recent OTP for the given phone number
  const existingOtp = await Otp.findOne({ phone }).sort({ createdAt: -1 });
  if (!existingOtp) {
    return next(new ErrorHandler("OTP not found. Please request a new one.", 404));
  }
   
  console.log("Otp object: ", existingOtp);


  // Validate the provided OTP
  if (existingOtp.otp !== otp) {
    return next(new ErrorHandler("Invalid OTP. Please try again.", 400));
  }

  
  if (existingOtp.expireTime.getTime() <= Date.now()) {
    console.log("OTP has expired");
    return next(new ErrorHandler("OTP has expired. Please request a new one.", 400));
  }




  // If OTP is valid, send the token and log in the user
  sendToken(res, user, 200, "Login successfully");

  // Delete the OTP after successful validation
  await Otp.deleteOne({ _id: existingOtp._id });
});



const registerHandler = TryCatch(async (req, res, next) => {
  const { username, email, phone, city, state } = req.body;
  console.log(req.body);

  // Check if all required fields are provided
  if (!username || !email || !phone || !city || !state) {
    return next(new ErrorHandler("All fields are required", 400));
  }

  const photo = req.file;
  if (!photo) return next(new ErrorHandler("user avater not provided", 400));
  // Check if the username, email, or phone already exists
  const existingUser = await User.findOne({
    $or: [{ email }, { phone }],
  });


  if (existingUser) {
    return next(
      new ErrorHandler(
        `User already exists with the same email, or phone`,
        400,
      )
    );
  }

  const photoURL = await uploadFilesToCloudinary([photo])

  // Create a new user
  const user = await User.create({
    username,
    phone,
    email,
    city,
    state,
    photo: {
      public_id: photoURL[0].public_id,
      url: photoURL[0].url,
    } || {}
  });

  // Respond with the created user
  res.status(201).json({
    success: true,
    message: "your registetion successfully Now Login with Phone no.",
  });
});



export {
  registerHandler,
  sendOtp,
  verifyOtp
}
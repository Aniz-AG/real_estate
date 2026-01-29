import express from 'express'
import dotenv from 'dotenv'
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { errorMiddleware } from './middlewares/error.js'
import cors from 'cors'
import { connectDB } from './utils/features.js';
import { v2 as cloudinary} from 'cloudinary'


const app = express();

dotenv.config({
  path: './.env'
})

const PORT =  process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI;

// config cloundinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});



const allowedOrigins = ['http://localhost:5173','http://localhost:3000']; // Add more if needed for production

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));







connectDB(MONGO_URI)



// using middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));



// import routes
import authRoute  from './routes/authRoute.js'
import userRoute  from './routes/userRoute.js'
import propertyRoute  from './routes/propertyRoute.js'
import contactRoute from './routes/contactRoute.js'


app.get('/testing',(req,res,next)=>{
    res.status(200).json({
          success: true,
          message: "tesing api working....."
    })
})
app.use('/api/v1/auth',authRoute)
app.use('/api/v1/user',userRoute)
app.use('/api/v1/property',propertyRoute)
app.use('/api/v1/contact',contactRoute)




app.use(errorMiddleware)

app.listen(PORT, () => {
  console.log(`Example app listening on port http://localhost:${PORT}`)
})
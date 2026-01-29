import { TryCatch } from './error.js'
import { ErrorHandler } from '../utils/utility.js'
import {  User } from '../models/userModel.js'
import jwt from 'jsonwebtoken';

const adminOnly = TryCatch(async (req,res,next)=>{
    const userId = req.user.userId;

    const user = await User.findById(userId);

    if(!user){
        return next(new ErrorHandler("Login the System..", 401));
    }

    if(user.role !== 'admin'){
          return next(new ErrorHandler(`you can't acess the route.`,401))
    }

    next();
    
})



const isAuthenticated = TryCatch((req,res,next)=>{
      const authHeader = req.headers['authorization'];
     
      if(!authHeader || !authHeader.startsWith('Bearer ')){
           return next(new ErrorHandler('Unauthorized',401));
      }

      const token = (authHeader.split('Bearer ')[1]).trim();

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if(!decoded)  return next(new ErrorHandler('Invalid token',401));
      req.user = decoded;
      next()
})

export{
     isAuthenticated,
     adminOnly
}

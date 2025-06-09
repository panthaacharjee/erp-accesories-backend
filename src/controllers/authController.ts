import { Request, Response, NextFunction } from "express";
const catchAsyncError = require("../middleware/catchAsyncError.ts")
import User from "../models/Employee/UserModel";
import ErrorHandler from "../utils/errorhandler";
import hashPassword from "../utils/HashPassword";
const {comparePassword} = require("../utils/ComparePassword.ts")
const sendToken = require('../utils/jwtToken.ts')
const token = require("../utils/Token.ts")


/* =====================================================================================================*/
/* ============================= REGISTER EMPLOYEE (POST) (/register/employee) ================================= */
/* ===================================================================================================== */

exports.registerEmployee = catchAsyncError(async (req:Request, res:Response, next:NextFunction) => {
    const { id, name, userName, password, salary, role}:{
        id:string,
        name:string, 
        userName:string, 
        password:string, 
        salary:number, 
        role: String
    } = req.body;



     if(!userName || !password){
      return next(ErrorHandler("USERNAME OR PASSWORD REQUERED", 400, res, next))
     }

    const userByEmail = await User.findOne({ userName }).catch();
    if (userByEmail) {
      return next(ErrorHandler("THIS USER ALREADY EXISTS", 400, res, next))
    }

    const hashingPassword = await hashPassword(password)
    
    await User.create({
      employeeId:id,
      name,
      userName,
      authentication:{
        password:hashingPassword
      },
      salary,
      role
    });


    res.status(200).json({
      success: false,
      message:"SUCCESSFULLY EMPLOYEE REGISTERED"
    })
  });



/* ===================================================================================================== */
/* ============================= LOGIN USER (POST) (/login/user) ================================= */
/* ===================================================================================================== */

exports.loginUser = catchAsyncError(async (req:Request, res:Response, next:NextFunction) => {
    const { userName, password }:{userName:string, password:string }= req.body;

     if(!userName || !password){
      return next(ErrorHandler("EMAIL OR PASSWORD REQUERED", 400, res, next))
     }
   
     const user = await User.findOne({ userName }).select("+authentication.password")
     if(!user){
        return next(ErrorHandler("PLEASE ENTER VALID USERNAME OR PASSWORD", 400, res, next))
     }

     const isPasswordMatched = await comparePassword(password, user.authentication.password)
     if(!isPasswordMatched){
      return next(ErrorHandler("PLEASE ENTER VALID USERNAME OR PASSWORD", 400, res, next)) 
     }  
    
    await user.loginHistory.push({
      timestamp: new Date(),
      ipAddress: req.clientIp,
      // userAgent: req.headers['user-agent']
    });
    await user.save()
    
    const sessionToken = token(user._id)
    user.authentication.sessionToken = sessionToken
    await user.save()
    sendToken(user, 201, res);
});



/* ===================================================================================================== */
/* ============================= LOGOUT USER (GET) (/logout) ================================= */
/* ===================================================================================================== */

exports.logout = catchAsyncError(async (req:Request, res:Response, next:NextFunction) => {
    res.cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    });
    res.status(200).json({
      success: true,
      message: "LOG OUT",
    });
  });


  
/* ===================================================================================================== */
/* ============================= LOGIN HISTROY USER (GET) (/user/login/history) ================================= */
/* ===================================================================================================== */

export const getLoginHistory = catchAsyncError(async (req: Request, res: Response) => {
  const user = await User.findById((req as any).user._id)
      .select('loginHistory')
      .lean();
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const date = new Date(user.loginHistory[user.loginHistory.length-2].timestamp)
    const dateH = date.getHours()
    const dateM = date.getMinutes()
    const dateS = date.getSeconds()
    
    res.json({ loginHistory: `${dateH}/${dateM}/${dateS}`, login:user.loginHistory }, );
})


/* ===================================================================================================== */
/* ============================= USER PROFILE (GET) (/user/profile) ================================= */
/* ===================================================================================================== */
exports.getUser = catchAsyncError(async(req:Request, res:Response, next:NextFunction)=>{
    const user = await User.findById((req as any).user._id)

    res.status(200).json({
      success:true,
      user
    })
})


/* ===================================================================================================== */
/* ============================= CHANGE PASSWORD (PUT) (/user/change/password) ================================= */
/* ===================================================================================================== */
exports.updatePassword = catchAsyncError(async (req:Request, res:Response, next: NextFunction) => {
  const {oldPassword, newPassword, cPassword}:{
    oldPassword:string, 
    newPassword:string, 
    cPassword:string} = req.body


  if (newPassword !== cPassword) {
    return next(ErrorHandler("PASSWORD DOES NOT MATCHED", 401, res, next));
  }

 

  const user = await User.findById((req as any).user._id).select("+authentication.password")

  if(!user){
    return next(ErrorHandler("USER NOT FOUND", 401, res, next));
  }


  const isPassowrdMatched = await comparePassword(oldPassword, user?.authentication.password)

  if (!isPassowrdMatched) {
    return next(ErrorHandler("OLD PASSWORD IS INCORRECT", 400, res, next));
  }


  const hashingPassword = await hashPassword(newPassword)
  
  user.authentication.password = hashingPassword
  await user.save()
  
  sendToken(user, 201, res );
});
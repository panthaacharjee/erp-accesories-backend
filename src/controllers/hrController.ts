import { Request, Response, NextFunction } from "express";
const fs = require("fs");

/* ======================== MODELS ================== */
import User from "../models/Employee/UserModel";

/* =================== UTILS ======================= */
import ErrorHandler from "../utils/errorhandler";
import user from "../models/Employee/UserModel";
import generatePDFFromUrl from "../utils/generatePdf";

/* =================== MIDDLEWARE ======================= */
const catchAsyncError = require("../middleware/catchAsyncError")



/* =====================================================================================================*/
/* ============================= GET EMPLOYEE (PUT) (/get/employee) ================================= */
/* ===================================================================================================== */
exports.getEmployee = catchAsyncError(async(req:Request, res:Response, next:NextFunction)=>{

    const {id}:{id:any} = req.body

    if(!id){
      return next(ErrorHandler("PLEASE ENTER EMPLOYEE ID", 401, res, next))
    }

    let employeeID;
    const updateEmployeeIdNumber = (id:number)=>{
      if(id<10){
        return `SPL0000${id}`
      }else if(id<100){
        return `SPL000${id}`
      }else if(id<1000){
        return `SPL00${id}`
      }else if(id<10000){
        return `SPL0${id}`
      }else{
        return next(ErrorHandler("PLEASE ENTER VALID EMPLOYEE ID", 403, res, next))
      }
    }

    const isInt = Number.isInteger(id)
    if(!isNaN(id) && isInt === true){
        employeeID = updateEmployeeIdNumber(id)
    }else{
        return next(ErrorHandler("PLEASE ENTER VALID EMPLOYEE ID", 403, res, next)) 
    }

    if(typeof id === "string"){
      employeeID = id
    }

    // console.log(typeof id==="string")

    const user = await User.findOne({employeeId: employeeID})

    if(!user){
      return next(ErrorHandler("EMPLOYEE NOT FOUND", 404, res, next))
    }

    res.status(200).json({
      success:true,
      user
    })
})

/* =====================================================================================================*/
/* ============================= UPDATE EMPLOYEE (PUT) (/update/employee/id) ================================= */
/* ===================================================================================================== */
exports.updateEmployee = catchAsyncError(async(req:Request, res:Response, next:NextFunction)=>{
    const {section, category, designation, department, vill, thana, post, postCode, district, father,mother,dob, nid, phone, qualification, nomineeName, relation, joinDate, account, bankName, route}:{
      section:string,
      category:string,
      designation:string,
      department:string,
      vill:string,
      thana:string,
      post:string,
      postCode:number,
      district:string,
      joinDate:Date,
      father:string,
      mother:string,
      dob:Date,
      nid:string,
      phone:string,
      qualification:string,
      nomineeName:string,
      relation:string,
      bankName:string,
      account:string,
      route:string,
    }= req.body

    const user = await User.findById((req as any).params.id)

    if(!user){
      return next(ErrorHandler("SOMETHING WENT WRONG", 401, res, next))
    }

    // if (avatar !== "") {
    //     const user = await User.findById(req.user.id);
    
    //     const imageId = user.avatar.public_id;
    
    //     if (imageId) {
    //       await cloudinary.v2.uploader.destroy(imageId);
    //     }
    
    //     const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
    //       folder: "avatars",
    //       width: 200,
    //       crop: "scale",
    // });

    const data ={
      joinDate,
      section,
      category,
      designation, 
      department,
      address:{
        vill,
        thana,
        post,
        postCode,
        district
      },
      personalInformation:{
        father,
        mother,
        nid,
        dob,
        phone
      },
      qualification:{
        qualification
      },
      nominee:{
        name:nomineeName,
        relation
      },
      bank:{
        name:bankName,
        account,
        route
      }
    }

    await User.findByIdAndUpdate((req as any).params.id, data)
    res.status(201).json({
      success:true,
      message: "SUCCESSFULLY EMPLOYEE UPDATED"
    })
})



/* =====================================================================================================*/
/* ============================= STAFF SALARY (GET) (/staff/salary) ================================= */
/* ===================================================================================================== */

exports.getSalaryData = catchAsyncError(async(req:Request, res:Response, next:NextFunction)=>{
    const staff = await User.find({category:"Staff"}).select("name salary employeeId bank")
    
    if(!req.body.date){
      return next(ErrorHandler("Date Not Found! Please fill Salary Date", 404, res, next))
    }

    await generatePDFFromUrl("http://localhost:4000", "Output.pdf")

    const pdf = "http://localhost:4000/Output.pdf"

    res.status(200).json({
      success:true,
      staff,
      pdf
    })
})



exports.getMeterialPdf = catchAsyncError(async (req:Request, res:Response, next:NextFunction) => {
  var { data } = fs.readFileSync("./Output.pdf");
  console.log(data);
  res.setHeader("Content-Type", "application/pdf");
  return res.send(data);

  // return res.status(200).json({
  //   success: true,
  //   data: data,
  // });
});
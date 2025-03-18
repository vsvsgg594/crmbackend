import Attendence from "../model/attendence.js";
import User from '../model/user.js';

export const makeAttendence=async(req,res)=>{
    try{
        const{userId,status,checkInTime,checkOutTime}=req.body;
        const user=await User.findOne({_id:userId});
        const newAttendence=new Attendence({
            userId,status,checkInTime,checkOutTime,user
        });
        await newAttendence.save();
        return res.status(200).json({message:"successfully make attendence",newAttendence,user})


    }catch(err){
        console.log("failed to make attendence",err);
        return res.status(400).json({message:"failed to make attendence"})

    }
}

export const getAllAttendence=async(req,res)=>{
    try{
        const attendences=await Attendence.find();
        if(!attendences){
            return res.status(404).json({message:"attendence not found"});
        }
        return res.status(200).json({message:"successfully fetch all attendence",attendences})

    }catch(err){
        console.log("failed to get attendence",err);
        return res.status(400).json({message:"failed to get all attendence"})
    }
}
export const findAttendeById=async(req,res)=>{
    try{
        const{attendenceId}=req.params;
        const attendence=await Attendence.findOne({_id:attendenceId});
        if(!attendence){
            return res.status(404).json({message:"Attendence not found"});
        }
        return res.status(200).json({message:"succeessfully find attendence",attendence});
    }

    catch(err){
        console.log("failed to find attendence data",err);
        return res.status(402).json({message:"failed to find attendence",err})

    }
}
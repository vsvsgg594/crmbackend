import mongoose from "mongoose";
import User from "../model/user.js";
import Leave from "../model/leave.js";

export const takeLeave = async (req, res) => {
    try {
        const{empId}=req.params;
        const { userId, leaveType, startDate, endDate, reason } = req.body;

        // Validate required fields
        if (!userId || !leaveType || !startDate || !endDate ) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Validate if userId is a proper ObjectId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid userId format" });
        }

        console.log("Received userId:", userId);

        // Find user by _id
        const user = await User.findOne({ _id: userId });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const totalDays = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) + 1;
         const findUser=await User.findOne({empId});
         console.log("user who take leave ",findUser);
        // Save new leave request
        const newLeave = new Leave({ userId, empId,leaveType, startDate, endDate, reason, totalDays });
        await newLeave.save();

        return res.status(200).json({ message: "Leave request submitted successfully", leave: newLeave, user });

    } catch (err) {
        console.error("Failed to process leave request:", err);
        return res.status(500).json({ message: "Failed to request leave", error: err.message });
    }
};


// Admin approve or reject leave requrest

export const handleLeaveRequest = async (req, res) => {
    try {
        const{empId}=req.params;
        const { userId, status, adminComments } = req.body;

        // Validate required fields
        if (!userId || !status) {
            return res.status(400).json({ message: "User ID and status are required" });
        }

        // Check if the user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        

        // Find the latest leave record for the user
        const lastLeave = await Leave.findOne({ userId })
            .sort({ endDate: -1 }) // Get the latest leave by sorting endDate in descending order
            .select("endDate");

        // if (!lastLeave) {
        //     return res.status(400).json({ message: "No previous leave records found. You can apply for leave." });
        // }

        // Calculate days since last leave ended
        const lastEndDate = new Date(lastLeave.endDate);
        const today = new Date();
        const diffInDays = Math.ceil((today - lastEndDate) / (1000 * 60 * 60 * 24));

        // if (diffInDays <= 7) {
        //     return res.status(403).json({
        //         message: `You are not eligible to apply for leave yet. Please wait ${7} more days.`,
        //     });
        // }

        // Approve leave request and update adminComments
        const leaveRequest = await Leave.findOneAndUpdate(
            { userId, status: "pending" }, // Find the pending leave request
            { status: "approved", adminComments }, // Update status & adminComments
            { new: true } // Return the updated leave request
        );
        const findUserByEMpI=await User.findOne({empId});
        console.log("emp ",findUserByEMpI);

        if (!leaveRequest) {
            return res.status(404).json({ message: "No pending leave request found for this user" });
        }


        return res.status(200).json({
            message: "Leave request approved successfully",
            leaveRequest,
            user
        });

    } catch (err) {
        console.error("Error handling leave request:", err);
        return res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
};

export const handleLeaveRequestReject=async(req,res)=>{
    try{
        const{userId,status,adminComments,empId}=req.body;
        const users=await User.findOne({_id:userId});
        if(!users){
            return res.status(404).json({message:"User not found"});
        }
        const leaveRequest=await Leave.findOneAndUpdate(
            {userId},
            {status:"rejected",adminComments},
            {new:true}
        )
        return res.status(200).json({message:"you leave is rejected",leaveRequest})

    }catch(err){
        console.log("failed to rejecte leave requrest",err);
        return res.status(301).json({message:"failed to rejected leave request"})

    }
}

<<<<<<< HEAD
// In your leave controller
export const getAllLeave = async (req, res) => {
    try {
      const leaves = await Leave.find().populate({
        path: 'userId',
        select: 'name department' // Only get these fields
      });
      
      if (!leaves || leaves.length === 0) {
        return res.status(404).json({ message: "No leaves found" });
      }
      
      return res.status(200).json({ 
        message: "Successfully fetched all leaves",
        leaves 
      });
    } catch (err) {
      console.error("Failed to fetch leaves:", err);
      return res.status(500).json({ message: "Failed to fetch leaves", error: err.message });
=======
export const getAllLeave=async(req,res)=>{
    try{
        const leaves=await Leave.find();
        if(!leaves){
            return res.status(404).json({message:"Leave Not Found"});
        }
       
        return res.status(200).json({message:"successfully fetch all leave",leaves});

    }catch(err){
        console.log("failed to fetch error",err);
        return res.status(402).json({message:"failed to fecth error",err})

>>>>>>> 70d7c2e (updated code)
    }
  };


export const findLeaveByEmpId = async (req, res) => {
    try {
        const { empId } = req.params;

        // Find the leave by empId
        const leaveByEmpId = await Leave.findOne({ empId });
        if (!leaveByEmpId) {
            return res.status(404).json({ message: "Leave record not found" });
        }

        // Find the user who applied for leave using empId
        const user = await User.findOne({ empId });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ leave: leaveByEmpId, user });
    } catch (err) {
        console.error("Error fetching leave and user:", err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

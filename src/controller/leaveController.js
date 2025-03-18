import mongoose from "mongoose";
import User from "../model/user.js";
import Leave from "../model/leave.js";

export const takeLeave = async (req, res) => {
    try {
        const { userId, leaveType, startDate, endDate, reason } = req.body;

        // Validate required fields
        if (!userId || !leaveType || !startDate || !endDate) {
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

        // Check for overlapping leave
        const overlappingLeave = await Leave.findOne({
            userId,
            startDate: { $lte: new Date(endDate) },
            endDate: { $gte: new Date(startDate) }
        });
        if (overlappingLeave) {
            return res.status(400).json({ message: "You already have leave during this period." });
        }

        // Calculate totalDays
        const totalDays = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) + 1;

        // Save new leave request
        const newLeave = new Leave({ userId, leaveType, startDate, endDate, reason, totalDays });
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

        if (!lastLeave) {
            return res.status(400).json({ message: "No previous leave records found. You can apply for leave." });
        }

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
        const{userId,status,adminComments}=req.body;
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

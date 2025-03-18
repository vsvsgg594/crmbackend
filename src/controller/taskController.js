import Task from "../model/task.js";
import User from '../model/user.js';
import { findUserById } from "./userController.js";


export const createTask=async(req,res)=>{
    try{
        const{title,des,assignTo,assignBy,status,priority,deadline}=req.body;
        if(!title||!des||!status){
            return res.status(401).json({message:"All fields are required"});
        }
        const assinser=await User.findOne({_id:assignBy});
        const assign=await User.findOne({_id:assignTo});
        if(!assinser){
            return res.status(404).json({message:"Assigner not found"});
        }
        if(!assign){
            return res.status(404).json({message:"Assign not found "})
        }
        const newTask=new Task({
            title,des,assignTo,assignBy,status,priority,deadline
        })
      await newTask.save();
      return res.status(200).json({message:"successfully create task",newTask});

    }catch(err){
        console.log("failed to create task",err);
        return res.status(400).json({message:"failed to create task",err});

    }
}


export const approveTask = async (req, res) => {
    try {
        const { taskId } = req.params;

        if (!taskId) {
            return res.status(400).json({ message: "Task ID is required" });
        }

        // Find the task and update `isAvailable` and `status`
        const updatedTask = await Task.findByIdAndUpdate(
            taskId,
            { isAvaliable: true, status: "process" },
            { new: true } // Returns the updated document
        );
       

        if (!updatedTask) {
            return res.status(404).json({ message: "Task not found" });
        }
        await updatedTask.save();

        return res.status(200).json({ message: "Task accepted successfully", task: updatedTask });
    } catch (err) {
        console.error("Failed to accept task:", err);
        return res.status(500).json({ message: "Failed to accept task", error: err.message });
    }
};


export const updateTaskByAssigner = async (req, res) => {
    try {
        const { userId, taskId } = req.params;
        const { assignTo, status, priority, deadline } = req.body;

    
        const assigner = await User.findById(userId);
        if (!assigner) {
            return res.status(404).json({ message: "Assigner not found" });
        }

       
        const task = await Task.findOne({ _id: taskId, assignBy: userId });
        if (!task) {
            return res.status(404).json({ message: "Task not found or unauthorized update" });
        }

       
        if (assignTo) {
            const newAssignee = await User.findById(assignTo);
            if (!newAssignee) {
                return res.status(404).json({ message: "New assignee not found" });
            }
            task.assignTo = assignTo; // Reassign task
        }

        
        if (status) task.status = status;
        if (priority) task.priority = priority;
        if (deadline) task.deadline = deadline;

        
        await task.save();

        return res.status(200).json({ message: "Task updated successfully", task });

    } catch (err) {
        console.error("Failed to update task", err);
        return res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
};


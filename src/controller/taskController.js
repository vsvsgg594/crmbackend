import Task from "../model/task.js";
import User from '../model/user.js';



export const createTask = async (req, res) => {
    try {
        // Get assignBy from params
        const { assignBy } = req.params;  
        const { title, des, assignTo, status, priority, deadline } = req.body;

        // Check required fields
        if (!title || !des || !status || !assignTo ||!deadline) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Find the assigner (assignBy) using empId
        const assigner = await User.findOne({ empId: assignBy });
        if (!assigner) {
            return res.status(404).json({ message: "Assigner not found" });
        }

        // Find the assignee (assignTo) using empId
        const assignee = await User.findOne({ empId: assignTo });
        if (!assignee) {
            return res.status(404).json({ message: "Assignee not found" });
        }

        // Create new task with MongoDB ObjectIds
        const newTask = new Task({
            title,
            des,
            assignTo: assignee._id,  // Store MongoDB ObjectId, NOT empId
            assignBy: assigner._id,  // Store MongoDB ObjectId, NOT empId
            status,
            priority,
            deadline
        });

        await newTask.save();
        return res.status(201).json({ message: "Successfully created task", newTask });

    } catch (err) {
        console.error("Failed to create task", err);
        return res.status(500).json({ message: "Failed to create task", error: err.message });
    }
};



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


export const getAllTask = async (req, res) => {
    try {
        const tasks = await Task.find()
            .populate("assignBy", "name email designation department phone img ")  // Fetch assigner's details
            .populate("assignTo", "name email designation department phone img")  // Fetch assignee's details
            .exec();

        if (!tasks || tasks.length === 0) {
            return res.status(404).json({ message: "No tasks found" });
        }

        return res.status(200).json({ message: "Tasks retrieved successfully", tasks });
    } catch (err) {
        console.error("Failed to fetch tasks", err);
        return res.status(500).json({ message: "Failed to fetch tasks", error: err.message });
    }
};



export const findTaskByEmpId = async (req, res) => {
    try {
        const { empId } = req.params;

        // Step 1: Find the user with the given empId
        const user = await User.findOne({ empId });
        if (!user) {
            return res.status(404).json({ message: `User with empId ${empId} not found` });
        }

        // Step 2: Find tasks assigned **TO** this user & populate assignBy details
        const tasks = await Task.find({ assignTo: user._id })
            .populate({
                path: "assignTo", 
                select: "_id name email phone designation department img"
            })
            .populate({
                path: "assignBy",
                select: "_id name email phone designation department img"
            });

        // Step 3: Find tasks assigned **BY** this user & populate assignTo details
        const taskAssigner = await Task.find({ assignBy: user._id })
            .populate({
                path: "assignTo",
                select: "_id name email phone designation department"
            })
            .populate({
                path: "assignBy",
                select: "_id name email phone designation department"
            });

        return res.status(200).json({
            message: "Tasks retrieved successfully",
            tasks,
            taskAssigner
        });

    } catch (err) {
        console.error("Failed to find tasks", err);
        return res.status(500).json({ message: "Failed to fetch tasks by empId" });
    }
};

export const markTaskAsCompleted = async (req, res) => {
    try {
        const { taskId } = req.params;
        const { empId } = req.body; // Get the employee who is completing the task

        // Find the user who is marking the task as completed
        const user = await User.findOne({ empId });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Find the task by ID
        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        // Update task status and store who completed it
        task.status = "completed";
        task.completedBy = user._id; // Storing the employee's ID who completed the task
        await task.save();

        return res.status(200).json({ message: "Task marked as completed successfully", task });

    } catch (err) {
        console.error("Failed to update task status", err);
        return res.status(500).json({ message: "Failed to update task status" });
    }
};


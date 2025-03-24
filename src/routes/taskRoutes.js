import express from 'express';
import {createTask,approveTask,updateTaskByAssigner}  from '../controller/taskController.js';
const router =express.Router();

router.post("/createTask/:assignBy",createTask);
router.put("/accptedTask/:taskId",approveTask);
router.put("/updateTask/:userId/:taskId",updateTaskByAssigner)

export default router;
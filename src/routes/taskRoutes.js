import express from 'express';
import {createTask,approveTask,updateTaskByAssigner,getAllTask,findTaskByEmpId}  from '../controller/taskController.js';
const router =express.Router();

router.post("/createTask/:assignBy",createTask);
router.put("/accptedTask/:taskId",approveTask);
router.put("/updateTask/:userId/:taskId",updateTaskByAssigner);
router.get("/gettask",getAllTask);
router.get("/gettask/:empId",findTaskByEmpId);

export default router;
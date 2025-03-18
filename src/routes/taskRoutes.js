import express from 'express';
import {createTask,approveTask}  from '../controller/taskController.js';
const router =express.Router();

router.post("/createTask",createTask);
router.put("/accptedTask/:taskId",approveTask)


export default router;
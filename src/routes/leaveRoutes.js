import express from 'express';
import {takeLeave,handleLeaveRequest,handleLeaveRequestReject,getAllLeave,findLeaveByEmpId} from '../controller/leaveController.js';

const router=express.Router();

router.post("/leaverequest/:empId",takeLeave);
router.put("/approveleave",handleLeaveRequest);
router.put("/rejectedleave",handleLeaveRequestReject);
router.put("/getAll",getAllLeave);
router.get("/get/:empId",findLeaveByEmpId);

export default router;

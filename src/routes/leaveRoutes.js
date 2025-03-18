import express from 'express';
import {takeLeave,handleLeaveRequest,handleLeaveRequestReject} from '../controller/leaveController.js';

const router=express.Router();

router.post("/leaverequest",takeLeave);
router.put("/approveleave",handleLeaveRequest);
router.put("/rejectedleave",handleLeaveRequestReject);


export default router;

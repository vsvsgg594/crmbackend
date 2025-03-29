import {makeAttendence,getAllAttendence,findAttendeById,checkOutAttendance} from '../controller/attendenceController.js';
import { upload } from '../utils/multerConfiguration.js';
import express from 'express';

const router=express.Router();

router.post("/makeAttendence/:empId",upload,makeAttendence);
router.get("/getAttendence",getAllAttendence);
router.get("/findAttendence/:empId",findAttendeById);
router.put("/checkout/:empId",checkOutAttendance);

export default router;



import {makeAttendence,getAllAttendence,findAttendeById} from '../controller/attendenceController.js';

import express from 'express';

const router=express.Router();

router.post("/makeAttendence",makeAttendence);
router.get("/getAttendence",getAllAttendence);
router.get("/findAttendence/:attendenceId",findAttendeById)

export default router;



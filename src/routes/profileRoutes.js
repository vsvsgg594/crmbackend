import { createProfile, deleteProfile, updateProfile } from "../controller/profileController.js";
import express from 'express';
import {upload} from '../utils/multerConfiguration.js'

const router=express.Router();

router.post("/createprofile",upload,createProfile);
router.put("/updateprofile",updateProfile);
router.delete("/deleteprofile",deleteProfile);



export default router;
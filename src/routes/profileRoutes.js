import { createProfile,updateProfile,deleteProfile } from "../controller/profileController.js";
import express from 'express';
import {upload} from '../utils/multerConfiguration.js'

const router=express.Router();

router.post("/createprofile",upload,createProfile);
router.put("/updateprofile/:profileId",upload,updateProfile);
router.delete("/deleteprofile/:profileId",upload,deleteProfile);



export default router;
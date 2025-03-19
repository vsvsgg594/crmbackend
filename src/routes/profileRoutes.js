import { createProfile, deleteProfile, updateProfile } from "../controller/profileController.js";
import express from 'express';
import {upload} from '../utils/multerConfiguration.js'

const router=express.Router();

router.post("/createprofile",upload,createProfile);
router.put("/updateprofile/:profileId",upload,updateProfile);
router.delete("/deleteprofile/:profileId",deleteProfile);



export default router;
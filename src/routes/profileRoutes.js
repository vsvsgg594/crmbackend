import { createProfile } from "../controller/profileController.js";
import express from 'express';
import {upload} from '../utils/multerConfiguration.js'

const router=express.Router();

router.post("/createprofile",upload,createProfile);



export default router;
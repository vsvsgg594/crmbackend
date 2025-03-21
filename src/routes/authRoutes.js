import express from 'express';
import {loginUser} from '../../src/controller/authController.js';

const router=express.Router();
router.post("/auth/login",loginUser);

export default router;
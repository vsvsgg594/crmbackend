import {addEmployee,updateUser,findUserById,deleteUser,getAllUser} from '../controller/userController.js';
import express from 'express';


const router=express.Router();
router.post("/addUser",addEmployee);
router.put('/updateUser/:userId',updateUser);
router.get("/findUser/:userId",findUserById);
router.delete("/deleteUser/:userId",deleteUser);
router.get("/getUser",getAllUser);
export default router;

import {addEmployee,updateUser,findUserById,deleteUser,getAllUser,findUserByEmpId} from '../controller/userController.js';
import express from 'express';
import {upload} from '../utils/multerConfiguration.js';


const router=express.Router();
router.post("/addUser", upload, addEmployee);

router.put('/updateUser/:userId',upload,updateUser);
router.get("/findUser/:userId",findUserById);
router.delete("/deleteUser/:userId",deleteUser);
router.get("/getUser",getAllUser);
router.get("/getuser/:empId",findUserByEmpId);
export default router;


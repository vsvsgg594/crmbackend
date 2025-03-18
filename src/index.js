import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import ConnectDb from './db/ConnectDb.js';
import userRoutes from "./routes/userRoutes.js";
import bodyParser from 'body-parser';
import attedenceRoutes from './routes/attendenceRoutes.js';
import leaveRoutes from  './routes/leaveRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
dotenv.config();
ConnectDb();
const app=express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use("/api/user",userRoutes);
app.use("/api/user/attendence",attedenceRoutes);
app.use("/api/leave",leaveRoutes);
app.use("/api/task",taskRoutes);

const PORT=8000 || process.env.PORT;
app.listen(PORT,()=>{
    console.log("server is running")
})


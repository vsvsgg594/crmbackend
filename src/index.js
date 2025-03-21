import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import ConnectDb from './db/ConnectDb.js';
import userRoutes from "./routes/userRoutes.js";
import bodyParser from 'body-parser';
import attedenceRoutes from './routes/attendenceRoutes.js';
import leaveRoutes from  './routes/leaveRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import profileRoutes from './routes/profileRoutes.js'
import {fileURLToPath} from 'url';
import path from 'path';
import authRoutes from './routes/authRoutes.js';

dotenv.config();
ConnectDb();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app=express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());
app.use('/uploads', express.static('uploads'));
app.use('/uploads', express.static(path.resolve(__dirname, 'uploads')));
app.use("/api/user",userRoutes);
app.use("/api/user/attendence",attedenceRoutes);
app.use("/api/leave",leaveRoutes);
app.use("/api/task",taskRoutes);
app.use("/api/profile",profileRoutes);
app.use("/api/user",authRoutes);

const PORT=8000 || process.env.PORT;
app.listen(PORT,()=>{
    console.log("server is running")
})


import mongoose from "mongoose";

const taskShchema=mongoose.Schema({
    title:{type:String,required:true},
    des:{type:String,required:true},
    assignTo:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},
    assignBy:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},
    status:{type:String,enum:['pending','process','completed'],default:'pending'},
    priority:{type:String,enum:['high','medium','low'],default:'high'},
    deadline:{type:Date},
    createdAt:{type:Date,default:Date.now},
    isAvaliable:{type:Boolean,default:false}
});
const Task=mongoose.model("Task",taskShchema);
export default Task;
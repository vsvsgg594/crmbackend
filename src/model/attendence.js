import mongoose from "mongoose";
const attendenceSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    empId: { type: String, required: true }, // ❌ Remove `unique: true`
    date: { type: String, required: true }, // Store as string YYYY-MM-DD
    status: { type: String, enum: ["present", "absent", "leave"], default: "absent" },
    checkInTime: { type: String },
    checkOutTime: { type: String },
    totalHours: { type: Number },
    image: { type: String },
    location: { type: String }
});

const Attendence = mongoose.model("Attendence", attendenceSchema);
export default Attendence;

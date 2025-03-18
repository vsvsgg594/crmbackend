import mongoose from "mongoose";

const attendenceSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, default: Date.now }, // ✅ Corrected
    status: { type: String, enum: ["present", "absent", "leave"], default: "absent" }, // ✅ Match lowercase
    checkInTime: { type: String },
    checkOutTime: { type: String }
});

const Attendence = mongoose.model("Attendence", attendenceSchema);
export default Attendence;

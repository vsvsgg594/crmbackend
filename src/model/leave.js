import mongoose from "mongoose";

const leaveSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    
    leaveType: { 
        type: String, 
        enum: ["sick", "casual", "annual", "maternity", "paternity", "unpaid"], 
        required: true 
    },
    
    startDate: { type: Date, required: true },  // Leave start date
    endDate: { type: Date, required: true },    // Leave end date
    totalDays: { type: Number, required: true }, // Automatically calculated
    reason: { type: String, required: true },  // Reason for leave
    status: { 
        type: String, 
        enum: ["pending", "approved", "rejected"], 
        default: "pending" 
    },
    empId: { type: String, unique: true },
    
    adminComments: { type: String },  // Optional: Admin can add comments for rejection
    appliedAt: { type: Date, default: Date.now },  // When leave was applied
    reviewedAt: { type: Date }  // When admin reviewed the request
}, {timestamps: true});

// Pre-save middleware to calculate total leave days
leaveSchema.pre("save", function (next) {
    const oneDay = 1000 * 60 * 60 * 24;
    this.totalDays = Math.round((this.endDate - this.startDate) / oneDay) + 1;
    next();
});

const Leave = mongoose.model("Leave", leaveSchema);
export default Leave;

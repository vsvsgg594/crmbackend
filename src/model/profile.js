import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  // References to other models
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }], 
  leaves: [{ type: mongoose.Schema.Types.ObjectId, ref: "Leave" }],

  // Profile Image
  profileImage: { type: String }, // Store the file path or URL
  
  // Aadhaar Card Details
  aadhaarNumber: { type: String, unique: true, sparse: true }, // Store Aadhaar number
  aadhaarImage: { type: String }, // Store Aadhaar image file path

  // Bank Details
  bankDetails: {
    accountHolderName: { type: String },
    accountNumber: { type: String },
    ifscCode: { type: String },
    bankName: { type: String },
    branchName: { type: String },
  },

  // Social Links
  socialLinks: {
    linkedin: { type: String },
    github: { type: String },
    twitter: { type: String },
    facebook: { type: String },
    instagram: { type: String },
  },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Profile = mongoose.model("Profile", profileSchema);
export default Profile;

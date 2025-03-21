import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  img: { type: String},
  designation: { type: String, required: true },
  department: { type: String, required: true },
  joiningDate: { type: Date, required: true },
  role: {
    type: String,
    enum: ['employee', 'admin'],
    default: 'employee'
  },
  refreshToken: { type: String },
  isVerified: { type: Boolean, default: false },
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();  
});

// Validate password
userSchema.methods.isValidPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Generate Access and Refresh Tokens
userSchema.methods.generateTokens = function () {
  const accessToken = jwt.sign(
    { userId: this._id, role: this.role },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "10d" }
  );

  const refreshToken = jwt.sign(
    { userId: this._id, role: this.role },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "5d" }
  );

  this.refreshToken = refreshToken; // Save refresh token in DB
  return { accessToken, refreshToken };
};

export default mongoose.model('User', userSchema);

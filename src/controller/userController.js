import User from "../model/user.js";
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { uploadedFileOnCloudinary } from "../utils/cloudinary.js";

const generateEmpId = async () => {
    let empId;
    let isUnique = false;

    while (!isUnique) {
        empId = `KBC${Math.floor(100000 + Math.random() * 900000)}`; // Generates a 6-digit random number
        const existingUser = await User.findOne({ empId });
        if (!existingUser) {
            isUnique = true;
        }
    }

    return empId;
};

const transporter=nodemailer.createTransport({
    service:"gmail",
    port:576,
    host:"smtp.gmail.com",
    secure:false,
    auth:{
        user:process.env.EMAIL,
        pass:process.env.PASSWORD
    }
})


export const addEmployee = async (req, res) => {
    try {
        const { name, email, password, phone, designation, joiningDate, department, empId } = req.body;
        const img = req.files ? req.files.filename : null;

        // Check for missing fields
        if (!name || !email || !password || !phone || !designation || !joiningDate || !department) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Convert date to the correct format
        const formattedDate = joiningDate ? new Date(joiningDate.split("-").reverse().join("-")) : null;

        if (!formattedDate || isNaN(formattedDate.getTime())) {
            return res.status(400).json({ message: "Invalid joining date format" });
        }

        // Check if email or phone already exists
        const existEmail = await User.findOne({ email });
        const existPhone = await User.findOne({ phone });

        if (existEmail) {
            return res.status(400).json({ message: "Email already exists" });
        }
        if (existPhone) {
            return res.status(400).json({ message: "Phone number already exists" });
        }

        // Generate empId if not provided
        const finalEmpId = empId || (await generateEmpId());

        let imageUrl = "";
        if (req.files && req.files.img) {  // Assuming 'img' is the field name
            imageUrl = await uploadedFileOnCloudinary(req.files.img[0].path);
        }

        // Create new user instance
        const newUser = new User({
            name,
            email,
            password,
            phone,
            designation,
            department,
            joiningDate: formattedDate,
            img: imageUrl.secure_url || "",
            empId: finalEmpId
        });

        // Generate access and refresh tokens
        const { accessToken, refreshToken } = newUser.generateTokens();
        const mailOptions={
            from:process.env.EMAIL,
            to:email,
            subject:"Employee Account details",
            html:`
            <h2>Welcome to the Team, ${name}!</h2>
                <p>Your employee account has been successfully created.</p>
                <p>Here are your login credentials:</p>
                <ul>
                    <li><strong>Employee ID:</strong> ${finalEmpId}</li>
                    <li><strong>Employee EMAIL:</strong>${email}</li>
                    <li><strong>Password:</strong> ${password}</li>
                    <li><strong>Designation:</strong> ${designation}</li>
                    <li><strong>Department:</strong> ${department}</li>
                    <li><strong>JoiningDate:</strong> ${joiningDate}</li>
                </ul>
                <p>Please keep this information secure and change your password after first login.</p>
                <p>Best regards,</p>
                <p>HR Team</p>
            `

            
        }

        // Save user to the database
        newUser.refreshToken = refreshToken;
        await newUser.save();
        await transporter.sendMail(mailOptions);

        return res.status(201).json({
            message: "Employee added successfully",
            user: newUser,
            accessToken,
            refreshToken
        });

    } catch (err) {
        console.error("Failed to create user:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const updateUser = async (req, res) => {
    try {
        const { userId } = req.params;

        // Check if the user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Extract fields from request body
        const { name, email, phone, designation, department, joiningDate } = req.body;

        console.log("Received Files:", req.files); // Debugging line

        let imageUrl = user.img; // Default to existing image

        // Ensure req.files exists and has img
        if (req.files && req.files.img) {  
            const imgFile = Array.isArray(req.files.img) ? req.files.img[0] : req.files.img; // Handle both array and object cases
            if (imgFile?.path) {
                const uploadedImage = await uploadedFileOnCloudinary(imgFile.path);
                if (uploadedImage?.secure_url) {
                    imageUrl = uploadedImage.secure_url;
                }
            }
        }

        // Update user fields
        if (name) user.name = name;
        if (email) user.email = email;
        if (phone) user.phone = phone;
        if (designation) user.designation = designation;
        if (department) user.department = department;
        user.img = imageUrl; // Update or retain old image

        // Handle joiningDate validation
        if (joiningDate) {
            const formattedDate = new Date(joiningDate.split("-").reverse().join("-"));
            if (isNaN(formattedDate.getTime())) {
                return res.status(400).json({ message: "Invalid joining date format" });
            }
            user.joiningDate = formattedDate;
        }

        // Save the updated user
        const updatedUser = await user.save();

        return res.status(200).json({ message: "User updated successfully", updatedUser });

    } catch (err) {
        console.error("Failed to update user:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
};



export const findUserById=async(req,res)=>{
    try{
        const{userId}=req.params;
        const user=await User.findOne({_id:userId});
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        return res.status(200).json({message:"user found",user})

    }catch(err){
        console.log("failed to find user",err);
        return res.status(402).json({message:"falied to find user"})

    }
}
export const deleteUser=async(req,res)=>{
    try{
        const {userId}=req.params;
        const user=await User.findOneAndDelete({_id:userId});
        if(!user){
            return res.status(404).json({message:"failed to delete user"})
        }
        return res.status(200).json({message:"delete successfully",user});

    }catch(err){
        console.log("failed to delete user");
        return res.status(400).json({message:"failed to delete user"});

    }
}

export const getAllUser = async (req, res) => {
    try {
        const users = await User.find({ role: { $ne: 'admin' } }); 
       
        if (!users || users.length === 0) {
            return res.status(404).json({ message: "No employees found" });
        }

        return res.status(200).json({ message: "Successfully fetched employees", users });

    } catch (err) {
        console.log("Failed to fetch users", err);
        return res.status(500).json({ message: "Failed to fetch users" });
    }
};

export const findUserByEmpId=async(req,res)=>{
    try{
        const{empId}=req.params;

        const user=await User.find({empId});
        if(!user){
            return res.status(404).json({message:"user not found"});
        }
        return res.status(200).json({message:"User found successfully",user});

    }catch(err){
        console.log("failed to fetch user",err);
        return res.status(302).json({message:"failed to fetch user",err});

    }
}

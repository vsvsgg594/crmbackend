import Profile from "../model/profile.js";
import { uploadedFileOnCloudinary } from '../utils/cloudinary.js';

export const createProfile = async (req, res) => {
    try {
        console.log("Received Request Body:", req.body);
        console.log("Received Files:", req.files);

        const { userId, tasks, leaves, aadhaarNumber } = req.body;

        // Convert JSON string fields to objects
        const bankDetails = req.body.bankDetails ? JSON.parse(req.body.bankDetails) : {};
        const socialLinks = req.body.socialLinks ? JSON.parse(req.body.socialLinks) : {};

        console.log("Parsed bankDetails:", bankDetails);
        console.log("Parsed socialLinks:", socialLinks);

        let profileImageUrl = "";
        let aadhaarImageUrl = "";

        if (req.files) {
            if (req.files.profileImage) {
                profileImageUrl = await uploadedFileOnCloudinary(req.files.profileImage[0].path);
            }
            if (req.files.aadhaarImage) {
                aadhaarImageUrl = await uploadedFileOnCloudinary(req.files.aadhaarImage[0].path);
            }
        }

        const newProfile = new Profile({
            userId,
            tasks,
            leaves,
            profileImage: profileImageUrl ? profileImageUrl.secure_url : null,
            aadhaarNumber,
            aadhaarImage: aadhaarImageUrl ? aadhaarImageUrl.secure_url : null,
            bankDetails,
            socialLinks
        });

        await newProfile.save();
        res.status(201).json({ message: "Profile created successfully", profile: newProfile });

    } catch (err) {
        console.error("Error creating profile:", err);
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
};

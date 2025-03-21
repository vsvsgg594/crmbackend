import Profile from "../model/profile.js";
import { uploadedFileOnCloudinary ,deleteFileFromCloudinary} from '../utils/cloudinary.js';

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


export const updateProfile = async (req, res) => {
    try {
        const { profileId } = req.params;
        const { userId,tasks, leaves, aadhaarNumber } = req.body;

        // Validate userId
        if (!mongoose.Types.ObjectId.isValid(profileId)) {
            return res.status(400).json({ message: "Invalid userId" });
        }

        // Parse JSON fields safely
        let bankDetails = {};
        let socialLinks = {};
        try {
            bankDetails = req.body.bankDetails ? JSON.parse(req.body.bankDetails) : {};
            socialLinks = req.body.socialLinks ? JSON.parse(req.body.socialLinks) : {};
        } catch (err) {
            return res.status(400).json({ message: "Invalid JSON format in bankDetails or socialLinks" });
        }

        let profileImageUrl = "";
        let aadhaarImageUrl = "";

        // Upload images if provided
        if (req.files?.profileImage?.[0]?.path) {
            const uploadedProfileImage = await uploadedFileOnCloudinary(req.files.profileImage[0].path);
            profileImageUrl = uploadedProfileImage?.secure_url;
        }
        if (req.files?.aadhaarImage?.[0]?.path) {
            const uploadedAadhaarImage = await uploadedFileOnCloudinary(req.files.aadhaarImage[0].path);
            aadhaarImageUrl = uploadedAadhaarImage?.secure_url;
        }

        // Find and update the profile
        const updatedProfile = await Profile.findOneAndUpdate(
            { _id: profileId },
            {
                userId,
                tasks,
                leaves,
                profileImage: profileImageUrl ,
                aadhaarNumber,
                aadhaarImage: aadhaarImageUrl ,
                bankDetails,
                socialLinks,
                updatedAt: new Date(), // Update the timestamp
            },
            { new: true }
        );

        if (!updatedProfile) {
            return res.status(404).json({ message: "Profile not found" });
        }

        return res.status(200).json({ message: "Profile updated successfully", profile: updatedProfile });

    } catch (err) {
        console.error("Error updating profile:", err);
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
};

export const deleteProfile = async (req, res) => {
    try {
        const { profileId } = req.params;

        // Find the profile first
        const profile = await Profile.findById(profileId);
        if (!profile) {
            return res.status(404).json({ message: "Profile not found" });
        }

        // Delete profile images from Cloudinary if they exist
        if (profile.profileImage) {
            await deleteFileFromCloudinary(profile.profileImage);
        }
        if (profile.aadhaarImage) {
            await deleteFileFromCloudinary(profile.aadhaarImage);
        }

        // Delete profile from the database
        await Profile.findByIdAndDelete(profileId);

        return res.status(200).json({ message: "Profile deleted successfully" });
    } catch (err) {
        console.error("Error deleting profile:", err);
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
};









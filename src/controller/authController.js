import User from '../model/user.js';

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not registered" });
        }

        // Assuming you have a method in your User model to validate passwords
        const isValidPassword = await user.isValidPassword(password);

        if (!isValidPassword) {
            return res.status(401).json({ message: "Password does not match" });
        }

         const token=user.generateTokens();
        // Check user role (assuming the role is stored in user.role)
        if (user.role === "admin") {
            return res.status(200).json({ message: "Admin login successful", role: "admin", user });
        } else if (user.role === "employee") {
            return res.status(200).json({ message: "Employee login successful", role: "employee", user });
        } else {
            return res.status(403).json({ message: "Unauthorized role" });
        }
    } catch (err) {
        console.error("Login error:", err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

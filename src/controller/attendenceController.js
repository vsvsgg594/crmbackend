import Attendence from "../model/attendence.js";
import User from '../model/user.js';

// export const makeAttendence = async (req, res) => {
//     try {
//         const { empId } = req.params;
//         const today = new Date().toISOString().split("T")[0]; // Get today's date

//         const user = await User.findOne({ empId });
//         if (!user) {
//             return res.status(404).json({ message: "User not found" });
//         }

//         let attendance = await Attendence.findOne({ empId, date: today });

//         if (!attendance) {
//             // If no record for today, create a new one
//             attendance = new Attendence({
//                 empId,
//                 status: "present", // ✅ Default status is "present"
//                 checkInTime: new Date().toISOString(),
//                 date: today,
//                 image,
//                 location,
//                 user
//             });
//         } else {
//             // If record exists, update it
//             attendance.status = "present"; // ✅ Update status
//             attendance.checkInTime = new Date().toISOString();
//         }

//         await attendance.save();
//         return res.status(200).json({ message: "Attendance updated successfully", newAttendence: attendance,user });

//     } catch (err) {
//         console.error("Failed to make attendance:", err);
//         return res.status(500).json({ message: "Failed to make attendance" });
//     }
// };
export const makeAttendence = async (req, res) => {
    try {
        const { empId } = req.params;
        const { latitude, longitude, image } = req.body; // Get latitude, longitude, and image from the request body
        const today = new Date().toISOString().split("T")[0]; // Get today's date

        const user = await User.findOne({ empId });
        if (!user) {
            return res.status(404).json({ message: "User  not found" });
        }

        let attendance = await Attendence.findOne({ empId, date: today });

        if (!attendance) {
            // If no record for today, create a new one
            attendance = new Attendence({
                empId,
                status: "present", // Default status is "present"
                checkInTime: new Date().toISOString(),
                date: today,
                user,
                image, // Store the image
                location: JSON.stringify({ latitude, longitude }), // Store the location as a string
            });
        } else {
            // If record exists, update it
            attendance.status = "present"; // Update status
            attendance.checkInTime = new Date().toISOString();
            attendance.image = image; // Update the image if needed
            attendance.location = JSON.stringify({ latitude, longitude }); // Update the location if needed
        }

        await attendance.save();
        return res.status(200).json({ message: "Attendance updated successfully", newAttendence: attendance, user });

    } catch (err) {
        console.error("Failed to make attendance:", err);
        return res.status(500).json({ message: "Failed to make attendance" });
    }
};

// export const getAllAttendence = async (req, res) => {
//   try {
//     const attendences = await Attendence.find()
//       .populate({
//         path: 'userId',
//         select: 'name img empId'  // Make sure these fields exist in your User model
//       })
//       .lean();
//       const empId=await Attendence.findOne({})


//     if (!attendences || attendences.length === 0) {
//       return res.status(404).json({ message: "No attendance records found" });
//     }

//     // Transform data to include calculated hours
//     const result = attendences.map(record => {
//       let hoursWorked = 0;
//       if (record.checkInTime && record.checkOutTime) {
//         // ... same hour calculation logic as before ...
//       }
      
//       return {
//         ...record,
//         calculatedHours: hoursWorked.toFixed(2),
//         // Use populated user data if available
//         employee: record.userId ? {
//           name: record.userId.name,
//           empId: record.userId.empId,
//           image: record.userId.img
//         } : null
//       };
//     });

//     res.status(200).json({ 
//       message: "Successfully fetched all attendance",
//       attendences: result
//     });
//   } catch (err) {
//     console.error("Error fetching attendance:", err);
//     res.status(500).json({ message: "Failed to get attendance records" });
//   }
// }
export const getAllAttendence = async (req, res) => {
  try {
    // Fetch all attendance records and populate user details
    const attendences = await Attendence.find()
      .populate({
        path: 'userId', // Assuming userId is a reference to the User model
        select: 'name img empId'  // Select the fields you want from the User model
      })
      .lean();

    if (!attendences || attendences.length === 0) {
      return res.status(404).json({ message: "No attendance records found" });
    }

    // Transform data to include calculated hours
    const result = await Promise.all(attendences.map(async (record) => {
      let hoursWorked = 0;
      if (record.checkInTime && record.checkOutTime) {
        // Calculate hours worked
        const checkIn = new Date(record.checkInTime);
        const checkOut = new Date(record.checkOutTime);
        const diff = (checkOut - checkIn) / (1000 * 60 * 60); // Difference in hours
        hoursWorked = diff > 0 ? diff : 0; // Ensure non-negative
      }

      // If userId is populated, use it; otherwise, find user by empId
      let employee = record.userId ? {
        name: record.userId.name,
        empId: record.userId.empId,
        image: record.userId.img
      } : null;

      // If user is not populated, find user by empId
      if (!employee) {
        const user = await User.findOne({ empId: record.empId }).select('name img empId');
        if (user) {
          employee = {
            name: user.name,
            empId: user.empId,
            image: user.img
          };
        }
      }

      return {
        ...record,
        calculatedHours: hoursWorked.toFixed(2),
        employee // Include employee details
      };
    }));

    res.status(200).json({ 
      message: "Successfully fetched all attendance",
      attendences: result
    });
  } catch (err) {
    console.error("Error fetching attendance:", err);
    res.status(500).json({ message: "Failed to get attendance records" });
  }
}
export const findAttendeById=async(req,res)=>{
    try{
        const{empId}=req.params;
        const attendence=await Attendence.findOne({empId});
        if(!attendence){
            return res.status(404).json({message:"Attendence not found"});
        }

        const user=await User.findOne({empId});
        console.log("user",user);
        return res.status(200).json({message:"succeessfully find attendence",attendence,user});
    }

    catch(err){
        console.log("failed to find attendence data",err);
        return res.status(402).json({message:"failed to find attendence",err})

    }
}
export const checkOutAttendance = async (req, res) => {
    try {
        const { empId } = req.params;
        
        // Find today's attendance record
        const today = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"
        const attendance = await Attendence.findOne({ empId, date: { $gte: today } });

        if (!attendance) {
            return res.status(404).json({ message: "No check-in record found for today" });
        }

        const user=await User.findOne({empId});
        if(!user){

        }

        // Set checkout time
        const checkOutTime = new Date();
        const checkOutFormatted = checkOutTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });

        // Calculate total hours worked
        const checkInTime = new Date(attendance.checkInTime);
        const totalHours = ((checkOutTime - checkInTime) / (1000 * 60 * 60)).toFixed(2); // Convert ms to hours

        // Update attendance record
        attendance.checkOutTime = checkOutFormatted;
        attendance.totalhours = totalHours;
        await attendance.save();

        return res.status(200).json({ message: "Successfully checked out", attendance });

    } catch (err) {
        console.error("Failed to check out:", err);
        return res.status(500).json({ message: "Failed to check out" });
    }
};

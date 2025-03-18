import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import User from './model/user.js';

const createAdmin = async () => {
    try {
        const conn = mongoose.connect(`${process.env.MONGO_DB_URL}`);
        console.log("database connected");
        const name = "admin";
        const email = "admin@786gmail.com";
        const password = "admin@123";
        const phone = "7033209779";
        const designation = "Founder";
        const department = "System Adminitration";
        const dateString = "20-03-2003";
        const [day, month, year] = dateString.split("-");
        const joiningDate = new Date(`${year}-${month}-${day}`);


        const existEmail = await User.findOne({ email });
        if (existEmail) {
            console.log("Email Already exits");
            return;

        }
        const adminUser = new User({
            name,
            email,
            password,
            phone,
            designation,
            department,
            joiningDate,
            role: "admin"
        })
        await adminUser.save();
        console.log("admin create successfully ");



    } catch (err) {
        console.log("falied to create Admin", err);

    } finally {
        mongoose.connection.close();
    }
}
createAdmin();



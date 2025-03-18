import mongoose from "mongoose";


// dotenv.config();

const ConnectDb=async()=>{
    // console.log("moonoe",process.env.MONGO_DB_URL)
    try{
        const conn=await mongoose.connect(`${process.env.MONGO_DB_URL}`);
        // console.log("moongoees",process.env.MONGO_DB_URL);
        // console.log(conn);
        console.log("database conneted succesfully");

    }catch(err){
        console.log("failed to connect database",err);

    }
}
export default ConnectDb;
import mongoose from "mongoose";

type ConnectionObject = {
  isConnected? : number;
}

const connection : ConnectionObject = {}; 

const connectDB = async () : Promise<void> => {
   if(connection.isConnected) {
       console.log("MongoDB is already connected");
       return;
   }
   if(mongoose.connection.readyState) {
       connection.isConnected = mongoose.connection.readyState;
       console.log("MongoDB is already connected");
       return;
   }
   try{
        const db = await mongoose.connect(process.env.MONGODB_URI || "", {});
        connection.isConnected = db.connections[0].readyState;

        console.log("MongoDB connected successfully");
   }catch(error) {
        console.error("MongoDB connection failed", error);
        throw new Error("MongoDB connection failed");
        process.exit(1);
   }
};

export default connectDB;
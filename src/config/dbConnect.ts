import mongoose from "mongoose";

type ConnectionObject = {
  isConnected? : number;
}

const connection : ConnectionObject = {}; 

const connectDB = async () : Promise<void> => {
   if(connection.isConnected) {
       return;
   }
   if(mongoose.connection.readyState) {
       connection.isConnected = mongoose.connection.readyState;
       return;
   }
   try{
        const db = await mongoose.connect(process.env.MONGODB_URI || "", {});
        connection.isConnected = db.connections[0].readyState;


   }catch(error) {
        console.error("MongoDB connection failed", error);
        process.exit(1);
   }
};

export default connectDB;
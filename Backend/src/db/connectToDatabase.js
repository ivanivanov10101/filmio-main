import mongoose from "mongoose";

const connectToDatabase = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.DATABASE_URL}`,
    );
    console.log(
      ` MongoDB connected. Database Host: ${connectionInstance.connection.host}`,
    );
  } catch (error) {
    console.log(`\n MongoDB Connection Failed.`, error);
    process.exit(1);
  }
};

export default connectToDatabase;

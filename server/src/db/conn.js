import mongoose from "mongoose";

export default async function connectDB() {
  try {
    const conInstance = await mongoose.connect(process.env.MONGO_URL);
    console.log(
      "\x1b[36m%s\x1b[0m",
      `\n SUCCESS :: MONGODB connected, \n DB HOST: ${conInstance.connection.host}`
    );
    // connection.host: while working on production or development, lets us know which host I'm connected to
  } catch (error) {
    console.error(
      "\x1b[31m%s\x1b[0m",
      " FAILURE :: MongoDB failed to connect:",
      error
    );
    process.exit(1); // forcefully end the execution of a Node.js application.
  }
};

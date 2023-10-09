import { connect } from "mongoose";

const connectDB = async () => {
  try {
    const connection = await connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(connection.connection.host, "MongoDb is connected");
  } catch (error) {
    console.log(error);
    process.exit();
  }
};

export default connectDB;

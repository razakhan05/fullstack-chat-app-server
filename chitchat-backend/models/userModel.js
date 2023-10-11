import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";

const userModel = Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    picture: {
      type: String,
      default:
        "https://p4.wallpaperbetter.com/wallpaper/480/919/600/one-piece-whitebeard-1440x900-anime-one-piece-hd-art-wallpaper-preview.jpg",
    },
  },
  { timestamps: true }
);

userModel.pre("save", async function (next) {
  if (!this.isModified) {
    return next();
  }
  try {
    const hashedPassword = await bcrypt.hash(this.password, 10);
    this.password = hashedPassword;
    return next();
  } catch (error) {
    return next(error);
  }
});

userModel.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = model("User", userModel);
export default User;

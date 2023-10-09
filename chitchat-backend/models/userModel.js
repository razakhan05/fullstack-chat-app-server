const mongoose = require("mongoose");

const userModel = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    picture: {
      type: String,
      default:
        "https://p4.wallpaperbetter.com/wallpaper/480/919/600/one-piece-whitebeard-1440x900-anime-one-piece-hd-art-wallpaper-preview.jpg",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userModel);
module.exports = User;

import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import { generateToken } from "../config/generateToken.js";

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, picture } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please enter all feilds");
  }

  const userExist = await User.findOne({ email });
  if (userExist) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
    picture,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      password: user.password,
      picture:
        user.picture ||
        "https://imgs.search.brave.com/gmQlDUTprun1ouvRkyWbKxT2ktGzzyE6iPym8mdGLLE/rs:fit:860:0:0/g:ce/aHR0cHM6Ly93YWxs/cGFwZXJjYXZlLmNv/bS93cC93cDUxMTUz/NTkuanBn",
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Failed to create the user.");
  }
});

export const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && user.matchPassword(password)) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      password: user.password,
      picture:
        user.picture ||
        "https://imgs.search.brave.com/gmQlDUTprun1ouvRkyWbKxT2ktGzzyE6iPym8mdGLLE/rs:fit:860:0:0/g:ce/aHR0cHM6Ly93YWxs/cGFwZXJjYXZlLmNv/bS93cC93cDUxMTUz/NTkuanBn",
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
  user?.save();
});

//get all the search Users
export const getSearchedUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  //all the user except the logged in user
  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  res.send(users);
});

//get all the users
export const getAllUsers = asyncHandler(async (req, res) => {
  res.json(await User.find({}));
});

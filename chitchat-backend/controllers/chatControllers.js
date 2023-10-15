import expressAsyncHandler from "express-async-handler";
import Chat from "../models/chatModel.js";
import User from "../models/userModel.js";

// Create a chat between two users or retrieve an existing chat
export const createUserChat = expressAsyncHandler(async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      console.log("User ID parameter is missing in the request");
      return res.sendStatus(400);
    }

    // Check if a chat between the users already exists
    let existingChat = await Chat.find({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: req.user._id } } },
        { users: { $elemMatch: { $eq: userId } } },
      ],
    })
      .populate("users", "-password")
      .populate("latestMessage");

    existingChat = await User.populate(existingChat, {
      path: "latestMessage.sender",
      select: "name picture email",
    });

    if (existingChat.length > 0) {
      return res.status(200).send(existingChat[0]);
    } else {
      // Create a new chat if one doesn't exist
      const chatData = {
        chatName: "sender", // You may want to set an appropriate chat name
        isGroupChat: false,
        users: [req.user._id, userId],
      };

      const createdChat = await Chat.create(chatData);
      const fullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );

      return res.status(200).json(fullChat);
    }
  } catch (error) {
    console.error("An error occurred:", error.message);
    return res.status(500).send("Server Error");
  }
});

export const getUserChats = expressAsyncHandler(async (req, res) => {
  try {
    Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage.sender")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await User.populate(results, {
          path: "latestMessage.sender",
          select: "name picture email",
        });

        res.status(200).send(results);
      });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

export const createGroupChat = expressAsyncHandler(async (req, res) => {
  if (!req.body.users || !req.body.name)
    return res.status(400).send({ message: "Please fill all the fields" });
  let users = JSON.parse(req.body.users);
  if (users.length < 2)
    return res
      .status(400)
      .send("More than 2 users are required to form a group chat.");
  //logged in user i.e self
  users.push(req.user);

  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(fullGroupChat);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

export const renameGroupChat = expressAsyncHandler(async (req, res) => {
  const { chatId, chatName } = req.body;

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      chatName,
    },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedChat) {
    res.status(400);
    throw new Error("Chat not found.");
  } else {
    res.json(updatedChat);
  }
});

export const addUserToGroupChat = expressAsyncHandler(async (req, res) => {
  const { userId, chatId } = req.body;

  const userAdded = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId },
    },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!userAdded) {
    res.status(400);
    throw new Error("Chat not found.");
  } else {
    res.json(userAdded);
  }
});
export const leaveGroupChat = expressAsyncHandler(async (req, res) => {
  const { userId, chatId } = req.body;

  const removedUser = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!removedUser) {
    res.status(400);
    throw new Error("Chat not found.");
  } else {
    res.json(removedUser);
  }
});

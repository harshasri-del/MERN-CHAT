const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");

const accessChat = asyncHandler(async (req, res) => {
  const { receiverId } = req.body;

  if (!receiverId) {
    console.log("receiverId is not sent");
    return res.status(400).json({ message: "receiverId is required" });
  }

  console.log("receiverId:", receiverId);

  try {
    let isChat = await Chat.find({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: req.user._id } } },
        { users: { $elemMatch: { $eq: receiverId } } },
      ],
    })
      .populate("users", "-password")
      .populate("latestMessage");

    isChat = await User.populate(isChat, {
      path: "latestMessage.sender",
      select: "name profilepic email",
    });

    if (isChat.length > 0) {
      console.log("Chat found:", isChat[0]);
      return res.status(200).json(isChat[0]);
    } else {
      const chatData = {
        chatName: "sender",
        isGroupChat: false,
        users: [req.user._id, receiverId],
      };

      console.log("Creating new chat with data:", chatData);

      const createChat = await Chat.create(chatData);
      const fullChat = await Chat.findOne({ _id: createChat._id }).populate(
        "users",
        "-password"
      );

      console.log("New chat created:", fullChat);
      return res.status(200).json(fullChat);
    }
  } catch (error) {
    console.error("Error accessing or creating chat:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

const fetchChat = asyncHandler(async (req, res) => {
  try {
    await Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await User.populate(results, {
          path: "latestMessage.sender",
          select: "name profilepic email",
        });
        res.status(200).send(results);
      });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const createGroupChat = asyncHandler(async (req, res) => {
  if (!req.body.chatName || !req.body.users) {
    return res.status(400).json({ message: "Please Fill all the Fields" });
  }
  const users = JSON.parse(req.body.users);
  if (users.length < 2) {
    return res
      .status(400)
      .json({ message: "Group should contain at least 2 members" });
  }
  users.push(req.user);

  try {
    const groupChat = await Chat.create({
      chatName: req.body.chatName,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    return res.status(200).json(fullGroupChat);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const renameGroupChat = asyncHandler(async (req, res) => {
  const { chatId, chatName } = req.body;
  console.log(chatName);
  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    { chatName },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedChat) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    return res.json(updatedChat);
  }
});

const addToGroup = asyncHandler(async (req, res) => {
  const { userId, chatId } = req.body;
  const addedUser = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!addedUser) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(addedUser);
  }
});
const removeFromGroup = asyncHandler(async (req, res) => {
  const { userId, chatId } = req.body;
  const removedUser = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!removedUser) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(removedUser);
  }
});

module.exports = {
  accessChat,
  fetchChat,
  createGroupChat,
  renameGroupChat,
  addToGroup,
  removeFromGroup,
};

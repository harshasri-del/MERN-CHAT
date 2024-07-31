const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const generateToken = require("../config/generateToken")


const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, profilepic } = req.body;
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please Enter All Fields");
  }
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User Already exits with this Email");
  }
  const user = await User.create({
    name,
    email,
    password,
    profilepic,
  });
  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
        profilepic: user.profilepic,
      token : generateToken(user._id)
    });
  } else {
    res.status(400);
    throw new Error("Failed to create a User");
  }
});


const authUser = asyncHandler(async (req,res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400)
        throw new Error("Please Enter All Fields")
    }
    const user = await User.findOne({ email })
    if (user && (await user.matchPassword(password))) {
        res.status(200).json({
          _id: user._id,
          name: user.name,
          email: user.email,
          profilepic: user.profilepic,
          token: generateToken(user._id),
        });

    } else {
        res.status(401)
        throw new Error("Invalid Email or Password")
    }
    
})

//  /ap/user?search=John
const getAllUsers = asyncHandler(async (req, res) => {



  const keyword = req.query.search ? {
    $or: [
        { name: { $regex: req.query.search, $options: "i" } },
        { email: { $regex: req.query.search, $options: "i" } },
      ]
  } : {};

  const users = await User.find(keyword).find({_id:{$ne:req.user._id}})
  // const users = await User.find({ ...keyword, _id: { $ne: req.user._id } });
  res.json(users)
})

module.exports = { registerUser, authUser, getAllUsers };

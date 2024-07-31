const express = require('express')
const {
  registerUser,
  authUser,
  getAllUsers,
} = require("../controllers/userController");
const {protect} = require("../middlewares/authMiddleware")

const router = express.Router()

router.post("/",registerUser)
router.post("/login", authUser)
// or
// router.route("/login").post(authUser)

// router.route("/").post(registerUser).get(getAllUsers);
//or
router.get("/", protect,getAllUsers);

module.exports =router
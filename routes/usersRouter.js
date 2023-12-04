const express = require("express");
const router = express.Router();
const User = require("../models/user");

const bcrypt = require("bcryptjs");

router.post("/register", async (req, res) => {
  const user = req.body.user;
  try {
    const newuser = new User({
      name: user.name,
      email: user.email,
      address: user.address,
      taxpayerNumber: user.taxPayerNumber,
      password: bcrypt.hashSync(user.password, 10),
    });
    await newuser.save();
    res.send("User Registered Successfully");
  } catch (error) {
    return res.status(400).json({ error });
  }
});

router.get("/getallusers", async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (error) {
    return res.status(400).json({ error });
  }
});

router.post("/deleteuser", async (req, res) => {
  const userid = req.body.id;
  try {
    await User.deleteOne({ _id: userid });
    res.send("User deleted successfully");
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});

router.post("/edituser", async (req, res) => {
  const { user } = req.body;
  try {
    const result = await User.updateOne(
      { _id: user.id },
      {
        name: user.name,
        email: user.email,
        address: user.address,
        taxpayerNumber: user.taxPayerNumber,
      }
    );
    res.send(result);
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});

module.exports = router;
const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Room = require("../models/room");
const Booking = require("../models/booking");

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

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email });
    if (user) {
      const result = await bcrypt.compare(password, user.password);
      if (result) {
        res.send(user);
      } else {
        return res.status(400).json({ message: "Login failed" });
      }
    } else {
      return res.status(400).json({ message: "Login failed" });
    }
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
    const rooms = await Room.find({ "currentbookings.userId": userid });
    for (let i = 0; i < rooms.length; i++) {
      for (let j = 0; j < rooms[i].currentbookings.length; j++) {
        if (rooms[i].currentbookings[j].userId === userid) {
          rooms[i].currentbookings.splice(j, 1);
        }
      }
      await rooms[i].save();
    }
    await Booking.deleteMany({ userId: userid });
    await User.deleteOne({ _id: userid });
    res.send("User deleted successfully");
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});

router.post("/disableuser", async (req, res) => {
  const userid = req.body.id;
  try {
    const user = await User.findOne({ _id: userid });
    if (user.status === "disabled") {
      user.status = "active";
      await user.save();
      await Booking.updateMany({ userId: userid }, { status: "booked" });
      return res.send("User enabled successfully");
    } else {
      user.status = "disabled";
      await user.save();
      await Booking.updateMany({ userId: userid }, { status: "cancelled" });
      return res.send("User disabled successfully");
    }
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});

router.post("/roleuser", async (req, res) => {
  const userid = req.body.id;
  try {
    const user = await User.findOne({ _id: userid });
    if (user.isAdmin === true) {
      user.isAdmin = false;
      await user.save();
      return res.send("User is now a normal user");
    } else {
      user.isAdmin = true;
      await user.save();
      return res.send("User is now an admin user");
    }
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});

router.post("/getuserbyid", async (req, res) => {
  const userid = req.body.id;
  try {
    const user = await User.findOne({ _id: userid });
    res.send(user);
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

//limpar os currentbookings todos quando se apagam um user e tem reservas associadas
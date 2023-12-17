const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/userModel");

const app = express();
app.use(express.json());
mongoose.set("strictQuery", false);

app.post("/user", async (req, res) => {
  try {
    await User.create(req.body);
    res.status(200).json({ message: "User Created" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.delete("/user", async (req, res) => {
  try {
    await User.deleteOne(req.body);
    res.status(200).json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/user", async (req, res) => {
  try {
    const users = await User.find(req.body);
    res.status(200).json(users);;
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.patch("/user", async (req, res) => {
  try {
    const fields = req.body;
    await User.findOneAndUpdate({ _id: fields._id }, fields);
    res.status(200).json({ message: "User updated" });;
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

mongoose
  .connect(
    "mongodb+srv://internetsoundseasy:Alphamon04@api.0vunngl.mongodb.net/users?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("Database is connected");
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch((err) => {
    console.log("Can not connect to the database" + err);
  });
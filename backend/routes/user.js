//Imports
const express = require("express");
const { User } = require("../db");
const zod = require("zod");
const jwt = require("jsonwebtoken");
const {Account} = require("../db")
const { JWT_SECRET } = "your-jwt-secret";
const { UserMiddleWare } = require("../middleware");
const userRouter = express.Router();

//Routes
userRouter.post("/signup", async (req, res) => {
  const body = req.body;

  const { username, password, firstName, lastName } = body;

  const userSchema = zod.object({
    username: zod.string().min(3).max(30),
    password: zod.string().min(6),
    firstName: zod.string().min(3).max(50),
    lastName: zod.string().min(3).max(50),
  });

  const { success } = userSchema.safeParse(req.body);
  if (!success) {
    return res.status(411).json({
      message: "Incorrect inputs",
    });
  }
  const existingUser = await User.find({
    username: req.body.username,
  });
  console.log(existingUser);

  if (existingUser.length > 0) {
    return res.status(411).json({
      message: "Email already taken",
    });
  }

  const user = await User.create({
    username: req.body.username,
    password: req.body.password,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
  });
  const userId = user._id;
  await Account.create({
    userId,
    balance: 1 + Math.random() * 10000,
  });
  const token = jwt.sign({ username }, JWT_SECRET);
  res.json({
    message: "Signup successful",
    token,
  });
});

userRouter.post("/signin", async (req, res) => {
  const body = req.body;
  const { username, password } = body;

  const user = await User.findOne({ username });
  console.log(user);

  if (!user) {
    return res.status(401).json({
      message: "User not found",
    });
  }

  if (user.password !== password) {
    return res.status(401).json({
      message: "Incorrect password",
    });
  }

  const token = jwt.sign({ username }, JWT_SECRET);
  res.json({
    message: "Signin successful",
    token,
  });
});

userRouter.put("/", UserMiddleWare, async (req, res) => {
  const updateBody = zod.object({
    password: zod.string().optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional(),
  });
  const { success } = updateBody.safeParse(req.body);
  if (!success) {
    res.status(411).json({
      message: "Error while updating information",
    });
  }

  await User.updateOne({ username: req.username }, req.body);

  res.json({
    message: "Updated successfully",
  });
});

userRouter.get("/bulk", async (req, res) => {
  //very very important end-point
  const filter = req.query.filter || "";

  const users = await User.find({
    $or: [
      {
        firstName: {
          $regex: filter,
        },
      },
      {
        lastName: {
          $regex: filter,
        },
      },
    ],
  });

  res.json({
    user: users.map((user) => ({
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      _id: user._id,
    })),
  });
});
//Exports
module.exports = { userRouter };

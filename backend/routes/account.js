const express = require("express");
const { UserMiddleWare } = require("../middleware");
const { User, Account } = require("../db");

const accountRouter = express.Router();

accountRouter.get("/balance", UserMiddleWare, async (req, res) => {
  const username = req.username;
  const user = User.findOne({ username });
  const account = await Account.findOne({ userId: user._id });

  res.json({
    balance: account.balance,
  });
});

accountRouter.post("/transfer", UserMiddleWare, async (req, res) => {
  const { amount, to } = req.body;
  const session = await mongoose.startSession();
  session.startTransaction();

  const username = req.username;
  const fromAccount = await User.findOne({ username }).session(session);

  if (!fromAccount || fromAccount.balance < amount) {
    await session.abortTransaction();
    return res.status(401).json({
      message: "Insufficient balance",
    });
  }

  const toAccount = await User.findOne({ username: to }).session(session);
  if (!toAccount) {
    await session.abortTransaction();
    return res.status(401).json({
      message: "User not found",
    });
  }

  await Account.updateOne({ userId: fromAccount._id }, { $inc: { balance: -amount } }).session(session);

  await Account.updateOne({ userId: toAccount._id }, { $inc: { balance: amount } }).session(session);

  await session.commitTransaction();
  res.json({
    message: "Transfer successful",
  });
});
module.exports = {
  accountRouter,
};

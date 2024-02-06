const Transfer = require("../models/transfer");
const { getUser } = require("./users");
const Transaction = require("../models/transaction");
const User = require("../models/user");
const getUserTransfers = async (req, res, next) => {
  const user = await getUser(req);

  const transfers = await Transfer.find({
    $or: [{ to_user_id: user.id }, { from_user_id: user.id }],
  }).sort({ createdAt: -1 });
  res.json(transfers);
};
const createTransfer = async (req, res, next) => {
  const user = await getUser(req);
  try {
    const to = await User.findById(req.body.to);
    const amount = req.body.amount;
    const from = user;
    const newTransfer = new Transfer({
      to_user_id: to._id,
      from_user_id: from._id,
      amount: amount,
      status: "completed",
    });
    await newTransfer.save();
    await addBalance(req, to, amount, newTransfer);
    await removeBalance(req, from, amount, newTransfer);
    res.json(newTransfer);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};
const addBalance = async (req, user, amount, transfer) => {
  const auth_user = await getUser(req);
  user.account_balance = parseFloat(user.account_balance) + parseFloat(amount);
  await user.save();
  await recordTransaction(req, user, "money-in", transfer, "positive");
};
const removeBalance = async (req, user, amount, transfer) => {
  const auth_user = await getUser(req);
  user.account_balance = parseFloat(user.account_balance) - parseFloat(amount);
  await user.save();
  await recordTransaction(req, user, "money-out", transfer, "negative");
};
const recordTransaction = async (req, user, txn_type, transfer, effect) => {
  const auth_user = await getUser(req);
  const newTransaction = new Transaction({
    user_id: user._id,
    txn_type: txn_type,
    effect: effect,
    data_id: transfer._id,
    data_model: "transfer",
  });
  await newTransaction.save();
};
module.exports = {
  getUserTransfers,
  createTransfer,
};

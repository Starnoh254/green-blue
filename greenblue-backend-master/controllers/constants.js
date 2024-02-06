var Constant = require("../models/constant");
const { getUser } = require("./users");

const depositWithdrawalRate = async (req, res, next) => {
  const newConstant = new Constant({
    identifier: "trade_rate",
    deposit_percentage_rate_margin: 5,
    withdrawal_percentage_rate_margin: 5,
  });
  await newConstant.save();
};
const getTradeRate = async (req, res, next) => {
  const user = getUser(req);
  const tradeRate = await Constant.findOne({ identifier: "trade_rate" });
  res.json(tradeRate);
};
module.exports = {
  depositWithdrawalRate,
  getTradeRate,
};

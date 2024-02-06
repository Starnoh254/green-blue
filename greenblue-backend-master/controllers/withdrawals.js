var Withdrawal = require("../models/withdrawal");
var Transaction = require("../models/transaction");
var User = require("../models/user");
const { getUser } = require("./users");
const axios = require("axios");
let unirest = require("unirest");

const getUserWithdrawals = async (req, res, next) => {
  const user = await getUser(req);
  // console.log(user);
  try {
    const withdrawals = await Withdrawal.find({ user_id: user._id }).sort({
      _id: -1,
    });
    res.json(withdrawals);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
const generateCredentials = async () => {
  const consumer_key = "WUDd4EfaXcmphNhEVDa9xycmsXX6ZAo7";
  const consumer_secret = "cz07bmyJgpmTiV7z";
  const credentials = Buffer.from(
    `${consumer_key}:${consumer_secret}`
  ).toString("base64");
  // console.log(credentials);
  var token = null;
  await unirest
    .get(
      "https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
    )
    .headers({
      Authorization: `Basic ${credentials}`,
    })
    .then(async (res) => {
      const response = JSON.parse(res.raw_body);
      token = response.access_token;
    });
  return token;
};
const mpesaWithdrawal = async (req, res, withdrawal) => {
  const user = await getUser(req);
  const token = await generateCredentials();
  console.log(token);
  let auth = `Bearer ${token}`;
  let InitiatorName = "gbfabtc";
  let url = "https://api.safaricom.co.ke/mpesa/b2c/v1/paymentrequest";
  let bs_short_code = 3037567;
  let SecurityCredential =
    "lqjw6IhFDbQz8UMWC02ZDY0lGX0aur8wqFpbIpmsSTXHUoqlGH6om6B6pX3RK+1ysIFp+ZKrKVzUg1q2Gkp6oPNocFyZQtiNjsRwOZ6o9jdWEnEuNGngqO/9BcuuMTrz4/fgco+pPBe5iwVroSfzPCDIJ1Y9WDGS6XKtFwGN40DWI7kVCoDqzinL58O5HTlRj1UW7qVPxG218HfpT3iGsVK6apj2W6iPJLwrM4a4uMcAwrJqBHKwfP682mMFG+5dVMVNytx/IHOoCKrZOE6z2vn3oI9dmBNo/WUvjSOKqOYOT7iq4YFQPUngD6bY//1mlvXfBSvSGx+zqHLNuES8ig==";
  let authtoken = "mnbvcxzasdfghjkl12OIHH09SHmsjU0";
  let amount = parseInt(req.body.amt_in_local_currency);
  let partyB = user.phone;
  let partyA = bs_short_code;
  try {
    let { data } = await axios
      .post(
        url,
        {
          InitiatorName: InitiatorName,
          SecurityCredential: SecurityCredential,
          CommandID: "PromotionPayment",
          Amount: amount,
          PartyA: partyA,
          PartyB: partyB,
          Remarks: "Withdrawal settlement",
          QueueTimeOutURL: "https://shark-app-qlulm.ondigitalocean.app/timeout",
          ResultURL: `https://shark-app-qlulm.ondigitalocean.app/api/v1/mpesa/b2c/callback?id=${withdrawal._id}&token=${authtoken}`,
          Occasion: "",
        },
        {
          headers: {
            Authorization: auth,
          },
        }
      )
      .catch((err) => console.log(err));
    console.log(data);
    res.json({
      success: true,
      message: data,
    });
  } catch (err) {
    console.log(err);
    res.json({
      success: false,
      message: err,
    });
  }
};
const mpesaWithdrawalUSSD = async (req, withdrawal) => {
  const user = await User.findById(req.body.user_id);
  const token = await generateCredentials();
  // console.log(token);
  let auth = `Bearer ${token}`;
  let InitiatorName = "gbfabtc";
  let url = "https://api.safaricom.co.ke/mpesa/b2c/v1/paymentrequest";
  let bs_short_code = 3037567;
  let SecurityCredential =
    "lqjw6IhFDbQz8UMWC02ZDY0lGX0aur8wqFpbIpmsSTXHUoqlGH6om6B6pX3RK+1ysIFp+ZKrKVzUg1q2Gkp6oPNocFyZQtiNjsRwOZ6o9jdWEnEuNGngqO/9BcuuMTrz4/fgco+pPBe5iwVroSfzPCDIJ1Y9WDGS6XKtFwGN40DWI7kVCoDqzinL58O5HTlRj1UW7qVPxG218HfpT3iGsVK6apj2W6iPJLwrM4a4uMcAwrJqBHKwfP682mMFG+5dVMVNytx/IHOoCKrZOE6z2vn3oI9dmBNo/WUvjSOKqOYOT7iq4YFQPUngD6bY//1mlvXfBSvSGx+zqHLNuES8ig==";
  let authtoken = "mnbvcxzasdfghjkl12OIHH09SHmsjU0";
  let amount = parseInt(req.body.amt_in_local_currency);
  let partyB = user.phone;
  let partyA = bs_short_code;
  try {
    let { data } = await axios
      .post(
        url,
        {
          InitiatorName: InitiatorName,
          SecurityCredential: SecurityCredential,
          CommandID: "PromotionPayment",
          Amount: amount,
          PartyA: partyA,
          PartyB: partyB,
          Remarks: "Withdrawal settlement",
          QueueTimeOutURL: "https://shark-app-qlulm.ondigitalocean.app/timeout",
          ResultURL: ` https://shark-app-qlulm.ondigitalocean.app/api/v1/mpesa/b2c/callback?id=${withdrawal._id}&token=${authtoken}`,
          Occasion: "",
        },
        {
          headers: {
            Authorization: auth,
          },
        }
      )
      .catch((err) => console.log(err));
    // console.log(data);
    return {
      success: true,
      message: data,
    };
  } catch (err) {
    return {
      success: false,
      message: err,
    };
  }
};

const withdrawalStats = async (req, res, next) => {
  try {
    const user = await getUser(req);
    const statuses = await Withdrawal.aggregate([
      { $match: { user_id: user.id } },
      { $group: { _id: "$status", sum: { $sum: "$usd_amount" } } },
    ]);

    const completed = await statuses.find(
      (status) => status._id == "completed"
    );
    const processing = await statuses.find(
      (status) => status._id == "processing"
    );
    console.log(completed);
    console.log(processing);
    const stats = {
      completed: completed == undefined ? 0 : completed.sum,
      processing: processing == undefined ? 0 : processing.sum,
      account_balance: user.account_balance,
    };

    res.json(stats);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
const newWithdrawal = async (req, res, next) => {
  const user = await getUser(req);
  //DEDUCT FROM USER
  try {
    if (req.body.usd_amount > user.account_balance) {
      res
        .status(400)
        .json({ error: "Insufficient balance to perform the transaction" });
    } else {
      user.account_balance = user.account_balance - req.body.usd_amount;
      user.save();
      const withdrawal = new Withdrawal({
        user_id: user._id,
        usd_amount: req.body.usd_amount,
        local_currency: req.body.local_currency,
        amt_in_local_currency: req.body.amt_in_local_currency,
        payout_method: req.body.payout_method,
        usd_to_local_currency_conversion_rate: {
          usd_rate: req.body.usd_rate,
          margin: req.body.margin,
          usd_rate_on_margin: req.body.usd_rate_on_margin,
        },
        status: req.body.status,
        status_obj: {
          status: req.body.status,
          is_completed: req.body.is_completed,
          desc: req.body.desc,
        },
      });
      await withdrawal.save();
      const newTransaction = new Transaction({
        user_id: user._id,
        txn_type: "money-out",
        effect: "negative",
        data_id: withdrawal._id,
        data_model: "withdrawal",
      });
      await newTransaction.save();
      await mpesaWithdrawal(req, res, withdrawal);
    }
  } catch (error) {
    console.log(error);
  }
};
module.exports = {
  getUserWithdrawals,
  newWithdrawal,
  withdrawalStats,
  mpesaWithdrawalUSSD,
};

var Deposit = require("../models/deposit");
const { generateCredentials, getTimeStamp } = require("./payments");
const { getUser } = require("./users");
var User = require("../models/user.js");

const axios = require("axios");
const createDeposit = async (req, res, next) => {
  const user = await getUser(req);
  const amount = req.body.amount;
  console.log(amount);
  try {
    const newDeposit = new Deposit({
      user_id: user.id,
      method: req.body.method,
      txn_id: null,
      gateway_id: req.body.method_id,
      amount: amount,
      status: "pending",
      ref_code: req.body.ref_code,
      amount_in_local_curency: req.body.amount2,
      currency: req.body.currency,
      is_completed: false,
    });
    await newDeposit.save();
    res.json(newDeposit);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
const mpesaDepositCallback = async (req, res, next) => {
  const status = req.body.Body.stkCallback.ResultCode;
  console.log(req.body.Body);
  const deposit = await Deposit.findById(req.query.deposit_id);

  try {
    const io = req.app.get("socketio"); //Here you use the exported socketio module
    if (status == 0) {
      try {
        //ADD BALANCE TO ACCOUNT
        const user = await User.findById(deposit.user_id);
        user.account_balance =
          Number(user.account_balance) + Number(deposit.amount);
        await user.save();
        //UPDATE DEPOSIT TO COMPLETED
        deposit.is_completed = true;
        deposit.status = "completed";
        deposit.txn_id =
          req.body.Body.stkCallback.CallbackMetadata.Item[1].Value;
        await deposit.save();
      } catch (error) {
        console.log(error);
      }
      io.emit("mpesa-response", req.body.Body.stkCallback);
    } else {
      deposit.is_completed = true;
      deposit.status = "failed";
      deposit.txn_id = "NO TXN ID";
      await deposit.save();
      io.emit("mpesa-response", req.body.Body.stkCallback);
    }
    res.json(req.body.Body.stkCallback);
  } catch (error) {
    console.log(error);
    res.json(error);
  }
};

const stkDepositPush = async (req, res, next) => {
  try {
    let token = await generateCredentials();
    // console.log(token);
    let auth = `Bearer ${token}`;
    const timestamp = await getTimeStamp();
    let url = "https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest";
    let bs_short_code = 4043951;
    let passkey =
      "e2af4f76065ff2de05191a0ee7e7f82e552ce8b1ab1a3858ee8523ac7e9bf0e1";
    let password = new Buffer.from(
      `${bs_short_code}${passkey}${timestamp}`
    ).toString("base64");
    let transcation_type = "CustomerPayBillOnline";
    let amount = parseInt(req.body.amount);
    let partyA = req.body.phone;
    let partyB = bs_short_code;
    let phoneNumber = req.body.phone;
    let callBackUrl = `https://greenblue.herokuapp.com/api/v1/mpesa/deposit/callback?deposit_id=${req.body.deposit_id}`;
    let accountReference = req.body.code;
    let transaction_desc = "deposit subsciption";
    let { data } = await axios
      .post(
        url,
        {
          BusinessShortCode: bs_short_code,
          Password: password,
          Timestamp: timestamp,
          TransactionType: transcation_type,
          Amount: amount,
          PartyA: partyA,
          PartyB: partyB,
          PhoneNumber: phoneNumber,
          CallBackURL: callBackUrl,
          AccountReference: accountReference,
          TransactionDesc: transaction_desc,
        },
        {
          headers: {
            Authorization: auth,
          },
        }
      )
      .catch(console.log);
    // console.log(data);
    res.json({
      success: true,
      message: data,
    });
  } catch (err) {
    res.json({
      success: false,
      message: err["response"]["statusText"],
    });
  }
};
module.exports = { createDeposit, stkDepositPush, mpesaDepositCallback };

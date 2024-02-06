var Payment = require("../models/payment");
var User = require("../models/user.js");
const { getUser } = require("./users");
var Package = require("../models/package");
var Withdrawal = require("../models/withdrawal");
let unirest = require("unirest");
const axios = require("axios");
var Report = require("../models/report");
var ReportLog = require("../models/report_log");
const { purchasePackageOnMpesa } = require("./packages");
const { createDistribution } = require("./distribution");
const countryToCurrency = require("country-to-currency");
var Currency = require("../models/currency");
// // payment test with relationship
// const createPayment = async (req, res, next) => {
//   const user = await getUser(req);
//   //PAY + REGISTRATION IF STARTER
//   const starter_id = "6433d30ecbbc0b37bbe3c878";
//   // const package = await Package.findById(req.body.package_id);
//   const registration_fee = 5;
//   // const amount =
//   //   req.body.package_id == starter_id
//   //     ? package.amount + registration_fee
//   //     : package.amount;
//   try {
//     const newPayment = new Payment({
//       package_id: "packagetest_id@123",
//       user_id: user._id,
//       method: "Mpesa",
//       txn_id: null,
//       gateway_id: "gateway_test_id@123",
//       amount: 1,
//       status: "pending",
//       ref_code: "ref_codetest@123",
//       amount_in_local_curency: 130,
//       currency: "USD",
//       is_completed: false,
//     });
//     await newPayment.save();
//     await User.findByIdAndUpdate(
//       { _id: user._id },
//       {
//         $push: {
//           payments: newPayment._id,
//         },
//       },
//       {
//         new: true,
//       }
//     );
//     res.json(newPayment);
//   } catch (error) {
//     console.log(error);
//     res.status(400).json(error);
//   }
// };

// crreate payment
const createPayment = async (req, res, next) => {
  const user = await getUser(req);
  //PAY + REGISTRATION IF STARTER
  const starter_id = "64959ffb54b8921e7ed6533a";
  const package = await Package.findById(req.body.package_id);
  const registration_fee = 5;
  const amount =
    req.body.package_id == starter_id
      ? package.amount + registration_fee
      : package.amount;
  try {
    const newPayment = new Payment({
      package_id: req.body.package_id,
      user_id: user._id,
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
    await newPayment.save();
    res.json(newPayment);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};
const flutterCallback = async (req, res, next) => {
  const user = await getUser(req);
  const status = parseInt(req.body.status_code);
  try {
    if (status == 0) {
      try {
        await purchasePackageOnMpesa(req.query.payment_id);
        res.json({ message: "success" });
      } catch (error) {
        console.log(error);
      }
    } else {
      res.json({ message: "eror" });
    }
  } catch (error) {
    console.log(error);
    res.json(error);
  }
};
const mpesaCallback = async (req, res, next) => {
  const status = req.body.Body.stkCallback.ResultCode;
  try {
    const io = req.app.get("socketio"); //Here you use the exported socketio module
    if (status == 0) {
      try {
        await purchasePackageOnMpesa(req.query.payment_id);
        const payment = await Payment.findById(req.query.payment_id);
        const amount_kes = payment.amount_in_local_curency;
        const amount_usd = payment.amount;

        const data = {
          user_id: "6431469a9ca677e4def59a52",
          category: "trees",
          rate: rate_data.rate_usd,
          amount_in_local_curency: amount_kes * 0.6,
          amount: amount_usd * 0.4,
          status: "withdraw",
          is_completed: false,
        };
        await createDistribution(data);
        const data1 = {
          user_id: "6431469a9ca677e4def59a52",
          category: "commission",
          rate: rate_data.rate_usd,
          amount_in_local_curency: amount_kes * 0.4,
          amount: amount_usd * 0.4,
          status: "pending",
          is_completed: false,
        };
        await createDistribution(data1);
      } catch (error) {
        console.log(error);
      }
      io.emit("mpesa-response", req.body.Body.stkCallback);
    } else {
      io.emit("mpesa-response", req.body.Body.stkCallback);
    }
    res.json(req.body.Body.stkCallback);
  } catch (error) {
    console.log(error);
    res.json(error);
  }
};
const mpesaRegCallback = async (req, res, next) => {
  const status = req.body.Body.stkCallback.ResultCode;
  try {
    const io = req.app.get("socketio"); //Here you use the exported socketio module
    if (status == 0) {
      try {
        //UPDATE USER STATUS
        const user = await User.findById(req.query.user_id);
        const currency = countryToCurrency[user.country.code];
        const latest = await Currency.find({}).sort({ _id: -1 }).limit(1);
        const rate_data = {
          currency_symbol: currency,
          rate_usd: latest[0].rates[currency],
        };
        user.registration_fee_is_paid = true;
        await user.save();
        //DISTIBUTE 40% | 60%
        const reports = await Report.find({});
        if (reports.length == 0) {
          const newReport = new Report({
            placid_bal: 2,
            gbfa_admin: 3,
            total: 5,
          });
          await newReport.save();
          //CREATE LOG
          const log_1 = new ReportLog({
            user_id: "6431469a9ca677e4def59a52",
            account_id: "placid",
            amount: 2,
            total: newReport.placid_bal,
            txn_type: "deposit",
            account_effect: "positive",
          });
          await log_1.save();
          //CREATE 1ST DISTIBUTION
          const data = {
            user_id: "6431469a9ca677e4def59a52",
            category: "placid",
            rate: rate_data.rate_usd,
            amount_in_local_curency: Number(rate_data.rate_usd) * 2,
            amount: 2,
            status: "pending",
            is_completed: false,
          };
          await createDistribution(data);
          const log_2 = new ReportLog({
            user_id: "6431469a9ca677e4def59a52",
            account_id: "gbfa",
            amount: 3,
            total: newReport.gbfa_admin,
            txn_type: "deposit",
            account_effect: "positive",
          });
          await log_2.save();
          //CREATE 2ND DISTRIBUTION
          const data1 = {
            user_id: "6431469a9ca677e4def59a52",
            category: "gbfa",
            rate: rate_data.rate_usd,
            amount_in_local_curency: Number(rate_data.rate_usd) * 3,
            amount: 3,
            status: "pending",
            is_completed: false,
          };
          await createDistribution(data1);
          res.json(req.body.Body);
        } else {
          const report = await Report.findById(reports[0].id);
          report.placid_bal = report.placid_bal + 2;
          report.gbfa_admin = report.gbfa_admin + 3;
          report.total = report.total + 5;
          await report.save();
          const newReport = report;
          const log_1 = new ReportLog({
            user_id: "6431469a9ca677e4def59a52",
            account_id: "placid",
            amount: 2,
            total: report.placid_bal,
            txn_type: "deposit",
            account_effect: "positive",
          });
          await log_1.save();
          const data = {
            user_id: "6431469a9ca677e4def59a52",
            category: "placid",
            rate: rate_data.rate_usd,
            amount_in_local_curency: Number(rate_data.rate_usd) * 2,
            amount: 2,
            status: "pending",
            is_completed: false,
          };
          await createDistribution(data);
          const log_2 = new ReportLog({
            user_id: "6431469a9ca677e4def59a52",
            account_id: "gbfa",
            amount: 3,
            total: report.gbfa_admin,
            txn_type: "deposit",
            account_effect: "positive",
          });
          await log_2.save();
          const data1 = {
            user_id: "6431469a9ca677e4def59a52",
            category: "gbfa",
            rate: rate_data.rate_usd,
            amount_in_local_curency: Number(rate_data.rate_usd) * 3,
            amount: 3,
            status: "pending",
            is_completed: false,
          };
          await createDistribution(data1);
          res.json(req.body.Body);
        }
      } catch (error) {
        console.log(error);
      }
      io.emit("mpesa-reg", req.body.Body.stkCallback);
    } else {
      io.emit("mpesa-reg", req.body.Body.stkCallback);
    }
    res.json(req.body.Body.stkCallback);
  } catch (error) {
    console.log(error);
    res.json(error);
  }
};
const withdawCallback = async (req, res) => {
  const io = req.app.get("socketio");
  try {
    const withdrawal = await Withdrawal.findOne({ _id: req.query.id });
    const status = await req.body.Result.ResultCode;
    if (parseInt(status) == 0) {
      withdrawal.status == "completed";
      withdrawal.txn_id == req.body.Result.TransactionID;
      await withdrawal.save();
      io.emit("withdrawal-response", req.body);
      res.json(req.body);
    } else {
      io.emit("withdrawal-response", req.body);
      res.json(req.body);
    }
  } catch (error) {
    console.log(error);
    res.json(error);
  }
};

const getUserPayments = async (req, res, next) => {
  const user = await getUser(req);
  const payments = await Payment.find({ user_id: user._id });
  console.log(payments);
  res.json(payments);
};
const generateCredentials = async () => {
  const consumer_key = "BpGpoeghGE90bDGyJmQUw1PBNtW572kC";
  const consumer_secret = "TUEV5USy6nX5jY3l";
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

const getTimeStamp = async () => {
  const dateObject = new Date();
  const year = dateObject.getFullYear();
  const month = dateObject.getMonth();
  const date = dateObject.getDate();
  const hour = dateObject.getHours();
  const minute = dateObject.getMinutes();
  const seconds = dateObject.getSeconds();
  const fmt_month = month >= 10 ? month : "0" + month;
  const fmt_date = date >= 10 ? date : "0" + date;
  const fmt_hour = hour >= 10 ? hour : "0" + hour;
  const fmt_min = minute >= 10 ? minute : "0" + minute;
  const fmt_sec = seconds >= 10 ? seconds : "0" + seconds;
  let timestamp = `${year}${fmt_month}${fmt_date}${fmt_hour}${fmt_min}${fmt_sec}`;
  return timestamp;
};
const stkPush = async (req, res, next) => {
  console.log(req.body);
  let token = await generateCredentials();
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
  let callBackUrl = `https://king-prawn-app-c7zrs.ondigitalocean.app/api/v1/mpesa/package/callback?payment_id=${req.body.payment_id}`;
  let accountReference = req.body.code;
  let transaction_desc = "package subsciption";
  try {
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
const stkPushUSSD1 = async (req) => {
  console.log(req);
  let token = await generateCredentials();
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
  let callBackUrl = `https://king-prawn-app-c7zrs.ondigitalocean.app/api/v1/mpesa/package/callback?payment_id=${req.body.payment_id}`;
  let accountReference = req.body.code;
  let transaction_desc = "package subsciption";
  try {
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
      .catch();
    // console.log(data);
    return {
      success: true,
      message: data,
    };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      message: err["response"]["statusText"],
    };
  }
};
const stkPushUSSD = async (req) => {
  console.log(req.body);
  let token = await generateCredentials();
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
  let callBackUrl = `https://king-prawn-app-c7zrs.ondigitalocean.app/api/v1/mpesa/reg/callback?user_id=${req.body.user_id}`;
  let accountReference = req.body.code;
  let transaction_desc = "user registration";
  try {
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
      .catch((error) => console.log(error));
    console.log(data);
    return {
      success: true,
      message: data,
    };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      message: err["response"]["statusText"],
    };
  }
};
const stkPushReg = async (req, res, next) => {
  console.log(req.body);
  let token = await generateCredentials();
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
  let callBackUrl = `https://king-prawn-app-c7zrs.ondigitalocean.app/api/v1/mpesa/reg/callback?user_id=${req.body.user_id}`;
  let accountReference = req.body.code;
  let transaction_desc = "user registration";
  try {
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

module.exports = {
  createPayment,
  getUserPayments,
  stkPush,
  mpesaCallback,
  generateCredentials,
  withdawCallback,
  getTimeStamp,
  flutterCallback,
  stkPushReg,
  mpesaRegCallback,
  stkPushUSSD,
  stkPushUSSD1,
};

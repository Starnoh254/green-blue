var Distribution = require("../models/distribution");
var Transaction = require("../models/transaction");
const axios = require("axios");
let unirest = require("unirest");
const generateCode = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};
const createDistribution = async (data) => {
  try {
    const code = generateCode(100000, 999999);
    const newDistribution = new Distribution({
      user_id: data.user_id,
      distribution_category: data.category,
      ref_code: code,
      paybill_number: "",
      usd_kes_rate: data.rate,
      amount_in_local_curency: data.amount_in_local_curency,
      amount: data.amount,
      status: data.status,
      is_completed: data.is_completed,
    });
    await newDistribution.save();
    // await mpesaDistribute(newDistribution);
  } catch (error) {
    console.log(error);
  }
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
const mpesaDistribute = async (distribution) => {
  try {
    const token = await generateCredentials();
    console.log(token);
    let auth = `Bearer ${token}`;
    let InitiatorName = "gbfa";
    let url = "https://api.safaricom.co.ke/mpesa/b2b/v1/paymentrequest";
    let bs_short_code = 4043951;
    let SecurityCredential =
      "Y6cT+8USuX3SOAQs3lI7+UnD0Tp4irX6r6EW57pTCVETO9O1tECE04QFvBSIVdjaeSkQu/Uy8XGwTIyGJNsU6io2PGEHW0uJb1yHeBUb6jU+t1Dojgetch7qPCKByAdMy/typx6qx8tYBRraRw54KnLJIQUa20ppr5hkg5zAOqj8eYLV19cutE/uaD3asXZfyeL9xl1340vwjc6qo1SZ/bIy1I1jbipY4NEWve9fjarjLYu89sJi9Jabq8GtJMXl2jfQjRLPlredsB6StKhBdhgA42FdOj5jy6qX0pu9Ls31G0p9dfV0NPsyi1iin6G/a8BA/LY8smu9viQA2jqLZQ==";
    let authtoken = "mnbvcxzasdfghjkl12OIHH09SHmsjU0";
    let amount = parseInt(distribution.amt_in_local_currency);
    let partyB = 600079;
    let partyA = bs_short_code;
    try {
      let { data } = await axios
        .post(
          url,
          {
            Initiator: InitiatorName,
            SecurityCredential: SecurityCredential,
            CommandID: "BusinessPayBill",
            SenderIdentifierType: "4",
            RecieverIdentifierType: "4",
            Amount: amount,
            PartyA: partyA,
            PartyB: partyB,
            AccountReference: distribution.ref_code,
            Requester: "254724630070",
            Remarks: "Withdrawal settlement",
            QueueTimeOutURL:
              "https://king-prawn-app-c7zrs.ondigitalocean.app/timeout",
            ResultURL: `https://king-prawn-app-c7zrs.ondigitalocean.app/api/v1/mpesa/distribution/callback?id=${distribution._id}&token=${authtoken}`,
            Occasion: "",
          },
          {
            headers: {
              Authorization: auth,
            },
          }
        )
        .catch(console.log);
      console.log({
        success: true,
        message: data,
      });
    } catch (err) {
      console.log({
        success: false,
        message: err,
      });
    }
  } catch (error) {
    console.log(error);
  }
};
const getDistributions = async (req, res, next) => {
  try {
    const distributions = await Distribution.find({}.sort({ createdAt: -1 }));
    res.json(distributions);
  } catch (error) {
    console.log(error);
    res.status(504).json(error);
  }
};
const testDistribution = async (req, res, next) => {
  const code = generateCode(100000, 999999);
  const distribution = {
    amt_in_local_currency: req.body.amt,
    ref_code: code,
  };
  await mpesaDistribute(distribution);
};
const updateDistribution = async (req, res, next) => {
  try {
    console.log(req.body.Result);
    const distribution = await Distribution.findById(req.query.id);
    const status = req.body.Result.ResultCode;
    const response = req.body.Result;
    console.log(status);
    if (Number(status) == 0) {
      //COMPLETED
      distribution.description = response.ResultDesc;
      distribution.status = "completed";
      distribution.is_completed = true;
      distribution.txn_id = response.TransactionID;
      distribution.save();
      res.json(distribution);
    } else {
      //ERROR
      distribution.description = response.ResultDesc;
      distribution.save();
      res.json(response);
    }
  } catch (error) {
    res.status(504).json(error);
    console.log(error);
  }
};
module.exports = {
  createDistribution,
  updateDistribution,
  getDistributions,
  testDistribution,
};

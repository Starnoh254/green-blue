const User = require("../models/user");
const UserPackage = require("../models/user_package");
const Currency = require("../models/currency");
const Package = require("../models/package");
const { stkPushUSSD, stkPushUSSD1 } = require("./payments");
const { registerUser } = require("./users");
const bcrypt = require("bcryptjs");
const countryToCurrency = require("country-to-currency");
const Payment = require("../models/payment");
var Withdrawal = require("../models/withdrawal");
var Transaction = require("../models/transaction");
const { mpesaWithdrawalUSSD } = require("./withdrawals");
const { sendSms } = require("./sms");

//POST REQUEST
const ussdApplication = async (req, res, next) => {
  let args = {
    phoneNumber: req.query.phoneNumber,
    sessionId: req.query.sessionId,
    serviceCode: req.query.serviceCode,
    text: req.query.text,
  };
  const text = args.text;
  console.log(text);

  try {
    let response = "CON Testing";
    // Print the response onto the page so that our SDK can read it
    res.set("Content-Type: text/plain");
    res.send(response);
    // DONE!!!
  } catch (error) {
    console.log(error);
  }
};
function delay(t, data) {
  return new Promise((resolve) => {
    setTimeout(resolve.bind(null, data), t);
  });
}
const regUser = async (args) => {
  const data = {
    body: {
      country: {
        value: "KE",
        label: "Kenya",
      },
      first_name: args.first_name,
      last_name: args.last_name,
      phone: args.phone,
      password: args.pin,
      strategy: "USSD",
      referrer: args.code,
      email: `${args.phone}.${args.first_name}@greenbluefoundation.org`,
    },
  };
  const user = await registerUser(data, {}, null);
  const req = {
    body: {
      phone: args.phone,
      amount: parseInt(5 * 142),
      code: user.account_number,
      user_id: user.id,
    },
  };
  console.log(req);
  await stkPushUSSD(req);
};
const verifyNo = async (mobile) => {
  const users = await User.find({ phone: mobile });
  const isValid = users.length == 0 ? false : true;
  return isValid;
};
const login = async (phone, password, done) => {
  var status = false;
  try {
    const user = await User.findOne({
      $or: [{ phone: phone }, { email: phone }],
    });
    if (!user) return done(null, false);
    //COMPARE PASSWORD
    await bcrypt.compare(password, user.password, (err, result) => {
      if (err) throw err;
      status = result;
    });
  } catch (err) {
    status = false;
  }
  console.log("Login Status", status);
  return status;
};
const verifyCode = async (code) => {
  const users = await User.find({ account_number: code });
  const isValid = users.length == 0 ? false : true;
  return isValid;
};
const checkPackage = async (user) => {
  const packages = await UserPackage.find({ user_id: user.id });
  return packages;
};
const getCurrentPackage = async (user) => {
  const packages = await UserPackage.find({ user_id: user.id });
  const current = packages[packages.length - 1];
  console.log(current);
  const package = await Package.findById(current.id);
  return package;
};
const getUserRate = async () => {
  try {
    const currency = countryToCurrency["KE"];
    const latest = await Currency.find({}).sort({ _id: -1 }).limit(1);
    // const data = {
    //   currency_symbol: currency,
    //   rate_usd: latest[0].rates[currency],
    // };
    return 142.5;
  } catch (error) {
    console.log(error);
  }
};
const generateCode = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};
const withdraw = async (u, amt) => {
  const user = await User.findById(u.id);
  //WITHDRAW
  try {
    if (amt > user.account_balance) {
      //DO NOTHIN
    } else {
      user.account_balance = user.account_balance - amt;
      user.save();
      const withdrawal = new Withdrawal({
        user_id: user._id,
        usd_amount: amt,
        local_currency: "KES",
        amt_in_local_currency: amt * 136.5,
        payout_method: "M-Pesa",
        usd_to_local_currency_conversion_rate: {
          usd_rate: 140.5,
          margin: 4,
          usd_rate_on_margin: 136.5,
        },
        status: "processing",
        status_obj: {
          status: "processing",
          is_completed: false,
          desc: "withdrawal initialized",
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
      const data = {
        body: {
          amt_in_local_currency: amt * 136.5,
          user_id: user._id,
        },
      };
      await mpesaWithdrawalUSSD(data, withdrawal);
    }
  } catch (error) {
    console.log(error);
  }
};
const ussdApp = async (req, res, next) => {
  try {
    console.log(req.query);
    const { message, mobile_number } = req.query;
    var text = message;
    let response = ``;
    let registrationData = {
      phoneNumber: null,
      code: null,
      first_name: null,
      last_name: null,
      location: null,
      pin: null,
    };
    if (text == "40") {
      console.log(text);
      // This is the first request. Note how we start the response with CON
      const is_registered = await verifyNo(mobile_number);
      if (is_registered) {
        const user = await User.findOne({ phone: mobile_number });
        response = `CON Hello ${user.first_name} Welcome to GBFA
          1. Login
          0. Exit`;
      } else {
        response = `CON Welcome to GBFA
          1. Login
          2. Register Account`;
      }
    } else if (text == "1") {
      response = `CON Enter your pin`;
    } else if (text.startsWith("1*")) {
      const levels = text.split("*");
      levels.shift();
      const pin = levels[0];
      const user = await User.findOne({ phone: mobile_number });
      var states = false;
      const auth_status = await bcrypt.compare(
        pin,
        user.password,
        (err, result) => {
          if (err) throw err;
          states = result;
          console.log("RESULT", states);
          return result;
        }
      );
      await delay(3000);
      if (states == true) {
        //SHOW MENU
        response = `CON Hey ${user.first_name} \n
          1. My Account and Balance
          2. My Package
          3. Withdraw
          4. My Referral Code
          5. My Downlines
          `;
      } else {
        //INVALID PIN TRY AGAIN
        response = `END You have entered an invalid pin`;
      }
      if (text.endsWith(`*1`)) {
        response = `CON Below is your account details
                     Account No: ${user.account_number} 
                     Account Bal is USD. ${user.account_balance}\n
                     00.HOME`;
      } else if (text.endsWith(`*2`)) {
        const packages = await checkPackage(user);
        console.log(packages);
        if (packages.length == 0) {
          response = `CON You are not subscribed to any package yet, select pack \n
                      1. Starter Pack
                      2. Bronze Pack
                      3. Ambassador Pack
                      4. Gold Pack
                      00. HOME`;
        } else {
          const current = await getCurrentPackage(user);
          response = `CON Your current package is ${current.title}
                        1. Upgrade
                        00. HOME`;
        }
      } else if (text.endsWith(`*3`)) {
        //WITHDRAW
        response = `CON Your account balance: ${
          user.account_balance
        } USD equal to KES ${user.account_balance * 136.5}
        Enter amount to Withdraw in USD \n
      
        00. HOME`;
      } else if (text == `1*${pin}*4` || text.endsWith(`*00*4`)) {
        const message = `Your referral code is ${user.account_number}, thank you for being a member of GBFA`;
        await sendSms(user.id, message);
        response = `CON Your Referral code has been sent to your phone. Thanks! \n 00. HOME`;
      } else if (text == `1*${pin}*5`) {
        response = `CON Your downline information has been sent to your phone. Thanks! \n 00. HOME`;
      } else if (text.startsWith(`1*${pin}*3*`)) {
        //COMPLETE WITHDRAWAL
        const levels = text.split("*");
        levels.shift();
        const amount = levels[2];
        console.log(levels);
        if (Number(user.account_balance) >= Number(amount)) {
          await withdraw(user, amount);
          response = `CON Your withdrawal has been received and is being processed \n
                        00. Main Menu`;
        } else {
          //
          response = `END Amount entered is greater than your account balance`;
        }
      } else if (text === `1*${pin}*2*1`) {
        const rateUSD = await getUserRate();
        const rate = rateUSD;
        const amount = 30 * Number(rate);
        console.log(rate);
        const code = await generateCode(100000, 9999999);
        const payment = new Payment({
          package_id: "64959ffb54b8921e7ed6533a",
          user_id: user._id,
          method: "M-Pesa",
          txn_id: null,
          gateway_id: "mpesa",
          amount: 30,
          status: "pending",
          ref_code: code,
          amount_in_local_curency: amount,
          currency: "KES",
          is_completed: false,
        });
        await payment.save();
        const data = {
          body: {
            amount: parseInt(amount),
            phone: mobile_number,
            payment_id: payment._id,
            code: payment.ref_code,
          },
        };
        console.log(data);
        await stkPushUSSD1(data);
        response = `END Please authorize payment of KES. ${amount} for Starter pack `;
      } else if (text.endsWith(`*00`)) {
        text = "40";
      }
    } else if (text.endsWith(`*00`)) {
      text = "40";
    } else if (text == "2") {
      registrationData.phoneNumber = mobile_number;
      response = `CON Enter referral code`;
    } else if (text.startsWith("2*")) {
      const levels = text.split("*");
      levels.shift();
      const code = levels[0];
      const isValid = await verifyCode(code);
      const first_name = levels[1];
      const last_name = levels[2];
      const phone = mobile_number;
      const state = levels[3];
      const pin = levels[4];
      if (!isValid) {
        response = `END Invalid referral code. Please confirm and try again`;
      } else {
        if (first_name == null) {
          registrationData.code = text;
          response = `CON Please enter your First name:`;
        } else if (last_name == null) {
          registrationData.first_name = text;
          response = `CON Please enter your Last name:`;
        } else if (state == null) {
          registrationData.last = text;
          response = `CON Please enter your location:`;
        } else if (pin == null) {
          registrationData.location = text;
          response = `CON Please set your PIN:`;
        } else if (registrationData.pin == null) {
          registrationData.pin = text;

          // Save the registration data or perform necessary processing
          // console.log("Name:", first_name);
          // console.log("Location:", state);
          // console.log("PIN:", pin);
          const data = {
            code,
            first_name,
            last_name,
            phone: mobile_number,
            pin,
          };
          response = `END Your registration request has been received, please complete the request sent on your phone to complete registration with 5 USD`;
          await regUser(data);
        } else {
          response = `END Invalid registration data. Please try again.`;
        }
      }
    } else {
      response = `END Invalid option. Please try again.`;
    }
    res.send(response);
  } catch (error) {
    console.log(error);
  }
};
module.exports = {
  ussdApplication,
  ussdApp,
};

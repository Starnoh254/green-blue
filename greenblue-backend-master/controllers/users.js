var User = require("../models/user");
var Generation = require("../models/generation");
var Commission = require("../models/commission");
var UserPackage = require("../models/user_package");
var Transaction = require("../models/transaction");
var Withdrawal = require("../models/withdrawal");
var Transfer = require("../models/transfer");
const { verifyToken } = require("../utils/token.utils");
const bcrypt = require("bcryptjs");
const commission = require("../models/commission");
const sendinblue = require("../utils/sendinblue");
const generation = require("../models/generation");
const Sponsor = require("../models/sponsor");
require("dotenv").config();

//REGISTER NEW GOOGLE ACCOUNT
function getToken(req) {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    return req.headers.authorization.split(" ")[1];
  }
  return null;
}
const createSponsor = async (req, res, next) => {
  try {
    const newSponsor = new Sponsor({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      phone: req.body.phone,
      email: req.body.email,
      account_number: code,
      amount_to_sponsor: req.body.amount,
      trees_to_sponsor: req.body.trees,
      sponsor_type: req.body.sponsor_type,
      company_name: req.body.company_name,
      country: {
        name: req.body.country.label,
        code: req.body.country.value,
      },
    });
    await newSponsor.save();
    res.json(newSponsor);
  } catch (error) {
    console.log(error);
    res.status(504).json(error);
  }
};
const resetPassword = async (req, res, next) => {
  const api_key = await getToken(req);
  try {
    if (api_key == process.env.APP_API_KEY) {
      //PROCEED TO UPDATE PASSWORD

      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const user = await User.findOne({ phone: req.body.phone });
      user.password = hashedPassword;
      await user.save();
      res.status(201).json({ message: "Password updated successfully" });
    } else {
      res.status(401).json({ message: "Unauthorized request" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
const getUser = async (req, res, next) => {
  try {
    const token = await getToken(req);
    const jwtObj = await verifyToken(token);
    const user = await User.findById(jwtObj.id);
    return user;
  } catch (error) {
    return error;
  }
};
const updateBalance = async (req, res, next) => {
  try {
    const user = await User.findById(req.body.user_id);
    user.account_balance = req.body.balance;
    await user.save();
    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(504).json(error);
  }
};
const sendMailCode = async (req, res, next) => {
  const sender = {
    email: "no_reply@greenblueafrica.net",
    name: "GBFA - Green Blue Foundation Africa",
  };
  const receivers = [
    {
      email: req.body.email,
    },
  ];
  try {
    let sendSmtpEmail = {
      sender,
      to: receivers,
      subject: `GBFA Email verification code ${req.body.code}`,
      textContent: `
        Hello, your GBFA  verification  code is ${req.body.code}
        `,
      htmlContent: `
        <h4>Hello there!</h4>
        <p>Below is your email verification code<p>
        <h1>${req.body.code}</h1>
        <p>If you received this email by mistake, please ingore and delete the email</p>
        <h5>GBFA</h5>
                `,
      params: {
        role: "User",
      },
    };
    await sendinblue(sendSmtpEmail);
    res.json("success");
  } catch (error) {
    console.log(error);
    res.json(error);
  }
};

const getUserTransactions = async (req, res, next) => {
  const user = await getUser(req);
  const transactions = await Transaction.find({ user_id: user._id }).sort({
    createdAt: -1,
  });
  const transfers = await Transfer.aggregate([
    { $match: { user_id: user._id } },
    { $group: { _id: "$commission_type", sum: { $sum: "$amount" } } },
  ]);
  const commissions = await Commission.aggregate([
    { $match: { user_id: user._id } },
    { $group: { _id: "$commission_type", sum: { $sum: "$amount" } } },
  ]);
  const withdrawals = await Withdrawal.aggregate([
    { $match: { user_id: user._id } },
    { $group: { _id: "$status", sum: { $sum: "$usd_amount" } } },
  ]);
  res.json({
    transactions: transactions,
    commissions: commissions,
    withdrawals: withdrawals,
  });
};
const searchUser = async (req, res, next) => {
  const auth_user = await getUser(req);
  const user = await User.find({ account_number: req.query.search });
  res.json(user);
};
const transactionDetails = async (req, res, next) => {
  const user = await getUser(req);
  const transaction = await Transaction.findById(req.query.id);

  const txn =
    transaction.data_model == "commission"
      ? await Commission.findById(transaction.data_id)
      : transaction.data_model == "withdrawal"
      ? await Withdrawal.findById(transaction.data_id)
      : transaction.data_model == "transfer"
      ? await Transfer.findById(transaction.data_id)
      : [];
  res.json(txn);
};
const getTrees = async (req, res, next) => {
  try {
    const user = await getUser(req);
    const generations = await Generation.find({ sponsor_id: user._id });
    var total = 0;
    await Promise.all(
      generations.map(async (generation) => {
        if (generation.generation_level_id <= 5) {
          const user_packages = await UserPackage.aggregate([
            { $match: { user_id: generation.user_id } },
            { $group: { _id: null, sum: { $sum: "$amount" } } },
          ]);
          const summ = user_packages.length == 0 ? 0 : user_packages[0].sum;
          const trees = summ == 0 ? 0 : (summ - 5) / 3;
          total = total + trees;
        }
      })
    );
    res.json({ total: total });
  } catch (error) {
    console.log(error);
    res.status(504).json(error);
  }
};
const userStats = async (req, res, next) => {
  //GREEN BONUIS
  //BLUE BONUS
  //BALANCE
  //TOTAL EARNIS
  //PROFIT CALCULATOR
  //DAIL+Y EARNINGS ANALYSIS
  try {
    const user = await getUser(req);
    const commissions = await Commission.aggregate([
      { $match: { user_id: user._id } },
      { $group: { _id: "$commission_type", sum: { $sum: "$amount" } } },
    ]);
    const green =
      commissions.length == 0
        ? { sum: 0 }
        : (await commissions.find((commission) => commission._id == "green")) ==
          undefined
        ? { sum: 0 }
        : await commissions.find((commission) => commission._id == "green");
    const blue =
      commissions.length == 0
        ? { sum: 0 }
        : (await commissions.find((commission) => commission._id == "blue")) ==
          undefined
        ? { sum: 0 }
        : await commissions.find((commission) => commission._id == "blue");
    const earnings = Number(green.sum) + Number(blue.sum);
    const investments = await UserPackage.aggregate([
      { $match: { user_id: user.id } },
      { $group: { _id: "$user_id", sum: { $sum: "$amount" } } },
    ]);
    const invest_amt =
      investments.length == 0
        ? { sum: 0 }
        : await investments.find((investment) => investment._id == user.id);
    const profit =
      earnings == 0 ? 0 : (Number(earnings) / Number(invest_amt.sum)) * 100;
    const referrals = await User.find({
      "referrer.account_no": user.account_number,
    });
    const active_referrals = await User.find({
      "referrer.account_no": user.account_number,
      "account_status.acc_status": true,
    });
    const inactive_referrals = await User.find({
      "referrer.account_no": user.account_number,
      "account_status.acc_status": false,
    });
    const commission_by_date = await Commission.aggregate([
      { $match: { user_id: user._id } },
      {
        $group: {
          _id: { $dateToString: { format: "%d-%m-%Y", date: "$createdAt" } },
          sum: { $sum: "$amount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    const stats = {
      green_bonus: green.sum,
      blue_bonus: blue.sum,
      earnings: earnings,
      account_balance: user.account_balance,
      profit: profit.toFixed(0),
      referrals: referrals.length,
      active_referrals: active_referrals.length,
      inactive_referrals: referrals.length - active_referrals.length,
      commission_by_date: commission_by_date,
    };

    res.json(stats);
  } catch (error) {
    console.log(error);
    res.status(504).json(error);
  }
};

const getUserDetails = async (req, res, next) => {
  try {
    const user = await User.findById(req.query.id);
    const packages = await UserPackage.find({ user_id: user._id });
    const data = {
      first_name: user.first_name,
      last_name: user.last_name,
      phone: user.phone,
      email: user.email,
      county: user.country,
      account_status: user.account_status,
      account_number: user.account_number,
      packages: packages,
      createdAt: user.createdAt,
    };
    res.json(data);
  } catch (error) {
    console.log(error);
    res.status(504).json(error);
  }
};
const getDownlines = async (child) => {
  const generations = await Generation.find({ sponsor_id: child });
  const lev_1_generations = generations.filter(
    (generation) => generation.generation_level_id == 1
  );
  return lev_1_generations;
};
const getGenerations = async (req, res, next) => {
  try {
    const user = await User.findById(req.query.user_id);
    const generations = await Generation.find({ sponsor_id: user._id });
    const user_levels = generations.map((generation) => {
      return generation.generation_level_id;
    });
    const levels = [...new Set(user_levels)];
    const gens = await Promise.all(
      generations.map(async (generation) => {
        const child = await getDownlines(generation.user_id);
        return {
          user_id: generation.user_id,
          generation_level_id: generation.generation_level_id,
          children: child,
        };
      })
    );
    const tree = [{ user_id: user._id, children: gens }];
    res.json({ levels, tree });
  } catch (error) {
    console.log(error);
    res.status(504).json(error);
  }
};

const setReferrer = async (code, user) => {
  const sponsor = await User.findOne({ account_number: code });
  user.referrer = {
    account_no: code,
    referrer_id: sponsor._id,
  };
  await user.save();
  await setGenerations(user, sponsor);
};
const setSpillover = async (sponsor) => {
  const referrals = await Generation.find({
    sponsor_id: sponsor._id,
    generation_level_id: 1,
  });
  const is_spillover = referrals.length >= 5 ? true : false;
  return is_spillover;
};
const assignSpilloverUpline = async (sponsor) => {
  //LOOP THROUGH GENERATIONS FROM 1ST
  var upline = sponsor._id;
  console.log(upline);
  const generations = await Generation.find({ sponsor_id: sponsor._id });
  for (let i = 0; i < generations.length; i++) {
    console.log(generations[i]);
    const referrals = await Generation.find({
      sponsor_id: generations[i].user_id,
      generation_level_id: 1,
    });
    if (referrals.length < 5) {
      upline = generations[i].user_id;
      console.log(upline);
      break;
    } // transform value and push to result array
  }
  return upline;
};
const setGenerations = async (user, sponsor) => {
  //CREATE 1ST GENERATION
  const is_spillover = await setSpillover(sponsor);
  console.log(is_spillover);
  if (is_spillover == true) {
    //IS SPILLOVER
    //SET THE LAST USER WITH USER AS SPONSOR
    const upline = await assignSpilloverUpline(sponsor);
    console.log(upline);
    const new_sponsor = await User.findById(upline);
    const gen = new Generation({
      user_id: user._id,
      sponsor_id: new_sponsor._id,
      generation_level_id: 1,
      is_spillover: true,
    });
    //GET SPONSOR GENERATIONS

    await gen.save();
    const generations = await Generation.find({ user_id: new_sponsor._id });
    generations.map(async (g) => {
      const generation = new Generation({
        user_id: user._id,
        sponsor_id: g.sponsor_id,
        generation_level_id: g.generation_level_id + 1,
        is_spillover: true,
      });
      await generation.save();
    });
    console.log("SPILLOVER COMPLETE");
  } else {
    //NOT SPILLOVER
    const gen = new Generation({
      user_id: user._id,
      sponsor_id: sponsor._id,
      generation_level_id: 1,
    });
    //GET SPONSOR GENERATIONS
    await gen.save();
    const generations = await Generation.find({ user_id: sponsor._id });
    generations.map(async (g) => {
      const generation = new Generation({
        user_id: user._id,
        sponsor_id: g.sponsor_id,
        generation_level_id: g.generation_level_id + 1,
      });
      await generation.save();
    });
    console.log("NOT SPILLOVER COMPLETE");
  }
};
const registerUser = async (req, res, next) => {
  const code = await generateCode(req.body.country.value);
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      phone: req.body.phone,
      email: req.body.email,
      password: hashedPassword,
      account_number: code,
      account_balance: 0,
      registration_fee_is_paid: false,
      registration_is_complete: {
        status: true,
        stage: "complete",
        strategy: req.body.strategy,
      },
      country: {
        name: req.body.country.label,
        code: req.body.country.value,
      },
      account_status: {
        acc_status: false,
        status_id: "pending",
      },
    });
    await user.save();
    await setReferrer(req.body.referrer, user);
    if (req.body.strategy != "USSD") {
      res.json("Account has been created successfully");
    } else {
      return user;
    }
  } catch (error) {
    console.log(error);
  }
};
const phoneLogin = async (req, done) => {
  try {
    const user = await User.findOne({ phone: req.body.phone });
    return done(null, user);
  } catch (error) {
    console.log(error);
    return done(null, error);
  }
};
const generateCode = async (country) => {
  const code = country;
  const min = 1111111;
  const max = 9999999;
  const rand = min + Math.random() * (max - min);
  const final = `${code}${Number(rand).toFixed(0)}`;
  return final;
};
const updateUser = async (req, res, next) => {
  //UPDATE USER  DETAILS
  //APPLIES TO USERS WHHO USED SOCIA MEADIA
  // console.log(req.body);
  const code = await generateCode(req.body.country.value);

  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = await getUser(req);
    const thisUser = await User.findById(user._id);
    if (thisUser.referrer) {
    } else {
      await setReferrer(req.body.referrer, thisUser);
    }
    thisUser.first_name = req.body.first_name;
    thisUser.last_name = req.body.last_name;
    thisUser.password = hashedPassword;
    thisUser.phone = req.body.phone;
    thisUser.account_number = code;
    thisUser.country = {
      name: req.body.country.label,
      code: req.body.country.value,
    };
    thisUser.registration_is_complete = {
      status: true,
      stage: "complete",
      strategy: thisUser.registration_is_complete.strategy,
    };
    thisUser.account_status = { status: false, status_id: "pending" };
    await thisUser.save();

    res.json("Account has been updated successfully");
  } catch (error) {
    console.log(error);
  }
};
const userProfile = async (req, res, next) => {
  const user = await getUser(req);
  res.json(user);
};
const registrationStage = async (req, res) => {
  const user = await getUser(req);
  res.json(user);
};
const socialRegister = async (strategy, provider, data, cb) => {
  if (strategy == "google") {
    try {
      const user = new User({
        googleProvider: provider,
        first_name: data.given_name,
        last_name: data.family_name,
        email: data.email,
        picture: data.picture,
        registration_is_complete: {
          status: false,
          stage: "phone_verification",
          strategy: "google",
        },
      });
      await user.save();
      return cb(null, user);
    } catch (error) {
      console.log(error);
    }
  } else if (strategy == "facebook") {
    try {
      const user = new User({
        facebookProvider: provider,
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        registration_is_complete: {
          status: false,
          stage: "phone_verification",
          strategy: "facebook",
        },
      });
      await user.save();
      return cb(null, user);
    } catch (error) {
      console.log(error);
    }
  }
};

//ADD A NEW USER LOGIN STARTEDY
const addStrategy = async (strategy, provider, user, cb) => {
  if (strategy == "google") {
    user.googleProvider = provider;
    await user.save();
  } else if (strategy == "facebook") {
    user.facebookProvider = provider;
    await user.save();
  }
  return cb(null, user);
};
//AUTHENTICATE VIA FACEBOOK
const facebookAuth = async (accessToken, refreshToken, profile, cb) => {
  const data = profile._json;
  const facebookProvider = {
    id: profile.id,
    token: accessToken,
  };
  try {
    const user = await User.findOne({ email: data.email });
    if (!user) {
      socialRegister("facebook", facebookProvider, data, cb);
    } else {
      const user1 = await User.findOne({ "facebookProvider.id": profile.id });
      if (!user1) {
        await addStrategy("facebook", facebookProvider, user, cb);
      } else {
        return cb(null, user);
      }
    }
  } catch (error) {
    console.log(error);
  }
};
//AUTHENTICATE VIA GMAIL
const googleAuth = async (accessToken, refreshToken, profile, cb) => {
  const data = profile._json;
  const googleProvider = {
    id: profile.id,
    token: accessToken,
  };
  try {
    const user = await User.findOne({ email: data.email });
    if (!user) {
      socialRegister("google", googleProvider, data, cb);
    } else {
      const user1 = await User.findOne({ "googleProvider.id": profile.id });
      if (!user1) {
        await addStrategy("google", googleProvider, user, cb);
      } else {
        return cb(null, user);
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const login = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json(error, "User Not Authenticated");
  }
  req.auth = {
    id: req.user.id,
  };

  next();
};

const verifyEmail = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      res.json({ available: true });
    } else {
      res.json({ available: false });
    }
  } catch (error) {
    res.status(400).json(error);
  }
};
const verifyPhone = async (req, res, next) => {
  try {
    const user = await User.findOne({ phone: req.body.phone });
    if (!user) {
      res.json({ available: true }); 
    } else {
      res.json({ available: false });
    }
  } catch (error) {
    res.status(400).json(error);
  }
  
};

module.exports = {
  googleAuth,
  facebookAuth,
  login,
  verifyEmail,
  verifyPhone,
  registerUser,
  getUser,
  userProfile,
  registrationStage,
  updateUser,
  phoneLogin,
  getGenerations,
  getUserDetails,
  userStats,
  getUserTransactions,
  transactionDetails,
  searchUser,
  sendMailCode,
  resetPassword,
  setReferrer,
  updateBalance,
  getTrees,
  createSponsor,
};

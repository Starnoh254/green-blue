var Package = require("../models/package");
var UserPackage = require("../models/user_package");
var Payment = require("../models/payment");
var Generation = require("../models/generation");
var User = require("../models/user");
var Commission = require("../models/commission");
var Transaction = require("../models/transaction");
const { getUser } = require("./users");
const verifiyToken = "WpJqiLYQbKwk0JZlZKwYPh+x3gtQfwUQlNjmlTuCjaI=";
const createPackage = async (req, res, next) => {
  const newPackage = new Package({
    title: "Starter Pack",
    amount: 30,
    square_meters: 10,
    description: "10 Square meters worth of tree planting",
    green_bonus_commissions: {
      level_1: 8,
      level_2: 3,
      level_3: 1,
    },
    blue_bonus_commissions: {
      level_1: 2,
      level_2: 2,
      level_3: 2,
      level_4: 2,
      level_5: 2,
    },
  });
  await newPackage.save();
};
const getPackages = async (req, res, next) => {
  const user = await getUser(req);
  const packages = await Package.find({});
  res.json(packages);
};
const getUserPackages = async (req, res, next) => {
  const user = await getUser(req);
  const user_packages = await UserPackage.find({ user_id: user.id });
  const packages = await Package.find({});
  res.json({ user_packages, packages });
};
const newUserPackage = async (req, package, payment) => {
  const user = req;
  const new_UserPackage = new UserPackage({
    user_id: user._id,
    package_id: package._id,
    amount: payment.amount,
  });
  await new_UserPackage.save();
};
const deductBalance = async (req, payment) => {
  const user = req;
  user.account_balance = user.account_balance - payment.amount;
  await user.save();
};
const activateUserAccount = async (req) => {
  const user = req;
  user.account_status = {
    status_id: "completed",
    acc_status: true,
  };
  await user.save();
};
const generateCode = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};
const completePayment = async (req, payment) => {
  const user = req;
  const code = generateCode(100, 999);
  payment.status = "completed";
  payment.is_completed = true;
  payment.txn_id = user.account_number + code;
  await payment.save();
};
const issueGreenBonus = async (req, package) => {
  const user = req;
  const generations = await Generation.find({ user_id: user._id });
  await Promise.all(
    generations.map(async (generation) => {
      const level = generation.generation_level_id;
      const amount =
        level == 1
          ? package.green_bonus_commissions.level_1
          : level == 2
          ? package.green_bonus_commissions.level_2
          : level == 3
          ? package.green_bonus_commissions.level_3
          : 0;
      if (generation.is_spillover) {
        if (level == 1) {
          //ISSUE TU UPLINE
          await distributeGreenBonus(
            req,
            user.referrer.referrer_id,
            amount,
            level,
            package
          );
        }
      } else {
        if (level <= 3) {
          await distributeGreenBonus(
            req,
            generation.sponsor_id,
            amount,
            level,
            package
          );
        }
      }
    })
  );
};
const distributeGreenBonus = async (req, sponsor, amount, level, package) => {
  const user = req;
  const upline = await User.findById(sponsor);
  upline.account_balance = Number(upline.account_balance) + Number(amount);
  await upline.save();
  //CREATE COMISSION TRANSACTION
  const newCommission = new Commission({
    user_id: sponsor,
    desc: `Green Bonus, Level ${level} bonus issued from ${user.first_name}`,
    commission_type: "green",
    commission_level: level,
    from_user: user._id,
    amount: amount,
    package_id: package._id,
  });
  await newCommission.save();
  //CREATE TRANSACTION
  const newTransaction = new Transaction({
    user_id: sponsor,
    txn_type: "money-in",
    effect: "positive",
    data_id: newCommission._id,
    data_model: "commission",
  });
  await newTransaction.save();
};
const issueBlueBonus = async (req, package) => {
  const user = req;
  const generations = await Generation.find({ user_id: user._id });
  await Promise.all(
    generations.map(async (generation) => {
      const level = generation.generation_level_id;
      if (level <= 5) {
        const amount =
          level == 1
            ? package.blue_bonus_commissions.level_1
            : level == 2
            ? package.blue_bonus_commissions.level_2
            : level == 3
            ? package.blue_bonus_commissions.level_3
            : level == 4
            ? package.blue_bonus_commissions.level_4
            : level == 5
            ? package.blue_bonus_commissions.level_5
            : 0;
        if (level <= 5) {
          await distributeBlueBonus(
            req,
            generation.sponsor_id,
            amount,
            level,
            package
          );
        }
      } else {
        return;
      }
    })
  );
};
const distributeBlueBonus = async (req, sponsor, amount, level, package) => {
  const user = req;
  const upline = await User.findById(sponsor);
  upline.account_balance = Number(upline.account_balance) + Number(amount);
  await upline.save();
  //CREATE COMISSION TRANSACTION
  const newCommission = new Commission({
    user_id: sponsor,
    desc: `Blue Bonus, Level ${level} bonus issued from ${user.first_name}`,
    commission_type: "blue",
    commission_level: level,
    from_user: user._id,
    amount: amount,
    package_id: package._id,
  });
  await newCommission.save();
  const newTransaction = new Transaction({
    user_id: sponsor,
    txn_type: "money-in",
    effect: "positive",
    data_id: newCommission._id,
    data_model: "commission",
  });
  await newTransaction.save();
};
const purchasePackageOnMpesa = async (billRef) => {
  //VEFIFY REQUEST
  // console.log(req);
  //continue
  const payment = await Payment.findById(billRef);
  //UPDATE PAYMENT AS PAID
  payment.status = "completed";
  payment.is_completed = true;
  await payment.save();
  const package = await Package.findById(payment.package_id);
  const user = await User.findById(payment.user_id);
  const user_packages = await UserPackage.find({
    user_id: user._id,
    package_id: package._id,
  });
  if (user_packages.length == 0) {
    await activateUserAccount(user);
    await newUserPackage(user, package, payment);
    // await completePayment(user, payment);
    await issueGreenBonus(user, package);
    await issueBlueBonus(user, package);
  } else {
    console.log("Package Already exist");
  }
};
const purchasePackageOnBalance = async (req, res, next) => {
  const user = await getUser(req);
  //1. CHECK ACCOUNT BALANCE IF
  //2. CHECK IF PACKAGE ALREADY EXIST ON USER
  //3. DEDUCT AMOUNT
  //3. CREATE A USER PACKAGE RELATIONSHIP
  //4. ACTIVATE ACCOUNT
  //5. UPDATE PAYMENT STATUS
  //5. ISSUE GREEN BONUS
  //6. ISSUE BLUE BONUS
  try {
    const payment = await Payment.findById(req.body.payment_id);
    const package = await Package.findById(payment.package_id);
    if (user.account_balance >= payment.amount) {
      const user_packages = await UserPackage.find({
        user_id: user._id,
        package_id: package._id,
      });
      if (user_packages.length == 0) {
        await deductBalance(user, payment);
        await activateUserAccount(user);
        await newUserPackage(user, package, payment);
        await completePayment(user, payment);
        await issueGreenBonus(user, package);
        await issueBlueBonus(user, package);
        res.json("Package purchase successfull");
      } else {
        res.status(401).json({
          error: "Package already exist",
        });
      }
    } else {
      res
        .status(401)
        .json({ error: "Inssufficient balance to perform this transaction" });
    }
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: error });
  }
};
module.exports = {
  getPackages,
  purchasePackageOnBalance,
  getUserPackages,
  purchasePackageOnMpesa,
  createPackage,
};

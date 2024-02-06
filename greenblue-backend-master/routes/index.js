var express = require("express");
var router = express.Router();
var { generateToken, sendToken } = require("../utils/token.utils");
const {
  login,
  verifyEmail,
  verifyPhone,
  registerUser,
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
  updateBalance,
  getTrees,
  createSponsor,
} = require("../controllers/users");

var passport = require("passport");
const { getUserRate } = require("../controllers/currencies");
const {
  getUserWithdrawals,
  newWithdrawal,
  withdrawalStats,
} = require("../controllers/withdrawals");
const {
  getPackages,
  getUserPackages,
  purchasePackageOnBalance,
  createPackage,
} = require("../controllers/packages");
const {
  getTradeRate,
  depositWithdrawalRate,
} = require("../controllers/constants");
const {
  createPayment,
  getUserPayments,
  stkPush,
  mpesaCallback,
  withdawCallback,
  flutterCallback,
  stkPushReg,
  mpesaRegCallback,
} = require("../controllers/payments");
const {
  getUserTransfers,
  createTransfer,
} = require("../controllers/transfers");
const {
  getAllUsers,
  adminStats,
  getAllPayments,
  getCommissions,
  getAllCommissions,
  getAllTransactions,
  getAllWithdrawals,
  getAllPackages,
} = require("../controllers/admins");
const {
  createDeposit,
  mpesaDepositCallback,
  stkDepositPush,
} = require("../controllers/deposits");
const { ussdApplication, ussdApp } = require("../controllers/ussd");
const { testSend } = require("../controllers/sms");
const {
  updateDistribution,
  getDistributions,
  testDistribution,
} = require("../controllers/distribution");
require("../passport")();
// router
//   .route("/auth/email")
//   .post(
//     passport.authenticate("email_auth", { session: false }),
//     login,
//     generateToken,
//     sendToken
//   );

router
  .route("/auth/phone")
  .post(
    passport.authenticate("local", { session: false }),
    login,
    generateToken,
    sendToken
  );

router
  .route("/auth/facebook")
  .post(
    passport.authenticate("facebook-token", { session: false }),
    login,
    generateToken,
    sendToken
  );
router
  .route("/auth/google")
  .post(
    passport.authenticate("google-token", { session: false }),
    login,
    generateToken,
    sendToken
  );
// router.route("/ussd").post(ussdApplication);ƒ
router.route("/ussd").get(ussdApp);
router.route("/send/sms").get(testSend);
router.route("/verify/email").post(verifyEmail);
router.route("/verify/phone").post(verifyPhone);
router.route("/auth/register").post(registerUser);
router.route("/auth/update").put(updateUser);
router.route("/auth/register/stage").get(registrationStage);
router.route("/profile").get(userProfile);
router.route("/user_generations").get(getGenerations);
router.route("/user").get(getUserDetails);
router.route("/sponsors").post(createSponsor);
router.route("/user/password/reset").post(resetPassword);
router.route("/user/balance").post(updateBalance);
router.route("/user/stats").get(userStats);
router.route("/user/trees").get(getTrees);
router.route("/currencies").get(getUserRate);
router.route("/currencies/create").post(depositWithdrawalRate);
router.route("/withdrawals").get(getUserWithdrawals);
router.route("/withdraw").post(newWithdrawal);
router.route("/withdrawals/stats").get(withdrawalStats);
router.route("/packages").get(getPackages);
router.route("/packages/new").post(createPackage);
router.route("/user/packages").get(getUserPackages);
router.route("/constants/trade_rates").get(getTradeRate);
router.route("/payments/new").post(createPayment);
router.route("/deposits/new").post(createDeposit);
router.route("/payments").get(getUserPayments);
router.route("/purchase/balance").post(purchasePackageOnBalance);
router.route("/user/transactions").get(getUserTransactions);
router.route("/transaction").get(transactionDetails);
router.route("/user/transfers").get(getUserTransfers);
router.route("/user/new/transfer").post(createTransfer);
router.route("/user/search").get(searchUser);
router.route("/stkPush").post(stkPush);
router.route("/stkPushReg").post(stkPushReg);
router.route("/deposits/stkPush").post(stkDepositPush);
router.route("/mpesa/deposit/callback").post(mpesaDepositCallback);
router.route("/mpesa/package/callback").post(mpesaCallback);
router.route("/mpesa/reg/callback").post(mpesaRegCallback);
router.route("/flutter/package/callback").post(flutterCallback);
router.route("/mpesa/distribution/callback").post(updateDistribution);
router.route("/mpesa/distribution/test").post(testDistribution);
router.route("/mpesa/b2c/callback").post(withdawCallback);
router.route("/email/send/code").post(sendMailCode);
router.route("/admin/all/users").get(getAllUsers);
router.route("/admin/stats").get(adminStats);
router.route("/admin/all/payments").get(getAllPayments);
router.route("/admin/all/commissions").get(getAllCommissions);
router.route("/admin/all/transactions").get(getAllTransactions);
router.route("/admin/all/withdrawals").get(getAllWithdrawals);
router.route("/admin/all/packages").get(getAllPackages);
router.route("/admin/all/distributions").get(getDistributions);

module.exports = router;

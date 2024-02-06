const User = require("../models/user.js");
const Payment = require("../models/payment.js");
const Commission = require("../models/commission.js");
const Transaction = require("../models/transaction.js");
const Withdrawal = require("../models/withdrawal.js");
const Package = require("../models/package.js");
const Report = require("../models/report.js");
const { getUser } = require("./users");
var Distribution = require("../models/distribution.js");
const verifyIsAdmin = async (req) => {
  const user = await getUser(req);
  return user.is_admin;
};
const getAllPackages = async (req, res, next) => {
  const IsAdmin = await verifyIsAdmin(req);
  if (IsAdmin) {
    try {
      const packages = await Package.find({});
      res.status(200).json(packages);
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  } else {
    res.status(401).json("Not Allowed");
  }
};
// get all users
const getAllUsers = async (req, res, next) => {
  const IsAdmin = await verifyIsAdmin(req);
  try {
    if (IsAdmin) {
      const page = req.query.page;
      const limit = req.query.limit;
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
      const users = await User.find({});
      const result = users.slice(startIndex, endIndex);
      const data = {
        total: users.length,
        users: result,
      };
      res.status(200).json(data);
    } else {
      res.status(401).json("Not Allowed");
    }
  } catch (error) {
    res.stats(500).json(error);
  }
};
const adminStats = async (req, res, next) => {
  const IsAdmin = await verifyIsAdmin(req);
  const user = getUser(req);
  try {
    if (IsAdmin) {
      // total active users
      const active_users = await User.find({
        "account_status.status_id": "completed",
      });
      // total inactive users
      const inactive_users = await User.find({
        "account_status.status_id": "pending",
      });
      // green commision stats
      const greenCommissions = await Commission.aggregate([
        { $match: { commission_type: "green" } },
        { $group: { _id: "$commission_type", sum: { $sum: "$amount" } } },
      ]);
      // blue commision stats
      const blueCommissions = await Commission.aggregate([
        { $match: { commission_type: "blue" } },
        { $group: { _id: "$commission_type", sum: { $sum: "$amount" } } },
      ]);
      // mpesa payments stats
      const mpesaPayments = await Payment.aggregate([
        { $match: { gateway_id: "mpesa" } },
        { $group: { _id: "$status", totalAmount: { $sum: "$amount" } } },
      ]);
      // card payments stats
      const cardPayments = await Payment.aggregate([
        { $match: { gateway_id: "card" } },
        { $group: { _id: "$status", totalAmount: { $sum: "$amount" } } },
      ]);
      // account balance payments stats
      const accBalancePayments = await Payment.aggregate([
        { $match: { gateway_id: "balance" } },
        { $group: { _id: "$status", totalAmount: { $sum: "$amount" } } },
      ]);
      // withdrawal stats
      const withdrawals = await Withdrawal.aggregate([
        { $match: { status: "completed" } },
        { $group: { _id: "$status", totalAmount: { $sum: "$usd_amount" } } },
      ]);
      const placid_distributions = await Distribution.aggregate([
        { $match: { distribution_category: "placid" } },
        { $group: { _id: null, amount: { $sum: "$amount" } } },
      ]);
      const gbfa_distributions = await Distribution.aggregate([
        { $match: { distribution_category: "gbfa" } },
        { $group: { _id: null, amount: { $sum: "$amount" } } },
      ]);
      const trees_distributions = await Distribution.aggregate([
        { $match: { distribution_category: "trees" } },
        { $group: { _id: null, amount: { $sum: "$amount" } } },
      ]);
      const commissions_distributions = await Distribution.aggregate([
        { $match: { distribution_category: "commission" } },
        { $group: { _id: null, amount: { $sum: "$amount" } } },
      ]);
      const reports = await Report.find({});
      const stats = {
        report: {
          placid: reports.length == 0 ? 0 : reports[0].placid_bal,
          gbfa: reports.length == 0 ? 0 : reports[0].gbfa_admin,
          total: reports.length == 0 ? 0 : reports[0].total,
        },
        distributions: {
          commissions:
            commissions_distributions.length == 0
              ? 0
              : commissions_distributions[0].amount,
          trees:
            trees_distributions.length == 0 ? 0 : trees_distributions[0].amount,
          gbfa:
            gbfa_distributions.length == 0 ? 0 : gbfa_distributions[0].amount,
          placid:
            placid_distributions.length == 0
              ? 0
              : placid_distributions[0].amount,
        },
        users: {
          active: active_users.length,
          inactive: inactive_users.length,
        },
        commisions: {
          greenCommissions,
          blueCommissions,
        },
        payments: {
          mpesaPayments,
          cardPayments,
          accBalancePayments,
        },
        withdrawals: {
          withdrawals,
        },
      };

      return res.status(200).json(stats);
    } else {
      return res.status(401).json("Not Allowed");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

// get all payments
const getAllPayments = async (req, res) => {
  const IsAdmin = await verifyIsAdmin(req);
  try {
    if (IsAdmin) {
      const page = req.query.page;
      const limit = req.query.limit;
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
      const payments = await Payment.find({})
        .populate("user_id")
        .sort({ createdAt: -1 });
      const result = payments.slice(startIndex, endIndex);
      // mpesa payment statistics
      const paymentsStats = await Payment.aggregate([
        { $group: { _id: "$gateway_id", total: { $sum: "$amount" } } },
      ]);
      const paymentsStatus = await Payment.aggregate([
        { $group: { _id: "$status", total: { $sum: "$amount" } } },
      ]);
      // card payment statistics
      const mpesa = await paymentsStats.find(
        (payment) => payment._id === "mpesa"
      );
      const card = await paymentsStats.find(
        (payment) => payment._id === "card"
      );
      const balance = await paymentsStats.find(
        (payment) => payment._id === "balance"
      );
      const completed = await paymentsStatus.find(
        (payment) => payment._id === "completed"
      );
      const pending = await paymentsStatus.find(
        (payment) => payment._id === "pending"
      );
      const data = {
        total: payments.length,
        payments: result,
        stats: {
          mpesa: mpesa.total,
          card: card.total,
          balance: balance.total,
          completed: completed.total,
          pending: pending.total,
        },
      };
      return res.status(200).json(data);
    } else {
      res.status(500).json({ message: "Not allowed" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

// get all transactions
const getAllCommissions = async (req, res) => {
  const IsAdmin = await verifyIsAdmin(req);
  try {
    if (IsAdmin) {
      const page = req.query.page;
      const limit = req.query.limit;
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
      const commisions = await Commission.find({}).populate("user_id");
      const result = commisions.slice(startIndex, endIndex);
      // green commision stats
      const commissionsStats = await Commission.aggregate([
        { $group: { _id: "$commission_type", sum: { $sum: "$amount" } } },
      ]);
      const blue = await commissionsStats.find(
        (commision) => commision._id === "blue"
      );
      const green = await commissionsStats.find(
        (commision) => commision._id === "green"
      );

      const data = {
        total: commisions.length,
        commisions: result,
        stats: {
          green: green.sum,
          blue: blue.sum,
          comissions: commissionsStats,
        },
      };
      return res.status(200).json(data);
    }
    return res.status(500).json({ message: "Not allowed" });
  } catch (error) {
    res.status(500).json(error);
  }
};

// get all commisions
const getAllTransactions = async (req, res) => {
  const IsAdmin = await verifyIsAdmin(req);
  try {
    if (IsAdmin) {
      const page = req.query.page;
      const limit = req.query.limit;
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
      const transactions = await Transaction.find({}).populate("user_id");
      const result = transactions.slice(startIndex, endIndex);
      return res.status(200).json(result);
    }
    return res.status(500).json({ message: "Not allowed" });
  } catch (error) {
    res.status(500).json(error);
  }
};
// get all withdrawals
const getAllWithdrawals = async (req, res) => {
  const IsAdmin = await verifyIsAdmin(req);
  try {
    if (IsAdmin) {
      const page = req.query.page;
      const limit = req.query.limit;
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
      const withdrawals = await Withdrawal.find({})
        .populate("user_id")
        .sort({ createdAt: -1 });
      const result = withdrawals.slice(startIndex, endIndex);
      // get withdrawal statisticss
      const totalWithdrawals = await Withdrawal.aggregate([
        { $group: { _id: "$status", total: { $sum: "$usd_amount" } } },
      ]);
      const completed = await totalWithdrawals.find(
        (withdrawal) => withdrawal._id == "completed"
      );
      const pending = await totalWithdrawals.find(
        (withdrawal) => withdrawal._id == "processing"
      );
      const data = {
        total: withdrawals.length,
        withdrawals: result,
        stats: {
          completed: 0,
          pending: pending.total,
        },
      };
      return res.status(200).json(data);
    } else {
      return res.status(500).json({ message: "Not allowed" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
module.exports = {
  getAllUsers,
  adminStats,
  getAllPayments,
  getAllCommissions,
  getAllTransactions,
  getAllWithdrawals,
  getAllPackages,
};
// http://localhost:4000/api/v1/admin/all/payments?page=1&limit=20
// http://localhost:4000/api/v1/admin/all/commission?page=1&limit=20
// http://localhost:4000/api/v1/admin/all/transactions?page=1&limit=20
// http://localhost:4000/api/v1/admin/all/withdrawals?page=1&limit=20

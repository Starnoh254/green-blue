var mongoose = require("mongoose");
const report_log = new mongoose.Schema(
  {
    user_id: {
      type: String,
    },
    account_id: {
      type: String,
    },
    amount: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      default: 0,
    },
    txn_type: {
      type: String,
    },
    account_effect: {
      type: String,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("ReportLog", report_log);

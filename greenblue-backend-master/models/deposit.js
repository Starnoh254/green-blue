var mongoose = require("mongoose");
const deposit = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    method: {
      type: String,
    },
    gateway_id: {
      type: String,
    },
    txn_id: {
      type: String,
    },
    ref_code: {
      type: String,
    },
    gateway_id: {
      type: String,
    },
    currency: {
      type: String,
    },
    amount_in_local_curency: {
      type: Number,
    },
    amount: {
      type: Number,
    },
    status: {
      type: String,
    },
    is_completed: {
      type: Boolean,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Deposit", deposit);

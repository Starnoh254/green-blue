var mongoose = require("mongoose");
const withdrawal = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    txn_id: {
      type: String,
    },
    usd_amount: {
      type: Number,
    },
    local_currency: {
      type: String,
    },
    amt_in_local_currency: {
      type: String,
    },
    usd_to_local_currency_conversion_rate: {
      type: {
        usd_rate: Number,
        margin: Number,
        usd_rate_on_margin: Number,
      },
    },
    payout_method: {
      type: String,
    },
    status: {
      type: String,
    },
    status_obj: {
      type: {
        status: String,
        is_completed: Boolean,
        desc: String,
      },
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Withdrawal", withdrawal);

var mongoose = require("mongoose");
const distribution = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    distribution_category: {
      type: String,
    },
    txn_id: {
      type: String,
    },
    ref_code: {
      type: String,
    },
    usd_kes_rate: {
      type: Number,
    },
    amount_in_local_curency: {
      type: Number,
    },
    description: {
      type: String,
    },
    amount: {
      type: Number,
    },
    paybill_number: {
      type: String,
    },
    status: {
      type: String,
    },
    is_completed: {
      type: Boolean,
    },
    description: {
      type: String,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Distribution", distribution);

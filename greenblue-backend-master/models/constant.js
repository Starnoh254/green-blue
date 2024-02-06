var mongoose = require("mongoose");
const constant = new mongoose.Schema(
  {
    identifier: {
      type: String,
    },
    deposit_percentage_rate_margin: {
      type: Number,
    },
    withdrawal_percentage_rate_margin: {
      type: Number,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Constant", constant);

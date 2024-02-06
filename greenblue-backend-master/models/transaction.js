var mongoose = require("mongoose");
const transaction = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    txn_type: {
      type: String,
    },
    effect: {
      type: String,
    },
    data_model: {
      type: String,
    },
    data_id: {
      type: String,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Transaction", transaction);

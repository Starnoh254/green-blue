var mongoose = require("mongoose");
const transfer = new mongoose.Schema(
  {
    to_user_id: {
      type: String,
    },
    from_user_id: {
      type: String,
    },
    amount: {
      type: Number,
    },
    status: {
      type: String,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Transfer", transfer);

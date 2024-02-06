var mongoose = require("mongoose");
const commission = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    desc: {
      type: String,
    },
    commission_type: {
      type: String,
    },
    commission_level: {
      type: Number,
    },
    from_user: {
      type: String,
    },
    amount: {
      type: Number,
    },
    package_id: {
      type: String,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Commission", commission);

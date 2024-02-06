var mongoose = require("mongoose");
const user_package = new mongoose.Schema(
  {
    user_id: {
      type: String,
    },
    package_id: {
      type: String,
    },
    amount: {
      type: Number,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("UserPackage", user_package);

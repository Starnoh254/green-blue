var mongoose = require("mongoose");
const report = new mongoose.Schema(
  {
    placid_bal: {
      type: Number,
      default: 0,
    },
    gbfa_admin: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      default: 0,
    },
    gbfa_admin: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Report", report);

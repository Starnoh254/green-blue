var mongoose = require("mongoose");
const currency = new mongoose.Schema(
  {
    base: {
      type: String,
    },
    rates: {
      type: Object,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Currency", currency);

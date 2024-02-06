var mongoose = require("mongoose");
const package = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    icon: {
      type: String,
    },
    amount: {
      type: Number,
    },
    square_meters: {
      type: Number,
    },
    description: {
      type: String,
    },
    green_bonus_commissions: {
      type: {
        level_1: Number,
        level_2: Number,
        level_3: Number,
      },
    },
    blue_bonus_commissions: {
      type: {
        level_1: Number,
        level_2: Number,
        level_3: Number,
        level_4: Number,
        level_5: Number,
      },
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Package", package);

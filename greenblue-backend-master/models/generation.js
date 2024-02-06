var mongoose = require("mongoose");
const generation = new mongoose.Schema(
  {
    user_id: {
      type: String,
    },
    sponsor_id: {
      type: String,
    },
    generation_level_id: {
      type: Number,
    },
    is_spillover: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Generation", generation);

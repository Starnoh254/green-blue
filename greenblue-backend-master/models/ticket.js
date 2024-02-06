var mongoose = require("mongoose");
const ticket = new mongoose.Schema(
  {
    user_id: {
      type: String,
    },
    priority: {
      type: String,
    },
    status: {
      type: String,
    },
    messages: {
      type: {
        user_id: String,
        admin_id: String,
        message: String,
        date_time: Date,
        is_read: Boolean,
      },
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Ticket", ticket);

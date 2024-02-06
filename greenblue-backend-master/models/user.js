var mongoose = require("mongoose");
const user = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      // match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
    },
    first_name: {
      type: String,
    },
    last_name: {
      type: String,
    },
    phone: {
      type: String,
      // unique: true,
      // sparse: true,
    },
    account_number: {
      type: String,
      unique: true,
      sparse: true,
    },
    facebookProvider: {
      type: {
        id: String,
        token: String,
      },
      select: false,
    },

    googleProvider: {
      type: {
        id: String,
        token: String,
      },
      select: false,
    },
    registration_is_complete: {
      type: {
        status: Boolean,
        stage: String,
        strategy: String,
      },
    },
    account_status: {
      type: {
        acc_status: Boolean,
        status_id: String,
        activation_date: Date,
        expiration_date: Date,
      },
    },
    country: {
      type: {
        name: String,
        code: String,
        state: String,
      },
    },
    password: {
      type: String,
    },
    package_id: {
      type: String,
      default: "",
    },
    account_balance: {
      type: Number,
      default: 0,
    },
    held_balance: {
      type: Number,
      default: 0,
    },
    is_admin: {
      type: Boolean,
      default: false,
    },
    is_suspended: {
      type: Boolean,
      default: false,
    },
    registration_fee_is_paid: {
      type: Boolean,
      default: false,
    },
    referrer: {
      type: {
        account_no: String,
        referrer_id: String,
      },
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("User", user);

var mongoose = require("mongoose");
const sponsor = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      //   trim: true,
      //   unique: true,
      //   match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
    },
    first_name: {
      type: String,
    },
    last_name: {
      type: String,
    },
    phone: {
      type: String,
    },
    account_number: {
      type: String,
      unique: true,
      sparse: true,
    },
    company_name: {
      type: String,
    },
    sponsor_type: {
      type: String,
    },
    amount_to_sponsor: {
      type: Number,
    },
    trees_to_sponsor: {
      type: Number,
    },
    country: {
      type: {
        name: String,
        code: String,
        state: String,
      },
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
module.exports = mongoose.model("Sponsor", sponsor);

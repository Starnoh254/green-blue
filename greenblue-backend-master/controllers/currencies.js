var Currency = require("../models/currency");
const countryToCurrency = require("country-to-currency");
const { getUser } = require("./users");

const getUserRate = async (req, res, next) => {
  const user = await getUser(req);
  try {
    const currency = countryToCurrency[user.country.code];
    const latest = await Currency.find({}).sort({ _id: -1 }).limit(1);
    const data = {
      currency_symbol: currency,
      rate_usd: latest[0].rates[currency],
    };
    res.json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
module.exports = {
  getUserRate,
};

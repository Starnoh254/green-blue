const CronJob = require("node-cron");
var Currency = require("./models/currency");
var User = require("./models/user");

require("dotenv").config();
let unirest = require("unirest");

//UPDATE API
const getCurrencies = async () => {
  console.log("Update Currencies Cron Job Called");
  unirest
    .get("https://api.apilayer.com/exchangerates_data/latest?&base=USD")
    .headers({ apikey: "CUi0O6N9gVLo7XsktkjzgaNrniV9ao62" })
    .then(async (response) => {
      console.log("BODY", response.body);
      const data = response.body;
      const newCurrency = new Currency({
        base: data.base,
        rates: data.rates,
      });
      await newCurrency.save();
    });
};
// const updateBal = async (u) => {
//   const user = await User.findById(u._id);
//   user.account_balance = 0;
//   await user.save();
// };
// const updateBalances = async () => {
//   const users = await User.find({});
//   Promise.all(
//     users.map(async (user) => {
//       await updateBal(user);
//       console.log(user);
//     })
//   );
// };
const sumBalances = async (user) => {
  const users = await User.aggregate([
    { $group: { _id: null, sum: { $sum: "$account_balance" } } },
  ]);
  console.log(users);
};
exports.initScheduledJobs = async () => {
  const scheduledJobFunction = CronJob.schedule("0 */6 * * *", async () => {
    await getCurrencies();
  });

  scheduledJobFunction.start();
};
// sumBalances();

const User = require("../models/user");
const { getUser } = require("./users");
const credentials = {
  apiKey: "a7ab748741b67cd6c3c74f4651e54f28974da6f1943cac01fd16510d29e9cf05", // use your sandbox app API key for development in the test environment
  username: "greenblue", // use 'sandbox' for development in the test environment
};
const Africastalking = require("africastalking")(credentials);
const sendSms = async (user_id, message) => {
  try {
    const user = await User.findById(user_id);
    const sms = Africastalking.SMS;
    const options = {
      to: [`+${user.phone}`],
      message: message,
    };
    console.log(options);
    await sms
      .send(options)
      .then((response) => {
        console.log(response);
        return response;
      })
      .catch((error) => {
        console.log(error);
        return error;
      });
  } catch (error) {
    console.log(error);
  }
};
const testSend = async (req, res, next) => {
  try {
    const user = await getUser(req);
    const response = await sendSms(user._id, req.body.message);
    res.json(response);
  } catch (error) {
    res.status(504).json(error);
    console.log(error);
  }
};
module.exports = {
  sendSms,
  testSend,
};

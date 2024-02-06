const jwt = require("jsonwebtoken");
require("dotenv").config();
const secret = process.env.APP_API_KEY;
var createToken = function (auth) {
  return jwt.sign(
    {
      id: auth.id,
    },
    secret,
    {
      expiresIn: 60 * 10 * 120,
    }
  );
};

module.exports = {
  generateToken: function (req, res, next) {
    req.token = createToken(req.auth);
    return next();
  },
  sendToken: function (req, res) {
    res.setHeader("x-auth-token", req.token);
    return res.status(200).send(JSON.stringify(req.user));
  },
  verifyToken: function (token) {
    if (!token) {
      throw new Error("Authorization token is required");
    }
    var idObj = jwt.verify(token, secret);
    return idObj;
  },
};

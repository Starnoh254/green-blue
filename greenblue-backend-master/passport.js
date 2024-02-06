"use strict";
var passport = require("passport");
require("./models/user")();
var User = require("mongoose").model("User");
var FacebookTokenStrategy = require("passport-facebook-token");
var GoogleTokenStrategy = require("passport-google-token").Strategy;
var CustomStrategy = require("passport-custom").Strategy;
var config = require("./config");
const bcrypt = require("bcryptjs");

const localStrategy = require("passport-local").Strategy;

const { googleAuth, facebookAuth, phoneLogin } = require("./controllers/users");

module.exports = function () {
  passport.use(
    new FacebookTokenStrategy(
      {
        clientID: config.facebookAuth.clientID,
        clientSecret: config.facebookAuth.clientSecret,
        callbackURL: config.facebookAuth.callbackURL,
      },
      async function (accessToken, refreshToken, profile, done) {
        facebookAuth(accessToken, refreshToken, profile, done);
      }
    )
  );

  passport.use(
    new GoogleTokenStrategy(
      {
        clientID: config.googleAuth.clientID,
        clientSecret: config.googleAuth.clientSecret,
        callbackURL: config.googleAuth.callbackURL,
      },

      function (accessToken, refreshToken, profile, done) {
        googleAuth(accessToken, refreshToken, profile, done);
      }
    )
  );

  passport.use(
    new localStrategy(
      { usernameField: "phone" },
      async (phone, password, done) => {
        try {
          const user = await User.findOne({
            $or: [{ phone: phone }, { email: phone }],
          });
          if (!user) return done(null, false);
          //COMPARE PASSWORD
          bcrypt.compare(password, user.password, (err, result) => {
            if (err) throw err;
            if (result === true) {
              return done(null, user);
            } else {
              return done(null, false);
            }
          });
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  // passport.use(
  //   "email_auth",
  //   new CustomStrategy(function (req, done) {
  //     User.findOne(
  //       {
  //         email: req.body.email,
  //       },
  //       function (err, user) {
  //         return done(err, user);
  //       }
  //     );
  //   })
  // );
  // passport.use(
  //   "phone_auth",
  //   new CustomStrategy(async function (req, done) {
  //     try {
  //       const user = await User.findOne({ phone: req.body.phone });
  //       return done(null, user);
  //     } catch (error) {
  //       console.log(error);
  //       return done(null, error);
  //     }
  //   })
  // );
};

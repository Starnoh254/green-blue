module.exports = {
  facebookAuth: {
    clientID: "249536097446901",
    clientSecret: "656fbc2463d38aea388172ca6b8219ba",
    callbackURL: "https://greenblue.herokuapp.com/api/auth/facebook/callback",
    profileURL:
      "https://graph.facebook.com/v2.5/me?fields=first_name,last_name,email",
  },
  twitterAuth: {
    consumerKey: "your-consumer-key-here",
    consumerSecret: "your-client-secret-here",
    callbackURL: "http://localhost:4000/auth/twitter/callback",
  },

  googleAuth: {
    clientID:
      "265379233732-car2lqdttahi6rdib0hh7emq4liaqgdq.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: "https://greenblue.herokuapp.com/auth/google/callback",
  },
};

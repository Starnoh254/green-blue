const SibApiV3Sdk = require("sib-api-v3-sdk");
const defaultClient = SibApiV3Sdk.ApiClient.instance;
var apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey =
  "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";

const sendinblue = (sendSmtpEmail) => {
  var apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
  apiInstance.sendTransacEmail(sendSmtpEmail).then(
    function (data) {
      return true;
    },
    function (error) {
      console.error(error);
      return false;
    }
  );
};

module.exports = sendinblue;

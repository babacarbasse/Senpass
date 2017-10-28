/**
 * Created by lakhassane on 05/01/2017.
 */

angular.module('app')
  .constant("shopSettings", (function () {
    return {

      payPalSandboxId: "AbF7omRrTaWOTtRJGPtZCksOPVYRivScJnAcEhJf9sFW4D4hfRad6K0JKYaC2d31DNu5DasZSQKjsjsY",

      payPalProductionId : "",

      payPalEnv: "PayPalEnvironmentSandbo", // for testing production for production

      payPalShopName : "SenPass",

      payPalMerchantPrivacyPolicyURL : "https://sen-pass.com/reglementation",

      payPalMerchantUserAgreementURL : "https://sen-pass.com/reglementation"


    }
  })());

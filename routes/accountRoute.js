/* ***********************
 * Account Routes
 *************************/

// Needed Resources
const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController");
const utilities = require("../utilities");
const regValidate = require("../utilities/account-validation");

/* ***********************
 * Deliver Login View
 *************************/
router.get("/login", utilities.handleErrors(accountController.buildLogin));

/* ***********************
 * Deliver Registration View
 *************************/
router.get(
  "/register",
  utilities.handleErrors(accountController.buildRegister)
);

/* ***********************
 * Process Login
 *************************/
router.post(
  "/login",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.accountLogin)
);

/* ***********************
 * Add New Account Message
 *************************/
router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);

/* ***********************
 * Get Account View
 *************************/

router.get(
  "/account",
  utilities.handleErrors(accountController.getAccountManagementView)
);

module.exports = router;

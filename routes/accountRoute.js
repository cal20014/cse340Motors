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
  regValidate.loginRules(),
  regValidate.checkLoginData,
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
  "/",
  utilities.checkLogin,
  utilities.handleErrors(accountController.getAccountManagementView)
);


/* ***********************
 * Get Update Account View
 *************************/

router.get(
  "/update/:id",
  utilities.checkLogin,
  utilities.handleErrors(accountController.getUpdateAccountView)
);

/* ***********************
 * Update Account Information
 *************************/

router.post(
  "/update/:id",
  utilities.checkLogin,
  regValidate.updateRules(),
  regValidate.checkUpdateUserData,
  utilities.handleErrors(accountController.updateAccount)
);

/* ***********************
 * Change Password
 *************************/

router.post(
  "/change-password/:id",
  utilities.checkLogin,
  regValidate.passwordRules(),
  regValidate.checkPasswordData,
  utilities.handleErrors(accountController.changePassword)
);

module.exports = router;

/* ***********************
 * Account Routes
 *************************/

// Needed Resources
const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController");
const utilities = require("../utilities");

/* ***********************
 * Deliver Login View
 *************************/
router.get(
  "/login",
  utilities.handleErrors(accountControllerController.buildLogin)
);

module.exports = router;

// Needed Resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const validate = require("../utilities/server-form-validation");
const utilities = require("../utilities");

// Route to build inventory by classification view
router.get(
  "/type/:classificationId",
  utilities.handleErrors(invController.buildByClassificationId)
);

// Route to build inventory by detail view
router.get(
  "/detail/:inv_id",
  utilities.handleErrors(invController.displayVehicleDetail)
);

// Route to display the inventory management view
router.get("/", utilities.handleErrors(invController.buildInventoryManagement));

// Route to display the form for adding a new classification
router.get(
  "/addClassification/",
  utilities.handleErrors(invController.buildAddClassification)
);

// Route to display the form for adding a new inventory item
router.get(
  "/addInventory/",
  utilities.handleErrors(invController.buildAddInventoryItem)
);

// Route to handle the submission of the add classification form
router.post(
  "/add-classification/",
  validate.addClassificationRules(),
  validate.checkAddClassificationData,
  utilities.handleErrors(invController.addNewClassification)
);

// Route to handle the submission of the add inventory item form
router.post(
  "/add-inventory/",
  validate.addInventoryItemRules(),
  validate.checkAddInventoryItemData,
  utilities.handleErrors(invController.addNewInventoryItem)
);

module.exports = router;

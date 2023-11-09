// Needed Resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
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

router.get("/", utilities.handleErrors(invController.buildInventoryManagement));

router.get(
  "/add-classification/",
  utilities.handleErrors(invController.buildAddClassification)
);

router.get(
  "/add-inventory/",
  utilities.handleErrors(invController.buildAddInventoryItem)
);

module.exports = router;

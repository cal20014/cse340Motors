const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  const data = await invModel.getInventoryByClassificationId(classification_id);
  const grid = await utilities.buildClassificationGrid(data);
  let nav = await utilities.getNav();
  const className = data[0].classification_name;
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  });
};

/* ***************************
 *  Display inventory detail view
 * ************************** */
invCont.displayVehicleDetail = async function (req, res, next) {
  const vehicle_id = req.params.inv_id; // This gets the id from the URL
  const data = await invModel.getVehicleDetailsById(vehicle_id);
  const vehicleDetails = await utilities.buildVehicleDetails(data);
  let nav = await utilities.getNav();
  const vehicleMake = data.inv_make;
  const vehicleModel = data.inv_model;
  res.render("./inventory/detail", {
    title: vehicleMake + " " + vehicleModel + " details",
    nav,
    vehicleDetails,
  });
};

/* ***************************
 * Build inventory management view
 * ************************** */
invCont.buildInventoryManagement = async function (req, res, next) {
  const nav = await utilities.getNav();
  const managementView = await utilities.buildInventoryManagement();
  res.render("./inventory/management", {
    title: "Inventory Management",
    nav,
    managementView,
    errors: null,
  });
};

invCont.buildAddClassification = async function (req, res, next) {
  const nav = await utilities.getNav();
  const addClassificationView = await utilities.buildAddClassification();
  res.render("./inventory/addClassification", {
    title: "Add Classification",
    nav,
    addClassificationView,
    errors: null,
  });
};

invCont.buildAddInventoryItem = async function (req, res, next) {
  const nav = await utilities.getNav();
  const addInventoryView = await utilities.buildAddInventoryItem();
  res.render("./inventory/addInventory", {
    title: "Add Inventory Item",
    nav,
    addInventoryView,
    errors: null,
  });
};

module.exports = invCont;

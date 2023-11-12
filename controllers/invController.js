const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};
/* ***************************
 *  Add New Classification to the Database
 *  This function handles the POST request for adding a new classification.
 *  It extracts the classification name from the request body,
 *  invokes the model function to insert it into the database,
 *  and then redirects to the inventory management page.
 * ************************** */

invCont.addNewClassification = async function (req, res, next) {
  try {
    const { classification_name } = req.body;
    await invModel.insertNewClassification(classification_name);
    res.redirect("/inventory-management");
  } catch (error) {
    console.error("Error adding new classification:", error);
  }
};

/* ***************************
 *  Add New Inventory Item to the Database
 *  This function handles the POST request for adding a new inventory item.
 *  It retrieves all the necessary data from the request body,
 *  invokes the model function to insert the data into the database,
 *  and then redirects to the inventory management page.
 * ************************** */

invCont.addNewInventoryItem = async function (req, res, next) {
  try {
    const itemData = req.body; // Assuming all required fields are in req.body
    await invModel.insertNewInventoryItem(itemData);
    res.redirect("/inventory-management");
  } catch (error) {
    console.error("Error adding new inventory item:", error);
    // Handle the error appropriately
  }
};

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
  res.render("./inventory/addClassification", {
    title: "Add Classification",
    nav,
    errors: null,
  });
};

invCont.buildAddInventoryItem = async function (req, res, next) {
  const nav = await utilities.getNav();
  const classificationList = await utilities.buildClassificationList();
  res.render("./inventory/addInventory", {
    title: "Add Inventory Item",
    nav,
    classificationList,
    errors: null,
  });
};

module.exports = invCont;

const { parse } = require("dotenv");
const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};
/* ***************************
 *  Add New Classification to the Database
 *  This function handles the POST request for adding a new classification.
 *  It extracts the classification name from the request body,
 *  invokes the model function to insert it into the database,
 *  and then redirects to the inventory management page and displays a success message.
 * ************************** */

invCont.addNewClassification = async function (req, res, next) {
  try {
    const { classification_name } = req.body;
    await invModel.insertNewClassification(classification_name);
    req.flash(
      "notice",
      `New classification ${classification_name} added successfully!`
    );
    res.status(201).redirect("/inv");
  } catch (error) {
    console.error("Error adding new classification:", error);
    req.flash("error", "Error adding new classification.");
    res.status(500).render("inv/classification_add", {
      title: "Add Classification",
      nav,
    });
  }
};

/* ***************************
 *  Add New Inventory Item to the Database
 *  This function handles the POST request for adding a new inventory item.
 *  It retrieves all the necessary data from the request body,
 *  invokes the model function to insert the data into the database,
 *  and then redirects to the inventory management page and displays a success message.
 * ************************** */

invCont.addNewInventoryItem = async function (req, res, next) {
  try {
    const itemData = req.body;
    // console.log(
    //   `=====================\nHere is the item data: ${itemData}\n=====================`
    // );
    await invModel.insertNewInventoryItem(itemData);
    req.flash("notice", "New inventory item added successfully!");
    res.status(201).redirect("/inv");
  } catch (error) {
    console.error("Error adding new inventory item:", error);
    req.flash("error", "Error adding new inventory item.");
    res.status(500).render("inv/item_add", {
      title: "Add Inventory Item",
      nav,
    });
  }
};

/* ***************************
 *  Update Inventory Data in the Database
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav();
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body;
  const updateResult = await invModel.updateInventory(
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  );

  if (updateResult.rowCount > 0) {
    const itemName = `${updateResult.rows[0].inv_make} ${updateResult.rows[0].inv_model}`;
    req.flash("notice", `The ${itemName} was successfully updated.`);
    res.redirect("/inv");
  } else {
    const classificationSelect = await utilities.buildClassificationList(
      classification_id
    );
    const itemName = `${inv_make} ${inv_model}`;
    req.flash("notice", "Sorry, the update failed.");
    res.status(501).render("inventory/editInv", {
      title: "Edit " + itemName,
      nav,
      classificationSelect: classificationSelect,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
      errors: null,
    });
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
  const classificationSelect = await utilities.buildClassificationList();
  const managementView = await utilities.buildInventoryManagement();
  res.render("./inventory/management", {
    title: "Inventory Management",
    nav,
    managementView,
    classificationSelect,
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

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSONData = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id);
  const invData = await invModel.getInventoryByClassificationId(
    classification_id
  );
  if (invData[0].inv_id) {
    return res.json(invData);
  } else {
    next(new Error("No data returned"));
  }
};

/* ***************************
 *  Build Edit Inventory View
 * ************************** */

invCont.editInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id);
  let nav = await utilities.getNav();
  const invData = await invModel.getVehicleDetailsById(inv_id);
  const classificationSelect = await utilities.buildClassificationList(
    invData.classification_id
  );
  const itemName = `${invData.inv_make} ${invData.inv_model}`;
  res.render("./inventory/editInv", {
    title: `Edit ${itemName}`,
    nav,
    classificationSelect: classificationSelect,
    inv_id: invData.inv_id,
    inv_make: invData.inv_make,
    inv_model: invData.inv_model,
    inv_year: invData.inv_year,
    inv_description: invData.inv_description,
    inv_image: invData.inv_image,
    inv_thumbnail: invData.inv_thumbnail,
    inv_price: invData.inv_price,
    inv_miles: invData.inv_miles,
    inv_color: invData.inv_color,
    classification_id: invData.classification_id,
    errors: null,
  });
};

/* ***************************
 *  Build Delete Inventory View
 * ************************** */
invCont.deleteInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id);
  let nav = await utilities.getNav();
  const invData = await invModel.getVehicleDetailsById(inv_id);
  const itemName = `${invData.inv_make} ${invData.inv_model}`;
  res.render("./inventory/delete-confirm", {
    title: `Delete ${itemName}`,
    nav,
    inv_id: invData.inv_id,
    inv_make: invData.inv_make,
    inv_model: invData.inv_model,
    inv_year: invData.inv_year,
    inv_price: invData.inv_price,
    errors: null,
  });
};

/* ***************************
 *  Process Delete Inventory Request
 * ************************** */
invCont.deleteInventory = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id);
  const deleteResult = await invModel.deleteInventory(inv_id);
  if (deleteResult) {
    req.flash("notice", "The inventory item was successfully deleted.");
    res.redirect("/inv");
  } else {
    req.flash("notice", "Sorry, the delete failed.");
    res.redirect("/delete/" + inv_id);
  }
};

module.exports = invCont;

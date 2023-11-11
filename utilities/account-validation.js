const accountModel = require("../models/account-model");
const { body, validationResult } = require("express-validator");
const utilities = require("../utilities/");
const validate = {};

/*  **********************************
 *  Registration Data Validation Rules
 * ********************************* */
validate.registationRules = () => {
  return [
    // firstname is required and must be string
    body("account_firstname")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."), // on error this message is sent.

    // lastname is required and must be string
    body("account_lastname")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Please provide a last name."), // on error this message is sent.

    // A valid email is required and cannot already exist in the database
    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage("A valid email is required.")
      .custom(async (account_email) => {
        const emailExists = await accountModel.checkExistingEmail(
          account_email
        );
        if (emailExists) {
          throw new Error("Email exists. Please log in or use different email");
        }
      }),

    // A password is required and must be strong password
    body("account_password")
      .trim()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ];
};

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("account/register", {
      errors,
      title: "Registration",
      nav,
      account_firstname,
      account_lastname,
      account_email,
    });
    return;
  }
  next();
};

/* ******************************
 * Add Classification Validation Form Rules
 * ***************************** */
validate.addClassificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Classification name is required.")
      .matches(/^[A-Za-z0-9]+$/, "i")
      .withMessage(
        "Classification name must not contain spaces or special characters."
      ),
  ];
};

/* ******************************
 * Add Inventory Item Validation Form Rules
 * ***************************** */

validate.addInventoryItemRules = () => {
  return [
    body("inv_make")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Make is required")
      .matches(/[A-Za-z0-9 ]+/i) // regex to allow letters, numbers, and spaces
      .withMessage("Make can only contain letters, numbers and spaces."),
    body("inv_model")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Model is required")
      .matches(/[A-Za-z0-9 ]+/i) // regex to allow letters, numbers, and spaces
      .withMessage("Model can only contain letters, numbers and spaces."),
    body("inv_year")
      .trim()
      .isLength({ min: 4, max: 4 })
      .withMessage("Year is required")
      .isNumeric()
      .withMessage("Year can only contain numbers."),
    body("inv_description")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Description is required"),
    body("inv_image")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Image is required")
      .matches(/\.(png|jpg|jpeg|webp)$/)
      .withMessage("Image must be a png, jpg, jpeg, or webp file format."),
    body("inv_thumbnail")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Thumbnail is required")
      .matches(/\.(png|jpg|jpeg|webp)$/)
      .withMessage("Thumbnail must be a png, jpg, jpeg, or webp file format."),
    body("inv_price")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Price is required")
      .isFloat({ min: 0.0 })
      .withMessage("Price must be a positive number."),
    body("inv_miles")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Miles is required")
      .isNumeric()
      .withMessage("Miles must be a number."),
    body("inv_color")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Color is required")
      .matches(/[A-Za-z ]+/)
      .withMessage("Color can only contain letters and spaces."),
    body("classification_id")
      .trim()
      .isNumeric()
      .withMessage("Classification ID is required and must be numeric."),
  ];
};

/* ******************************
 * Check data and return errors or continue to add classification
 * ***************************** */

validate.checkAddClassificationData = async (req, res, next) => {
  const { classification_name } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("inventory/add-classification", {
      errors,
      title: "Add Classification",
      nav,
      classification_name,
    });
    return;
  }
  next();
};

/* ******************************
 * Check data and return errors or continue to add inventory item
 * ***************************** */

validate.checkAddInventoryItemData = async (req, res, next) => {
  const {
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
  } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("inventory/add-inventory-item", {
      errors,
      title: "Add Inventory Item",
      nav,
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
    });
    return;
  }
  next();
};

module.exports = validate;

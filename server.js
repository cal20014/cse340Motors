/* ******************************************
 * This server.js file is the primary file of the
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const env = require("dotenv").config();
const app = express();
const static = require("./routes/static");
const inventoryRoute = require("./routes/inventoryRoute");
const baseController = require("./controllers/baseController");
const utilities = require("./utilities/");

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout"); // not at views root

/* ***********************
 * Routes
 *************************/
app.use(static);
app.get("/", utilities.handleErrors(baseController.buildHome));
app.use("/inv", inventoryRoute);

/* ***********************
 * Middleware
 *************************/
// app.get(
//   "/trigger-error",
//   utilities.handleErrors((req, res, next) => {
//     throw new Error("Oh no! There was a crash. Maybe try a different route?");
//   })
// );

app.get("/trigger-error", (req, res, next) => {
  next({
    status: 500, // 500 for internal server error
    message:
      "Oh no! The Junior Dev broke the system. Come back later when we have it fixed.",
  });
});

// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
  next({
    status: 404,
    message:
      "Oops!! This is Embarrasing! The page you are looking for couldn't be located...",
  });
});

/* ***********************
 * Express Error Handler
 * Place after all other middleware
 *************************/
app.use(async (err, req, res, next) => {
  const defaultErrorTitle = " Server Error";
  const defaultErrorMessage =
    "Oh no! There was a crash. Maybe try a different route?";

  let errorTitle = defaultErrorTitle;
  let message = defaultErrorMessage;

  let nav = await utilities.getNav();

  console.error(`Error at: "${req.originalUrl}": ${err.message}`);

  switch (err.status) {
    case 404:
      message = err.message;
      errorTitle = " Page Not Found";
      break;
    case 500:
      message = err.message;
      break;
    default:
      err.status = 500; // default to internal server error if status is not set
  }

  res.status(err.status).render("errors/error", {
    title: err.status + errorTitle,
    message,
    nav,
  });
});

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT;
const host = process.env.HOST;

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`);
});

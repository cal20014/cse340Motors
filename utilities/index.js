const invModel = require("../models/inventory-model");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const Util = {};

/* ************************
 * Constructs the nav HTML unordered list with hamburger menu
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications();
  let list = '<div class="nav">';
  list += '<button id="menu-toggle" class="menu">';
  list +=
    '<img class="ham-menu icon active" src="/images/site/hamburger.svg" alt="Hamburger Menu icon" width="40" height="40" />';
  list +=
    '<img class="x-menu icon" src="/images/site/close.svg" alt="X symbol to close the hamburger menu" width="40" height="40" />';
  list += "</button>";

  list += '<ul class="nav-list">';
  list +=
    '<li class="list-item"><a href="/" title="Home page" class="link">Home</a></li>';

  data.rows.forEach((row) => {
    list += '<li class="list-item">';
    list += `<a class="link" href="/inv/type/${row.classification_id}" title="See our inventory of ${row.classification_name} vehicles">${row.classification_name}</a>`;
    list += "</li>";
  });

  list += "</ul>";
  list += "</div>";
  list += `<script>
    document.addEventListener("DOMContentLoaded", function() {
      const menuToggle = document.querySelector("#menu-toggle");
      const hamMenuIcon = document.querySelector(".ham-menu");
      const xMenuIcon = document.querySelector(".x-menu");
      const navList = document.querySelector(".nav-list");

      menuToggle.addEventListener("click", function() {
        // Toggle the icons
        hamMenuIcon.classList.toggle("active");
        xMenuIcon.classList.toggle("active");
        
        // Toggle the nav list
        navList.classList.toggle("active");
      });
    });
  </script>`;

  return list;
};

Util.buildClassificationGrid = async function (data) {
  let grid = "";
  if (data.length > 0) {
    grid = '<ul id="inv-display" class="inv-display">';
    data.forEach((vehicle) => {
      grid += `<li class="list-item vehicle-classifiction">
        <a href="../../inv/detail/${vehicle.inv_id}" title="View ${
        vehicle.inv_make
      } ${vehicle.inv_model} details">
          <div class="image-container">
            <img src="${vehicle.inv_thumbnail}" alt="Image of ${
        vehicle.inv_make
      } ${vehicle.inv_model} on CSE Motors" />
          </div>
        </a>
        <div class="namePrice">
          <hr class="divider-line"/>
          <h2>
            <a href="../../inv/detail/${vehicle.inv_id}" title="View ${
        vehicle.inv_make
      } ${vehicle.inv_model} details">
              ${vehicle.inv_make} ${vehicle.inv_model}
            </a>
          </h2>
          <span>$${new Intl.NumberFormat("en-US").format(
            vehicle.inv_price
          )}</span>
        </div>
      </li>`;
    });
    grid += "</ul>";
  } else {
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
  return grid;
};

Util.buildVehicleDetails = async function (data) {
  let vehicle = data;
  let vehicleDetails;
  vehicleDetails = `<div class="detail-view">`;
  vehicleDetails += `<h1>${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}</h1>`;
  vehicleDetails += `<div class="details-container">`;
  vehicleDetails += `<div class="image-container">`;
  vehicleDetails += `<img src="${vehicle.inv_image}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model}" width="1000"/>`;
  vehicleDetails += `</div>`;
  vehicleDetails += `<div class="info-container">`;
  vehicleDetails += `<h2>${vehicle.inv_make} ${vehicle.inv_model} Details</h2>`;
  vehicleDetails += `<ul class="detail-info-list">`;
  vehicleDetails += `<li class="list-item price"><span class="bolded">Price:</span> $${new Intl.NumberFormat(
    "en-US"
  ).format(vehicle.inv_price)}</li>`;
  vehicleDetails += `<li class="list-item"><span class="bolded">Description:</span> ${vehicle.inv_description}</li>`;
  vehicleDetails += `<li class="list-item"><span class="bolded">Color:</span> ${vehicle.inv_color}</li>`;
  vehicleDetails += `<li class="list-item"><span class="bolded">Miles:</span> ${new Intl.NumberFormat(
    "en-US"
  ).format(vehicle.inv_miles)}</li>`;

  vehicleDetails += `</ul>`;
  vehicleDetails += `</div>`;
  vehicleDetails += `</div>`;
  vehicleDetails += `</div>`;
  return vehicleDetails;
};

Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications();
  let classificationList =
    '<select name="classification_id" id="classificationList" >';
  classificationList += "<option>Choose a Classification</option>";
  data.rows.forEach((row) => {
    classificationList += `<option value="${row.classification_id}"${
      classification_id != null && row.classification_id == classification_id
        ? " selected"
        : ""
    }>${row.classification_name}</option>`;
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected ";
    }
    classificationList += `>${row.classification_name}</option>}`;
  });
  classificationList += "</select>";
  return classificationList;
};

Util.buildInventoryManagement = async function (data) {
  let view = `
  <div class="inv-management">
    <a class="link" href="/inv/addClassification">Add new classification</a>
    <a class="link" href="/inv/addInventory">Add new inventory</a>
  </div>
  `;
  return view;
};

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for
 * General Error Handling
 **************************************** */
Util.handleErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

/* ****************************************
 * Middleware to check token validity
 **************************************** */
Util.checkJWTToken = (req, res, next) => {
  // console.log("Checking JWT Token");
  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, accountData) {
        if (err) {
          req.flash("Please log in");
          res.clearCookie("jwt");
          return res.redirect("/account/login");
        }
        res.locals.accountData = accountData;
        res.locals.loggedin = 1;
        next();
      }
    );
  } else {
    next();
  }
};

/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next();
  } else {
    req.flash("notice", "Please log in.");
    return res.redirect("/account/login");
  }
};

Util.checkAccountType = (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, accountData) {
        if (err) {
          req.flash(
            "notice",
            "Your session has expired or is invalid. Please log in again."
          );
          res.clearCookie("jwt");
          return res.redirect("/account/login");
        }
        if (
          accountData.account_type === "Admin" ||
          accountData.account_type === "Employee"
        ) {
          req.flash(
            "success",
            `Welcome back, ${accountData.account_firstname}! You are successfully logged in as an ${accountData.account_type}.`
          );
          res.locals.accountData = accountData;
          res.locals.loggedin = 1;
          next();
        } else if (accountData.account_type === "Client") {
          req.flash(
            "notice",
            `Sorry, ${accountData.account_firstname}. You must be logged in as an Employee or Admin to access this page. You are logged in as an ${accountData.account_type}.`
          );
          return res.redirect("/account/login");
        }
      }
    );
  } else {
    req.flash(
      "notice",
      "You are not logged in. Please log in to access this page."
    );
    return res.redirect("/account/login");
  }
};

module.exports = Util;

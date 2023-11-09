const invModel = require("../models/inventory-model");
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

Util.buildInventoryManagement = async function (data) {
  let view = `
  <div class="inv-management">
    <a class="link" href="inv/add-classification">Add new classification</a>
    <a class="link" href="add-inventory">Add new inventory</a>
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

module.exports = Util;

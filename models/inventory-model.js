const pool = require("../database/");

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications() {
  return await pool.query(
    "SELECT * FROM classifications ORDER BY classification_name"
  );
}

module.exports = { getClassifications };

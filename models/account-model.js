const pool = require("../database/");

/* ***********************
 * Register New Account
 *************************/
async function registerAccount(
  account_firstname,
  account_lastname,
  account_email,
  account_password
) {
  try {
    const sql =
      "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *";
    return await pool.query(sql, [
      account_firstname,
      account_lastname,
      account_email,
      account_password,
    ]);
  } catch (error) {
    return error.message;
  }
}

/* **********************
 *   Check for existing email
 * ********************* */
async function checkExistingEmail(account_email) {
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1";
    const email = await pool.query(sql, [account_email]);
    return email.rowCount;
  } catch (error) {
    return error.message;
  }
}

/* **********************
 *  Return account data using email address
 * ********************* */

async function getAccountByEmail(account_email) {
  try {
    const result = await pool.query(
      "SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1",
      [account_email]
    );
    return result.rows[0];
  } catch (error) {
    return new Error("No matching email found");
  }
}

/* ***********************
 * Get Account by ID
 *************************/
async function getAccountById(account_id) {
  try {
    const result = await pool.query(
      "SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_id = $1",
      [account_id]
    );
    return result.rows[0];
  } catch (error) {
    return new Error("No matching ID found");
  }
}

/* ***********************
 * Update Account
 *************************/
async function updateAccount(account_id, account_email, account_name) {
  try {
    const result = await pool.query(
      "UPDATE account SET account_email = $1, account_name = $2 WHERE account_id = $3",
      [account_email, account_name, account_id]
    );
    return result.rowCount > 0;
  } catch (error) {
    return false;
  }
}

/* ***********************
 * Update Password
 *************************/
async function updatePassword(account_id, hashedPassword) {
  try {
    const result = await pool.query(
      "UPDATE account SET account_password = $1 WHERE account_id = $2",
      [hashedPassword, account_id]
    );
    return result.rowCount > 0;
  } catch (error) {
    return false;
  }
}

module.exports = {
  registerAccount,
  checkExistingEmail,
  getAccountByEmail,
  getAccountById,
  updateAccount,
  updatePassword,
};

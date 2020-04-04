const express = require("express");
const router = express.Router();
const Customer = require("../models/customer");
const customerController = require("../controllers/customers");
const authMiddleware = require("../middleware/auth");
const extractFile = require("../middleware/file");

//API for Get Customers JSON
router.get("", customerController.getCustomers);

//API for add customer
router.post("", authMiddleware, extractFile, customerController.createCustomer);

router.put(
  "/:id",
  authMiddleware,
  extractFile,
  customerController.updateCustomer
);

router.get("/:id", customerController.getCustomerByID);

// API for Delete Customer
router.delete("/:id", authMiddleware, customerController.deleteCustomer);

module.exports = router;

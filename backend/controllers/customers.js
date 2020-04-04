const Customer = require("../models/customer");

exports.getCustomers = (req, res, next) => {
  const pagesize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const customerQuery = Customer.find();
  let customersList;
  if (pagesize && currentPage) {
    customerQuery.skip(pagesize * (currentPage - 1)).limit(pagesize);
  }
  customerQuery
    .then(customers => {
      customersList = customers;
      return Customer.countDocuments();
    })
    .then(count => {
      res.json({
        message: "Customer fetched successfully.",
        customers: customersList,
        totalCustomers: count
      });
    });
};

exports.deleteCustomer = (req, res, next) => {
  Customer.deleteOne({ _id: req.params.id, creator: req.userData.id })
    .then(result => {
      if (result.n > 0) {
        res.status(200).json({ message: "Customer deleted successfully." });
      } else {
        res.status(401).json({
          message: "Unauthorized."
        });
      }
    })
    .catch(() => {
      res.status(500).json({ message: "Could't delete customer." });
    });
};

exports.getCustomerByID = (req, res, next) => {
  Customer.findById(req.params.id)
    .then(customer => {
      if (customer) {
        res.status(200).json(customer);
      } else {
        res.status(404).json({ message: "Customer not found..." });
      }
    })
    .catch(() => {
      res.status(500).json({ message: "Not getting customers" });
    });
};

exports.updateCustomer = (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const imagePathUrl = req.protocol + "://" + req.get("host");
    imagePath = imagePathUrl + "/images/" + req.file.filename;
  }
  const customer = new Customer({
    _id: req.params.id,
    customer_name: req.body.customer_name,
    pincode: req.body.pincode,
    city: req.body.city,
    address: req.body.address,
    imagePath: imagePath,
    creator: req.userData.id
  });
  Customer.updateOne({ _id: req.params.id, creator: req.userData.id }, customer)
    .then(result => {
      if (result.n > 0) {
        res.status(200).json({
          message: "Customer updated successfully."
        });
      } else {
        res.status(401).json({
          message: "Customer not find."
        });
      }
    })
    .catch(err => {
      res.status(500).json({ message: "Could't update customer" });
    });
};

exports.createCustomer = (req, res, next) => {
  const imagePathUrl = req.protocol + "://" + req.get("host");
  const customer = new Customer({
    customer_name: req.body.customer_name,
    pincode: req.body.pincode,
    city: req.body.city,
    address: req.body.address,
    imagePath: imagePathUrl + "/images/" + req.file.filename,
    creator: req.userData.id
  });
  customer
    .save()
    .then(createdCustomer => {
      res.status(201).json({
        message: "cutomer added successfully",
        customer: {
          ...createdCustomer,
          id: createdCustomer._id
        }
      });
    })
    .catch(() => {
      res.status(500).json({ message: "Customer creation faieled." });
    });
};

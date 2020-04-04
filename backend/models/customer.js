const mongoose = require("mongoose");
const customerSchema = mongoose.Schema({
  customer_name: { type: String, required: true },
  pincode: { type: String, required: true },
  city: { type: String, required: true },
  address: { type: String, required: true },
  imagePath: { type: String, required: true },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
});

module.exports = mongoose.model("Customer", customerSchema);

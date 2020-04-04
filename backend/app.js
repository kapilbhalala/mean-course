const express = require("express");
const path = require("path");
const app = express();
var bodyParser = require("body-parser");
const customersRouters = require("./routes/customers");
const usersRouter = require("./routes/users");
const mongoose = require("mongoose");

//Connect MongoDB Database
mongoose
  .connect(
    "mongodb+srv://mongouser:" +
      process.env.MONGO_ATLAS_PW +
      "@cluster0-k16rs.mongodb.net/mean-database",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  )
  .then(() => {
    console.log("Database is connected!");
  })
  .catch(() => {
    console.log("Database connection failed!");
  });

//Parse request data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/images", express.static(path.join("backend/images")));

// Define Method for CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

app.use("/api/customers", customersRouters);
app.use("/api/users", usersRouter);
module.exports = app;

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.userSignUp = (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then(hash => {
    const user = new User({
      email: req.body.email,
      password: hash
    });
    user
      .save()
      .then(createdUser => {
        res.status(201).json({
          message: "user added successfully",
          user: createdUser
        });
      })
      .catch(error => {
        res.status(500).json({ message: "Signup is invalid." });
      });
  });
};

exports.userLogin = (req, res, next) => {
  let fetchedUser;
  User.findOne({ email: req.body.email })
    .then(user => {
      fetchedUser = user;
      if (!user) {
        res.status(401).json({ message: "Login Unauthorized." });
      }
      return bcrypt.compare(req.body.password, user.password);
    })
    .then(result => {
      if (!result) {
        return res.status(401).json({ message: "Login Unauthorized." });
      }
      const token = jwt.sign(
        { email: fetchedUser.email, id: fetchedUser._id },
        process.env.JWT_KEY,
        { expiresIn: "1h" }
      );
      res
        .status(200)
        .json({ token: token, expiresIn: 3600, userID: fetchedUser._id });
    })
    .catch(err => {
      console.log(err);
      res.status(401).json({ message: "Login Unauthorized." });
    });
};

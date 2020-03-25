const express = require("express");
const router = express.Router();
const validator = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const config = require("config");
// @route     POST     api/users
// @desc      Register a user
// @access    Public

router.post(
  "/",
  [
    validator
      .check("name", "Please add name")
      .not()
      .isEmpty(),
    validator.check("email", "Please include a valid Email").isEmail(),
    validator
      .check("password", "Please enter a password with 6 or more characters")
      .isLength({ min: 6 })
  ],
  async (req, res) => {
    const errors = validator.validationResult(req);
    console.log(errors);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ msg: "User Already exists" });
      }
      user = new User({
        name,
        email,
        password
      });

      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      await user.save();
      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        config.get("jwt_secret"),
        {
          expiresIn: 360000
        },
        (err, token) => {
          if (err) throw new err();
          res.json({ token });
        }
      );
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }
  }
);

module.exports = router;

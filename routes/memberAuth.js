const express = require("express");
const validator = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Member = require("../models/Members");
const config = require("config");
const memberAuth = require("../middleware/memberAuth");
const router = new express.Router();

// @route     POST     api/auth
// @desc      Get Logged in  Member
// @access    Private

router.get("/", memberAuth, async (req, res) => {
  try {
    const member = await Member.findById(req.member.id).select("-password");
    res.json(member);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// @route     POST     api/auth
// @desc      Auth Member and get token
// @access    Public

router.post(
  "/",
  [
    validator.check("email", "please include valid email").isEmail(),
    validator.check("password", "Password is required").exists()
  ],
  async (req, res) => {
    const errors = validator.validationResult(req);
    console.log(errors);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      let member = await Member.findOne({ email });
      if (!member) {
        return res.status(400).json({ msg: "Invalid Credentials" });
      }

      const isMatch = await bcrypt.compare(password, member.password);
      if (!isMatch) {
        return res.status(400).json({ msg: "Invalid Credentials" });
      }
      const payload = {
        member: {
          id: member.id
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

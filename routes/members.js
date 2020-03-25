const express = require("express");
const router = express.Router();
const validator = require("express-validator");
const bcrypt = require("bcryptjs");
const auth = require("../middleware/auth");
const jwt = require("jsonwebtoken");
const Member = require("../models/Members");
const config = require("config");

// @route     POST     api/members
// @desc      Register a Member
// @access    Private

router.post(
  "/",

  [
    auth,
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
    const { name, email, password, salary, userType, phone } = req.body;
    try {
      let member = await Member.findOne({ email });
      if (member) {
        return res.status(400).json({ msg: "Member Already exists" });
      }
      member = new Member({
        name,
        email,
        password,
        salary,
        userType,
        phone,
        user: req.user.id
      });

      const salt = await bcrypt.genSalt(10);

      member.password = await bcrypt.hash(password, salt);

      await member.save();
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

// @route     GET     api/members
// @desc      Get a Member
// @access    Private
router.get("/", auth, async (req, res) => {
  try {
    const members = await Member.find({ user: req.user.id }).sort({
      date: -1
    });
    res.json(members);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});
// @route    Get api/products/:id
// @desc     Get A product by id
// @access   Private
router.get("/:id", auth, async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ msg: "Member not Found" });
    }
    res.json(member);
  } catch (error) {
    console.error(error.message);
    if (error.kind === "ObjectId") {
      return res.status(404).json({ msg: "Member not Found" });
    }
    res.status(500).send("Server Error");
  }
});
// @route    Delete api/products/:id
// @desc     Delete A product by id
// @access   Private
router.delete("/:id", auth, async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    //   Check the user
    if (member.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }
    if (!member) {
      return res.status(404).json({ msg: "Member not Found" });
    }
    await member.remove();
    res.json({ msg: "Member Removed" });
  } catch (error) {
    console.error(error.message);
    if (error.kind === "ObjectId") {
      return res.status(404).json({ msg: "Member not Found" });
    }
    res.status(500).send("Server Error");
  }
});

module.exports = router;

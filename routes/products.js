const express = require("express");
const { check, validationResult } = require("express-validator");
const memberAuth = require("../middleware/memberAuth");
const auth = require("../middleware/auth");
const router = new express.Router();
const Member = require("../models/Members");
const Product = require("../models/Product");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "./public");
  },
  filename: function(req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + "-" + file.originalname);
  }
});
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  }
});

// @route    POST api/products
// @desc     Create A product
// @access   Private
router.post(
  "/",
  [memberAuth],
  upload.single("productImg"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const member = await Member.findById(req.member.id).select("-password");
      const newProduct = new Product({
        productName: req.body.productName,
        productDesc: req.body.productDesc,
        productPrice: req.body.productPrice,
        productQuantity: req.body.productQuantity,
        productOriginalCost: req.body.productOriginalCost,
        category: req.body.category,
        productImg: req.file.path,

        member: req.member.id
      });
      const product = await newProduct.save();

      res.json(product);
    } catch (error) {
      console.error(error.message);
      return res.status(500).send("Server Error");
    }
  }
);
// @route    Get api/products
// @desc     Get All products
// @access   Private
router.get("/", memberAuth, async (req, res) => {
  try {
    const products = await Product.find().sort({
      date: -1
    });
    res.json(products);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});
// @route    Get api/products/:id
// @desc     Get A product by id
// @access   Private
router.get("/:id", memberAuth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ msg: "Product not Found" });
    }
    res.json(product);
  } catch (error) {
    console.error(error.message);
    if (error.kind === "ObjectId") {
      return res.status(404).json({ msg: "Product not Found" });
    }
    res.status(500).send("Server Error");
  }
});
// @route    Delete api/products/:id
// @desc     Delete A product by id
// @access   Private
router.delete("/:id", auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    //   Check the user
    if (product.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }
    if (!product) {
      return res.status(404).json({ msg: "Product not Found" });
    }
    await product.remove();
    res.json({ msg: "Product Removed" });
  } catch (error) {
    console.error(error.message);
    if (error.kind === "ObjectId") {
      return res.status(404).json({ msg: "Product not Found" });
    }
    res.status(500).send("Server Error");
  }
});

module.exports = router;

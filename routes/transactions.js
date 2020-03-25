const express = require("express");
const { check, validationResult } = require("express-validator");
const memberAuth = require("../middleware/memberAuth");
const auth = require("../middleware/auth");
const router = new express.Router();
const Member = require("../models/Members");
const Transaction = require("../models/Transaction");

// @route    POST api/transactions
// @desc     Create A Transaction
// @access   Private
router.post("/", [memberAuth], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const member = await Member.findById(req.member.id).select("-password");
    const newTransaction = new Transaction({
      transactionType: req.body.transactionType,
      amount: req.body.amount,
      productName: req.body.productName,
      quantity: req.body.quantity,
      materialType: req.body.materialType,
      name: req.body.name,
      member: req.member.id
    });
    const transaction = await newTransaction.save();

    res.json(transaction);
  } catch (error) {
    console.error(error.message);
    return res.status(500).send("Server Error");
  }
});
// @route    Get api/transactions
// @desc     Get All transactions
// @access   Private
router.get("/", memberAuth, async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({
      date: -1
    });
    res.json(transactions);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});
// @route    Get api/transactions/:id
// @desc     Get A product by id
// @access   Private
router.get("/:id", memberAuth, async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ msg: "Transaction not Found" });
    }
    res.json(transaction);
  } catch (error) {
    console.error(error.message);
    if (error.kind === "ObjectId") {
      return res.status(404).json({ msg: "Transaction not Found" });
    }
    res.status(500).send("Server Error");
  }
});
// @route    Delete api/transactions/:id
// @desc     Delete A Transaction by id
// @access   Private
router.delete("/:id", auth, async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    //   Check the user
    if (transaction.member.toString() !== req.member.id) {
      return res.status(401).json({ msg: "Member not authorized" });
    }
    if (!transaction) {
      return res.status(404).json({ msg: "Transaction not Found" });
    }
    await transaction.remove();
    res.json({ msg: "Transaction Removed" });
  } catch (error) {
    console.error(error.message);
    if (error.kind === "ObjectId") {
      return res.status(404).json({ msg: "Product not Found" });
    }
    res.status(500).send("Server Error");
  }
});

module.exports = router;

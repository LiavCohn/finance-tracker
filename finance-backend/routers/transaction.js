const { Transaction } = require("../models");
const express = require("express");
const auth = require("../auth");
const router = express.Router();

// Transaction routes
router.get("/", auth, async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.userId });
    res.json(transactions);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

router.post("/", auth, async (req, res) => {
  const { type, amount, category } = req.body;
  const transaction = new Transaction({
    userId: req.userId,
    type,
    amount,
    category,
  });
  await transaction.save();
  res.json(transaction);
});

router.delete("/:id", auth, async (req, res) => {
  try {
    await Transaction.findByIdAndDelete(req.params.id);
    res.status(204).json({ message: "Transaction deleted" });
  } catch (error) {
    res.status(500).send("Server error");
  }
});

module.exports = router;

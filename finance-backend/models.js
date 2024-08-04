const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

//user schema
const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String,
});

//When you need to compare a provided password with the stored hash,
//bcrypt extracts the salt from the stored hash, hashes the provided password using that salt,
//and compares the result with the stored hash.
userSchema.methods.comparePassword = (givenPassword) => {
  console.log("in method ", givenPassword, this.password);
  return bcrypt.compare(givenPassword, this.password);
};

//transaction schema
const transactionSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  type: String,
  amount: Number,
  category: String,
  date: { type: Date, default: Date.now() },
});

const User = mongoose.model("User", userSchema);
const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = { User, Transaction };

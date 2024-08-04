const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("./models");
const { SECRET_KEY } = require("./consts");
const mongoose = require("mongoose");
const transactionsRoutes = require("./routers/transaction");

const app = express();

app.use(cors());
app.use(bodyParser.json());

const url =
  "mongodb+srv://liavc:liavc@cluster0.tcrr2x0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose
  .connect(url)
  .then(() => {
    console.log("Connected to Database");
  })
  .catch((err) => {
    console.log("Not Connected to Database ERROR! ", err);
  });

//--------Routes--------
app.use("/transactions", transactionsRoutes);
app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ username, password: hashedPassword });
  await user.save();

  res.json(user);
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  const isSame = await bcrypt.compare(password, user.password);
  if (user && isSame) {
    const token = jwt.sign({ userId: user._id }, SECRET_KEY, {
      expiresIn: "1h",
    }); // Added token expiration
    res.json({ token });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

const auth = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  const actualToken = token.startsWith("Bearer ")
    ? token.slice(7, token.length).trimLeft()
    : token;

  try {
    const decoded = jwt.verify(actualToken, SECRET_KEY);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

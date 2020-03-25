const express = require("express");
const connectDB = require("./config/db");
const path = require("path");

const app = express();
// Connect DB
connectDB();
app.use(express.static(path.join(__dirname, "client/build")));
app.use(express.json());
const PORT = process.env.PORT || 5000;

// Define Routers
app.use("/api/users", require("./routes/users"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/MemberAuth", require("./routes/memberAuth"));
app.use("/api/contacts", require("./routes/contacts"));
app.use("/api/products", require("./routes/products"));
app.use("/api/members", require("./routes/members"));
app.use("/api/transactions", require("./routes/transactions"));

app.get("/", (req, res) => {
  res.send("Online now");
});
app.post("/", (req, res) => {
  res.send(req.body);
  console.log(req.body);
});
app.listen(PORT, () => {
  console.log(`Server Started on ${PORT}`);
});

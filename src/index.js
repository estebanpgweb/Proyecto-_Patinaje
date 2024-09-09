const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const patinadorRoute = require("./routes/patinador");

const app = express();
const port = process.env.PORT || 9000;

  // middlewares
app.use(express.json());
app.use("/api", patinadorRoute);

// routes
app.get("/", (req, res) => {
  res.send("backend proyecto liga santandereana de patinaje");
});

  // mongodb connection
mongoose
.connect(process.env.MONGODB_URI)
.then(() => console.log("Connected to MongoDB Atlas"))
.catch((error) => console.error(error));

// server listening
app.listen(port, () => console.log("Server listening to", port));

const express = require("express");
const cors = require("cors");
require("dotenv").config();

const routes = require("./routes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.use("/api", routes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

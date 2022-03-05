const express = require("express");
const cors = require("cors");

const app = express();

var corsOptions = {
  origin: "http://localhost:9103"
};

app.use(cors());

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to PassProject." });
});

require("./routes/passes.routes.js")(app);

// set port, listen for requests
const PORT = process.env.PORT || 9103;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
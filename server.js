const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
// const itemRoutes = require('./routes/api/');
// const itemRoutes = require('./routes/api/items');

// const itemRoutes = require('./routes/api/items');

const config = require("config");

//bodyparser middleware

app.use(bodyParser.json());

// DB config

const db = config.get("mongoURI");

//connect to mongo

mongoose
  .connect(db, { useNewUrlParser: true, useCreateIndex: true })
  .then(() => console.log("Mongo connected..."))
  .catch(err => console.log(err));

const port = process.env.Port || 5000;
// app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//     next();
// });

app.use("/api/items", require("./routes/api/items"));
app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));

app.listen(port, () => console.log(`server running on ${port}`));

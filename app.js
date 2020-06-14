//Sourcing JS Modules
const express = require("express"),
  router = require("./routes/router"),
  path = require("path"),
  upload = require("express-fileupload"),
  mysql = require("mysql"),
  session = require("express-session"),
  bodyParser = require("body-parser"),
  nodemailer = require("nodemailer");
  require('dotenv').config();

var sql = "",
  inserts;

const { check, validationResult } = require("express-validator");
const app = express();
const port = process.env.PORT || 8011;

app.set("port", port);
app.use(upload());
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(bodyParser.json());
app.use("/public", express.static("public"));
app.use(express.static(__dirname + "/public"));

//-Initialize memory un-leaked cookies---------
app.set("trust proxy", 1);
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    secure: true,
    saveUninitialized: true,
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000, //30 days
    },
  })
);

//ROUTING
app.get("/", router.index);

//Middleware running server
app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});

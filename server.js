/*******************************************************************************************
 * @Purpose   : Config the Server, Create routs, Start the Server
 * @file      : server.js
 * @overview  : it start the server used port and Pass the all request and respose
 *              through the backend and froutend
 * @author    : PRAVIN DESHMUKH
 * @since     : 06/07/2020
 *******************************************************************************************/
/**
 *@description Dependencies are installed for execution.
 */

var express = require("express");
var bodyParser = require("body-parser");
require("./config/mongooConfig");
//create express app
var app = express();
var router = require("./route/route");
require("dotenv").config();
const PORT = process.env.PORT || 5000;

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse requests of content-type - application/json
app.use(bodyParser.json());

app.use("/", router);

//listen for requests
app.listen(PORT, (err) => {
  if (err) throw err;
  console.log("server is listening on port", PORT);
});

module.exports = app;

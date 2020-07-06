/*******************************************************************************************
 * @Purpose   : Config the Server, Create routs, Start the Server
 * @file      : server.js
 * @overview  : it start the server used port and Pass the all request and respose
 *              through the backend and froutend
 * @author    : PRAVIN DESHMUKH
 * @since     : 06/07/2020
 *******************************************************************************************/
var express = require("express");
var bodyParser = require("body-parser");
require("./config/mongooConfig");
var app = express();
var router = require("./route/route");
require("dotenv").config();
const PORT = process.env.PORT || 5000;

const swaggerUi = require("swagger-ui-express");
const swaggerDocs = require("./swagger/swagger");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/", router);

app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.listen(PORT, (err) => {
  if (err) throw err;
  console.log("server is listening on port", PORT);
});

module.exports = app;

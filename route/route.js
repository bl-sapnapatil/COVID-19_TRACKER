/*******************************************************************************************
 * @Purpose   : Define routes
 * @file      : route.js
 * @overview  : define routes for api
 * @author    : PRAVIN DESHMUKH
 * @since     : 06/07/2020
 *******************************************************************************************/
var express = require("express");
var router = express.Router();
const controller = require("../controller/stateController");

router.get("/getAllStateData", controller.getAllStateData);
module.exports = router;

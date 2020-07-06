/*******************************************************************************************
 * @Purpose   : Define routes
 * @file      : route.js
 * @overview  : define routes for api
 * @author    : PRAVIN DESHMUKH
 * @since     : 06/07/2020
 *******************************************************************************************/
/**
 *@description Dependencies are installed for execution.
 */
var express = require("express");
var router = express.Router();
const controller = require("../controller/stateController");
const cacheController = require("../controller/cacheController");

/**
 *@description The particular method is called depending on the route.
 */
router.get(
  "/getAllStateData",
  cacheController.cacheStates,
  controller.getAllStateData
);
module.exports = router;

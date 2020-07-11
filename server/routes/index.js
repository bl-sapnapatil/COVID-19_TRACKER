/**
 * @description API Router
 * @overview Website Router file.
 * @file index.js
 * @module Router It defines the api routes.
 *
 * @author Dilip <dilip.more@bridgelabz.com>
 * @copyright Copyright 2017 Bridgelabz <admin@bridgelabz.com>
 *
 * @todo Modular code changes for
 */

/**
 * @const express Node back-end framework to manage the API & other task.
 * @const app Express instance.
 */
const express = require('express');
const controller = require('../controller/stateController').default;

/**
 * @description Create Router instance
 * @typedef {Object} router
 */
const router = express.Router();

/**
 * @description API Welcome
 */
router.get('/', (req, res) =>
	res.json({
		status: true,
		message: `Welcome to the ${process.env.COVID19_PROJECT_NAME} API`,
	})
);

/**
 *@description The particular method is called depending on the route.
 */
router.get('/getAllStateData', controller.getAllStateData);

/**
 * @description Export Module
 */
module.exports = router;

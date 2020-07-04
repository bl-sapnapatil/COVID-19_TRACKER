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
 * @description Module Dependencies
 * @define Define the variable
 *
 * @const express Node back-end framework to manage the API & other task.
 * @const speakeasy Sending the SMS OTP library, having the time duration.
 * @const CircularJSON Solution for Printing the JSON having the circular json reference parent element.
 * @const Proimise Promise library bluebird
 * @const app Express instance.
 */
const express = require('express');
// const config = require("../../config").get();

// let router;
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

router.get('/logout', (req, res) => {
	req.logout();
	req.session.destroy();
	return res.redirect('/');
});

/**
 * @description Export Module
 */
module.exports = router;

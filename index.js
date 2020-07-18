#!/usr/bin/env node

/**
 * @summary Covid19-Backend
 *
 * @author  Dilip <dilip.more@bridgelabz.com>
 * @license ISC Licensed
 * @version 1.0
 *
 */

/**
 * @description Covid19 entry point for server. All module dependencies
 *
 * @todo
 * 1. Documentation
 * 2. Security checks needed
 * 3. Multitanency checks needed to do.
 * 4. Events & Listnered needed to test with huge site load.
 *
 * @const dotenv
 * @const csurf
 * @const helmet
 * @const express
 * @const body-parser
 * @const cookie-parser
 * @const express-session
 * @const compression
 *
 */

process.env.TZ = 'Asia/Kolkata';
require('dotenv').config();

const cors = require('cors');
const csrf = require('csurf');
const helmet = require('helmet');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const compression = require('compression');

/**
 * @description Initialize the express
 */
const app = express();

require('./config').set(process.env.NODE_ENV, app);

const router = require('./server/routes');
const config = require('./config').get();

/**
 * @description Initialize the swagger
 */
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./server/swagger/swagger.json');

/**
 * @description Winston logger derived from the config
 */
const { logger } = config;

/**
 * @description setup route middlewares
 */
csrf({ cookie: true });
bodyParser.urlencoded({ extended: false });

/**
 * @description Helmet module for security
 */
app.use(helmet());

/**
 * @description we need this because "cookie" is true in csrfProtection
 * @param {function} cookieParser
 */
app.use(cookieParser());

app.disable('x-powered-by');
app.enable('trust proxy');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/**
 * @description gzip compressed data oputup
 * @param {function} compression
 */
app.use(
	compression({
		threshold: 9,
	})
);

/**
 * @description Cross site enabler
 */
if (!config.isProduction) {
	app.use(cors({ credentials: true, origin: true }));
}

app.set('trust proxy', 1); // trust first proxy
app.use(
	session({
		secret: process.env.COVID19_SESSION_SECRET,
		resave: true,
		saveUninitialized: true,
	})
);

/**
 * @description Enable the swagger for dev & local & Disable it on Production.
 *
 * @todo Later we need to deploy the production copy without including the lib folder,
 * So as to make sure we deploying only the production code and filterout the dev, stage & testing codes.
 */
if (!config.isProduction) {
	/**
	 * @description Swagger implimentation
	 */
	//require('./server/lib')(app, config.tanents);
}

/**
 * @description Enable the Swagger
 */
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

/**
 * @description API Access Gatway
 */
app.use('/api/', router);

/**
 * @description Checks the system errors & returns true if system/programming errors
 * @param {any} err type object/string
 * @returns Boolean true/false
 */
const checkSystemErrors = err =>
	err instanceof TypeError ||
	err instanceof SyntaxError ||
	err instanceof EvalError ||
	err instanceof RangeError ||
	err instanceof ReferenceError;

/**
 * @description Error handler, Ignore the production for stack trace.
 * Meaning debuging cannot be done on the production.
 */
if (!config.isProduction) {
	app.use((err, req, res) => {
		logger.trace(err);
		logger.error(`Error: ${err}, \n\n Request: ${req}`);
		const error = {
			message: 'Something bad happened. Please contact system administrator or try again',
			status: false,
		};
		if (!checkSystemErrors(err)) {
			error.message = err;
			if (typeof err === 'object' && err.message) {
				error.message = err.message;
			}
		}
		res.status(400);
		res.send(error);
	});
} else {
	/**
	 * @description production error handler no stacktraces leaked to user
	 */
	app.use((err, req, res) => {
		const error = {
			message: 'Something bad happened. Please contact system administrator or try again',
			status: false,
		};
		if (!checkSystemErrors(err)) {
			error.message = err;
			if (typeof err === 'object' && err.message) {
				error.message = err.message;
			}
		}
		res.status(400).send(error);
	});
}

process.stdin.resume(); // so the program will not close instantly

const exitHandler = (options, err) => {
	if (options.cleanup) {
		console.trace(err);
		console.log('Shutting down the services...', err);
	}
	if (err) console.log(err.stack);
	if (options.exit) process.exit();
};

// do something when app is closing
process.on('exit', exitHandler.bind(null, { cleanup: true }));

// catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, { exit: true }));

// catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', exitHandler.bind(null, { exit: true }));
process.on('SIGUSR2', exitHandler.bind(null, { exit: true }));

// catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, { exit: true }));

/**
 * @description Initiate the server & listen to the port configured.
 */
app.listen(config.port, () => {
	logger.info(`Express server listening on port ${config.port}`);
});

/**
 * @description Export the express app instance
 */

module.exports = app;

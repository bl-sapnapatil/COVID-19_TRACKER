/**
 * @file index.js
 *
 * @description Index Configuration setup is required to run your server.
 *
 * @author  Dilip <dilip.more@bridgelabz.com>
 * @license ICS
 * @version 1.0
 */

const fs = require('fs');
const path = require('path');
const aws = require('aws-sdk');
const redis = require('redis');
const fse = require('fs-extra');
const clc = require('cli-color');
const winston = require('winston');
const dateFormat = require('dateformat');
const expressWinston = require('express-winston');

let config;

// const PROJECT_ROOT = path.join(__dirname, '..');

/**
 * @description winston logging config
 */
const winstonConfig = {
	config: {
		levels: {
			error: 0,
			warn: 1,
			info: 2,
			debug: 3,
			trace: 4,
			data: 5,
			verbose: 6,
			silly: 7,
		},
		colors: {
			error: 'red',
			warn: 'yellow',
			info: 'green',
			debug: 'cyan',
			trace: 'grey',
			data: 'magenta',
			verbose: 'cyan',
			silly: 'magenta',
		},
	},
	logDir: path.join('/tmp', 'Covid19--logs'),
};

/**
 * @description LUSCA Express application security hardening.
 */
// const luscaOps = {
// 	csrf: false,
// 	xframe: 'SAMEORIGIN',
// 	p3p: 'ABCDEF',
// 	hsts: {
// 		maxAge: 31536000,
// 		includeSubDomains: true,
// 		preload: true
// 	},
// 	xssProtection: true,
// 	nosniff: true
// };

/**
 * @description Creates the logging directory for the system, if it doesnt exists.
 */
if (!fs.existsSync(winstonConfig.logDir)) {
	// Create the directory if it does not exist
	fs.mkdirSync(winstonConfig.logDir, (err, data) => {
		if (err) {
			console.log('Error while creating logger system directory : ', JSON.stringify(err));
		}
		console.log(`Making directory ${data}`);
	});
} else {
	fse.emptyDir(winstonConfig.logDir, (err, done) => {
		if (err) {
			console.log('', err);
		}
		if (done) {
			console.log(`Winston config directory ${done}`);
		}
	});
}

/**
 * @description Defines the color for console
 */
const consoleColorMap = {
	log: clc.blue,
	warn: clc.yellow,
	error: clc.red.bold,
	debug: clc.cyan,
	info: clc.cyan,
};

/**
 * Apply the console color to the actual consoles
 * @description Adds the timestamp & colors to the console function
 */
// ['log', 'warn', 'error', 'info', 'debug'].forEach(method => {
// 	const oldMethod = console[method].bind(console);
// 	console[method] = () => {
// 		const res = [];
// 		// eslint-disable-next-line no-undef
// 		for (const x in arguments) {
// 			// eslint-disable-next-line no-undef
// 			if (Object.prototype.hasOwnProperty.call(arguments, x)) res.push(arguments[x]);
// 		}
// 		// console.log(res);
// 		oldMethod.apply(
// 			console,
// 			[
// 				consoleColorMap[method](dateFormat(new Date(), 'ddd, mmm d yyyy h:MM:ss TT Z')),
// 				consoleColorMap[method](method),
// 				':',
// 			].concat(consoleColorMap[method](res.join(' ')))
// 		);
// 	};
// });

/**
 * @description Combine all the require config files.
 */
const envConfig = {
	production() {
		return require('./production')(winstonConfig);
	},
	development() {
		return require('./development')(winstonConfig);
	},
	staging() {
		return require('./staging')(winstonConfig);
	},
	local() {
		return require('./local')(winstonConfig);
	},
};

/**
 * @description LUSCA Express application security hardening.
 */
const luscaSecurity = () => {
	config.security.config = {
		csrf: false,
		xframe: 'SAMEORIGIN',
		p3p: 'ABCDEF',
		hsts: {
			maxAge: 31536000,
			includeSubDomains: true,
			preload: true,
		},
		xssProtection: true,
		nosniff: true,
	};
};

/**
 * @description It return true if the current system is production
 * @param {*} config
 */
const isProduction = config => {
	return config.name == 'production';
};

/**
 * @description It return true if the current system is production
 * @param {*} config
 */
const isStage = config => {
	return config.name == 'staging';
};
/**
 * @description It return true if the current system is production
 * @param {*} config
 */

const isDevelopement = config => {
	return config.name == 'development';
};

/**
 * @description Return the domain URI
 * @param {*} that is configuration
 */
const getDomainURL = that => {
	this.host = that.config.host;
	this.port = that.config.port;
	if (that.config.isProduction || that.config.isStage || that.config.isDevelopement) {
		return this.host;
	}
	return `${this.host}:${this.port}`;
};

/**
 * @description Return the domain URI
 * @param {*} that is configuration
 */
const optionsSMSconfigAPI = {
	uri: process.env.COVID19_SMS_CONFIG_API,
	method: 'GET',
	qs: {
		user: process.env.COVID19_SMS_CONFIG_USER,
		password: process.env.COVID19_SMS_CONFIG_PASSWORD,
		sid: process.env.COVID19_SMS_CONFIG_SID,
		fl: 0,
		gwid: 2,
	},
};

/**
 * @description Return the domain URI
 * @param {*} that is configuration
 */
const getEmployeeRegistrationURL = that => {
	return `http://${that.config.domainURL}/#!/home`;
};

/**
 * @description Attach the wiston logger to log the error through express access logs
 * @param {any} config Consists of the environment details of the server.
 */
const _attachExpressLogger = config => {
	const logLevels = winstonConfig.config.levels;
	// {
	//     console: "error",
	//     file: "error",
	//     mongodb: "error"
	// };
	if (!config.isProduction) {
		logLevels.console = 'info,silly,warning,debug';
	}
	config.app.use(
		expressWinston.logger({
			transports: [
				new winston.transports.File({
					level: logLevels.file,
					prettyPrint: true,
					// '/tmp/express.log', //path.join(_app.project.path.log, "express.log"),
					filename: path.join('/tmp/', 'express.log'),
					timestamp: true,
				}),
			],
		})
	);
};

/**
 * @description Attach the wiston logger to log the error through express
 *
 * @param {any} config config Consists of the environment details of the server.
 */
const _attachExpressErrorLogger = config => {
	// const server = _app;
	const logLevels = winstonConfig.config.levels;
	// {
	//     console: "error",
	//     file: "error",
	//     mongodb: "error"
	// };
	if (!config.isProduction) {
		logLevels.console = 'info,silly,warning,debug';
	}
	config.app.use(
		expressWinston.errorLogger({
			transports: [
				new winston.transports.Console({
					colorize: true,
					prettyPrint: true,
					label: 'express.error',
					eol: '\n',
					level: logLevels.console,
				}),
				new winston.transports.File({
					level: logLevels.file,
					eol: '\n',
					prettyPrint: true,
					filename: '/tmp/express-error.log', // path.join(_app.project.path.log, "express-error.log"),
					timestamp: true,
				}),
			],
		})
	);
};

/**
 * @description Set Config Object as the initial server starts.
 * @param {object} config Config object for further
 *
 * @return {Promise} Return new Promise
 */
const sync = {
	_config: {},
	_deasync: require('deasync'),
	_done: false,

	/**
	 * @description Sync for the config
	 * @params {function} callback
	 * @params {String} sleep
	 */
	do: (callback, sleep) => {
		this._done = false;
		callback(this);
		while (!this._done) {
			this._deasync.sleep(sleep || 100);
		}
	},

	/**
	 * @description Done for completion
	 */
	done: () => {
		this._done = true;
	},

	/**
	 * @description Configuration getting for the site
	 * @params {Object} config
	 */
	getConfig: () => this._config,

	/**
	 * @description Configuration setting for the site
	 * @params {Object} config
	 */
	setConfig: config => {
		this._config = config;
	},
};

/**
 * @description Set the config.
 * @param {Object} obj
 */
const setConfig = obj => {
	config = obj;
};

/**
 * @description Return the config.
 */
const getConfig = () => config;

/**
 * @exports : Exports the Config Environment based Configuration
 */
module.exports = {
	/**
	 * @description Setting the site configuration. Loading of the server starts here.
	 * @function {function} attach will wrap all configuration environment specific data,
	 * 			Domain URL, Redis, Mailer, AWS & logger
	 * @param {string} env Environment will state the environment to laod e.g.
	 * for production server it will be `production`
	 */
	set: (
		/**
		 * @description env argument for initializing the environment specific configuration
		 * @const {string} env : Environment varibale name
		 */
		env,

		/**
		 * @description loading the Environment configuration.
		 * @const{string} _app Express application instance
		 */
		_app
	) => {
		if (config == null) {
			// console.log("condfsdf")
			/**
			 * @description loading the Environment configuration if env varialble is set
			 * otherwise load the local configuration.
			 */
			this.config = typeof envConfig[env] !== 'undefined' ? envConfig[env]() : envConfig.local();

			/**
			 * @description Express application instance.
			 */
			this.config.app = _app;

			/**
		 * @description Allowed domains require the file which has the list of domains.
		 *
		 * @const{Object} this.config.subdomains set to the list of array list of subdomains
		 return 			 */
			// this.config.subdomainConfig = require("./static/subdomain");

			/**
			 * @description Verify & check if its production server.
			 * isProduction(this.config) passing the loadded configuration to the function
			 * to get if it's production or not.
			 * @const{Object} this.config.isProduction is set to Boolean `true`
			 */
			this.config.isProduction = isProduction(this.config);

			/**
			 * @description Verify & check if it's stage server.
			 * isStage(this.config) passing the loadded configuration to the function to get if it's stage or not.
			 * @const{Object} this.config.isStage is set to Boolean `true`
			 */
			this.config.isStage = isStage(this.config);

			/**
			 * @description Verify & check if it's stage server.
			 * isStage(this.config) passing the loadded configuration to the function to get if it's stage or not.
			 * @const{Object} this.config.isStage is set to Boolean `true`
			 */
			this.config.isDevelopement = isDevelopement(this.config);

			/**
			 * @description Private function to load express Error logger.
			 * @param {Object} this.config Object key to pass
			 */
			_attachExpressErrorLogger(this.config);

			/**
			 * @description Private function to load the express logger.
			 * @param {Object} this.config Object key to pass
			 */
			_attachExpressLogger(this.config);

			/**
			 * @description Environment name `ename`, Setting the ename will know which environment is loaded.
			 */
			this.ename = this.config.name ? this.config.name : '';

			/**
			 * @description Defining the domain URL.
			 * getDomainURL(this) Predefined domain configuration check.
			 * @param {Object} this Passing the config Object
			 */
			this.config.domainURL = getDomainURL(this);

			/**
			 * @description Static content through-out the site.
			 * @const{Object} staticContent
			 */
			// this.config.staticContent = staticContent;

			/**
			 * @description Static content through-out the site.
			 * @const{Object} this.config.redisClient
			 */
			this.config.redisClient = redis.createClient(
				this.config.redisClientConfig.port,
				this.config.redisClientConfig.redisEndPoint, {
					no_ready_check: true,
				}
			);

			/**
			 * @description SMS API {sms.domainAdda.com} configuration & settings
			 * @const{Object} optionsSMSconfigAPI, Specify the URL, Domain & query params
			 */
			this.config.optionsSMSconfigAPI = optionsSMSconfigAPI;

			/**
			 * @description SMS API {sms.domainAdda.com} configuration & settings
			 * @const{String} employeeRegistrationURL, 'Dynamic Registration link'
			 */
			this.config.employeeRegistrationURL = getEmployeeRegistrationURL(this);

			/**
			 * @description Mailer Transporter API {Gmail} configuration & settings
			 * @const{String} employeeRegistrationURL, 'Dynamic Registration link'
			 */
			this.config.aws = aws;

			let that = this.config; // .loggers;

			this.config.logger = console;
			// {
			// 	log: () => {
			// 		that.loggers.log;
			// 	},
			// 	info: () => {
			// 		that.loggers.info;
			// 	},
			// 	warn: () => {
			// 		that.loggers.warn;
			// 	},
			// 	debug: () => {
			// 		that.loggers.debug;
			// 	},
			// 	error: () => {
			// 		that.loggers.error;
			// 	},
			// 	trace: () => {
			// 		that.loggers.trace;
			// 	},
			// 	data: () => {
			// 		that.loggers.data;
			// 	},
			// 	silly: () => {
			// 		that.loggers.silly;
			// 	},
			// };

			this.config.logger;

			/**
			 * @description Initializing & Updating AWS S3 Bucket, Configuration setting local
			 *  directory for S3 Bucket folder
			 */
			this.config.aws.config.update({
				accessKeyId: this.config.awsConfig.accessKeyId,
				secretAccessKey: this.config.awsConfig.secretAccessKey,
				region: this.config.awsConfig.region,
				signatureVersion: 'v4',
			});

			// this.config.nodemailerTransport = setupMailTransporter(this);
			// this.config.sesMailTransporter = setupSESMailTransporter(this);
			// this.config.smsTransporter = setupSMSTransporter(this);

			/**
			 * @description Configuration seting the local directory for s3 folder
			 */
			if (!fs.existsSync(`./${this.config.awsConfig.s3ImagesLocal}`)) {
				fs.mkdir(this.config.awsConfig.s3ImagesLocal, (err, data) => {
					if (err) {
						console.log(
							`Error while creating the S3 local folder for the project: ${JSON.stringify(err)}, ${data}`
						);
					}
				});
			}

			/**
			 * @description Notify user regarding current setup e.g. local, development or production
			 */
			this.config.logger.info('Environment Set to:', this.ename);

			/**
			 * @description Require the database instance.
			 * @param {Object} this.config Pass the current config setup
			 */
			this.config.db = require('./database')(this.config);

			sync.setConfig(that);
			config = this.config;
			luscaSecurity();
		}

		setConfig(config);
		return config;
	},
	get: () => getConfig(),
	config,
};
/**
 * @file local.js
 *
 * Local development file is the default setup expected to have on a localmachine to work with the Production config
 *
 * @author  Dilip <dilip.more@bridgelabz.com>
 * @license ICS
 * @version 1.0
 */

const winston = require('winston');

/**
 * @exports : Exports developement Config Environment based Configuration
 *
 */
module.exports = config => {
	const DBDomain = process.env.COVID19_DB_PORT
		? `${process.env.COVID19_DB_HOST}:${process.env.COVID19_DB_PORT}`
		: `${process.env.COVID19_DB_HOST}`;
	const CREDENTIALS = `${process.env.COVID19_DB_USERNAME}:${process.env.COVID19_DB_PASSWORD}`;
	// const { logDir } = config;
	return {
		name: process.env.COVID19_ENV_SETUP,
		host: process.env.COVID19_DOMAIN,
		whiteListIP: [process.env.COVID19_WHITELIST_DOMAIN.split(' ')],
		port: process.env.NODE_PORT || 3030,
		awsConfig: {
			s3BucketName: process.env.COVID19_AWS_BUCKET_IMAGE,
			s3ImagesLocal: process.env.COVID19_AWS_BUCKET_IMAGE_LOCAL,
			accessKeyId: process.env.COVID19_AWS_BUCKET_IMAGE_ACCESS_KEY_ID,
			secretAccessKey: process.env.COVID19_AWS_BUCKET_IMAGE_SECRET_ACCESS_KEY,
			region: process.env.COVID19_AWS_BUCKET_IMAGE_REGION,
		},
		session: {
			key: process.env.COVID19_SESSION_ID,
			secret: process.env.COVID19_SESSION_SECRET,
		},
		redisClientConfig: {
			redisEndPoint: process.env.COVID19_CACHE_REDIS_HOST,
			port: process.env.COVID19_CACHE_REDIS_PORT,
			flushRedisOnServerRestart: true,
		},
		security: {
			application: () => this,
			config: null,
		},
		swagger: true,
		database: {
			debug: true,
			mongodb: {
				name: process.env.COVID19_DB_NAME,
				dbURI: `mongodb+srv://${CREDENTIALS}@${DBDomain}/${process.env.COVID19_DB_NAME}`,
				username: process.env.COVID19_DB_USERNAME,
				password: process.env.COVID19_DB_PASSWORD,
			},
		},
		loggers: winston.createLogger({
			// 'exceptionHandlers': [
			// 	new(winston.transports.Console)({
			// 		'json': true
			// 	}),
			// 	new(winston.transports.File)({
			// 		'level'				: 'error,warn',
			// 		'filename'			: path.join(logDir, '/exception.log'),
			// 		'handleExceptions'	: true,
			// 		'json'				: true,
			// 		'maxsize'			: 5242880, //5MB
			// 		'maxFiles'			: 5,
			// 		'prettyPrint'		: true,
			// 		'zippedArchive'		: true,
			// 		'colorize'			: 'all',
			// 		'eol'				: '\n',
			// 		'timestamp': () => {
			// 			return '' + dateFormat(new Date(), 'ddd mmm d yyyy HH:MM:ss TT') + '';
			// 		},
			// 		'formatter': (options) => {
			// 			// Return string will be passed to logger.
			// 			const message = options.timestamp() + ' [' + options.level.toUpperCase() + '] - '
			//							+ (undefined !== options.message ? options.message : '') +
			// 							(options.meta && Object.keys(options.meta).length ? '\n\t'
			//							+ JSON.stringify(options.meta) : '');
			// 			return winston.config.colorize(options.level, message);
			// 		}
			// 	})
			// ],
			levels: winston.config.syslog.levels,
			defaultMeta: { component: 'user-service' },
			format: winston.format.combine(
				winston.format.timestamp({
					format: 'YYYY-MM-DD HH:mm:ss',
				}),
				winston.format.json()
			),
			transports: [new winston.transports.Console(), new winston.transports.File({ filename: 'combined.log' })],
			exitOnError: false,
			colors: config.colors,
		}),
		stream: {
			write: (message, encoding) => {
				this.loggers.info(message, encoding);
			},
		},
	};
};

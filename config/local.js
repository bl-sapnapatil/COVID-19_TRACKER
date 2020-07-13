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
const path = require('path');

const logFormat = winston.format.combine(
	winston.format.colorize(),
	winston.format.timestamp(),
	winston.format.align(),
	winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
);
/**
 * @exports : Exports developement Config Environment based Configuration
 *
 */
module.exports = config => {
	const DBDomain = process.env.COVID19_DB_PORT
		? `${process.env.COVID19_DB_HOST}:${process.env.COVID19_DB_PORT}`
		: `${process.env.COVID19_DB_HOST}`;
	const CREDENTIALS = `${process.env.COVID19_DB_USERNAME}:${process.env.COVID19_DB_PASSWORD}`;
	//const { logDir } = config;
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
				dbFullURL: process.env.COVID19_DB_URL,
				host: process.env.COVID19_DB_HOST,
				name: process.env.COVID19_DB_NAME,
				dbURI: `mongodb+srv://${CREDENTIALS}@${DBDomain}${process.env.COVID19_DB_NAME}`,
				username: process.env.COVID19_DB_USERNAME,
				password: process.env.COVID19_DB_PASSWORD,
			},
		},
		loggers: winston.createLogger({
			transports: [
				new winston.transports.Console({
					format: logFormat,
				}),
				new winston.transports.File({
					filename: path.join(__dirname, '../logs/error.log'),
					level: 'info,error,debug,warn',
					maxsize: 500,
				}),
			],
		}),
	};
};

/**
 * Covid19-Tracker-Backend Swagger API
 * @author  Dilip <dilip.more@bridgelabz.com>
 * @license ICS
 * @version 1.0
 */

/*
 * @description Module dependencies
 */
module.exports = config => {
	if (typeof config.mongodb !== undefined) {
		return require('./mongodb').init(config);
	}
	config.logger.error('Database configuration for mongodb not set');
};

const redis = require('../services/cacheService');
const config = require('../../config').get();
const { COVID19_STATE_STATS_CACHEKEY } = require('../../redisKey');

/**
 * @description Winston logger derived from the config
 */
const { loggers } = config;

class CacheController {
	/**
	 *@description cacheStates API is used for retrieving list of all states wise in cache.
	 */
	cacheStates(req, res, next) {
		redis.get(COVID19_STATE_STATS_CACHEKEY, (err, data) => {
			if (err) {
				res.status(422).send(err);
			} else {
				if (data == null) {
					loggers.error('Data not found in cache');
					next();
				} else {
					loggers.info('Data found in cache');
					res.status(200).send(JSON.parse(data));
				}
			}
		});
	}
}
module.exports = new CacheController();

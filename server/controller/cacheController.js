const redis = require('../services/cacheService');

class CacheController {
	/**
	 *@description cacheStates API is used for retrieving list of all states wise in cache.
	 */
	cacheStates(req, res, next) {
		let key = 'getStatesData';

		//get method is used to retreiving data from radis
		redis.get(key, (err, data) => {
			if (err) {
				res.status(422).send(err);
			} else {
				if (data == null) {
					console.log('Data not found in cache');
					next();
				} else {
					console.log('Data found in cache');
					res.status(200).send(JSON.parse(data));
				}
			}
		});
	}
}
module.exports = new CacheController();

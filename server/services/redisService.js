let caching = require('../../config/database/caching');

class RedisService {
	set(redisKey, value, callback) {
		// caching.client.auth(process.env.COVID19_CACHE_REDIS_PASSWORD);
		caching.client.set(redisKey, value, (error, data) => {
			if (error) {
				return callback(error);
			} else {
				return callback(data);
			}
		});
	}
	get(redisKey, callback) {
		// caching.client.auth(process.env.COVID19_CACHE_REDIS_PASSWORD);
		caching.client.get(redisKey, (error, response) => {
			if (error) {
				return callback(error);
			} else {
				return callback(response);
			}
		});
	}

	delete(redisKey, callback) {
		caching.client.del(redisKey, (error, response) => {
			if (error) {
				return callback(error);
			} else {
				return callback(response);
			}
		});
	}
}

module.exports = new RedisService();

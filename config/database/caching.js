/*******************************************************************************************
 * @Purpose   : Redis Connection
 * @file      : redisServer.js
 * @overview  : To connect redis server
 * @author    : Sindooja Gajam
 * @since     : 09/07/2020
 *******************************************************************************************/

let redis = require('redis');

class Caching {
	constructor() {
		this.client = redis.createClient({
			port: process.env.COVID19_CACHE_REDIS_PORT,
			host: process.env.COVID19_CACHE_REDIS_HOST,
		});
		this.client.auth(process.env.COVID19_CACHE_REDIS_PASSWORD);
	}

	connect() {
		this.monitor();
	}

	monitor() {
		this.client.on('connect', function() {
			console.log('Redis client connected successfully');
		});

		this.client.on('reconnecting', function() {
			console.log('Redis client is reconnecting..');
		});

		this.client.on('warning', function() {
			console.log('Redis client is emmiting some deprecating warnings..');
		});

		this.client.on('error', function(err) {
			console.error('Something went wrong ' + err);
		});

		this.client.on('end', function() {
			console.log('Redis client disconnected');
		});
		this.client.on('ready', function() {
			console.log('Redis client is ready now..');
		});
	}
}
module.exports = new Caching(this.client);

/*******************************************************************************************
 * @Purpose   : Define cache
 * @file      : cache.js
 * @overview  :
 * @author    : PRAVIN DESHMUKH
 * @since     : 06/07/2020
 *******************************************************************************************/
/**
 *@description Dependencies are installed for execution.
 */

const redis = require("redis");
const e = require("express");
const redisClient = redis.createClient();

/**
 *@description Redis connection is initialized.
 */
redisClient.on("connect", () => {
  console.log("Redis clent connected..");
});
redisClient.on("error", (err) => {
  console.log("something went wrong", err);
});

class CacheService {
  /**
   *@description Key value pair is set in Redis.
   */
  set(key, value, callback) {
    redisClient.set(key, value, (err, result) => {
      if (err) {
        callback(err);
      } else {
        callback(null, result);
      }
    });
  }

  /**
   *@description Key value pair is retreived from Redis.
   */
  get(key, callback) {
    redisClient.get(key, (err, result) => {
      if (err) {
        callback(err);
      } else {
        callback(null, result);
      }
    });
  }
}
module.exports = new CacheService();

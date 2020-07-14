/*******************************************************************************************
 * @Purpose   : Api class
 * @file      : api.js
 * @overview  : API class to get data
 * @author    : Sindooja Gajam
 * @since     : 09/07/2020
 *******************************************************************************************/
/**
 * @description Dependencies are installed for execution.
 */

const mongoo = require('../../config/database/mongodb');
const config = require('../../config').get();
const dbName = process.env.COVID19_DB_NAME;
const collectionName = process.env.COLLECTION_NAME;
const mongoose = mongoo.mongoose;
const { logger } = config;

class Api {
	async getData() {
		console.log('mongoose data', dbName);
		const result = await mongoose
			.db(dbName)
			.collection(collectionName)
			.find()
			.toArray();
		console.log('result 99', result[99]);
		return result;
	}

	async getSearch(request) {
		// console.log('in search', mongoose);
		logger.info('in service logger');
		const result = await mongoose
			.db(dbName)
			.collection(collectionName)
			.find({
				detecteddistrict: request.value,
				// $and: [
				// 	{
				// 		// eslint-disable-next-line prettier/prettier
				// 		$or: [
				// 			{ detecteddistrict: { $regex: request.value } },
				// 			{ detectedstate: { $regex: request.value } },
				// 		],
				// 	},
				// ],
			})
			.toArray();
		console.log('result', result);
		return result;
	}
}

module.exports = new Api();

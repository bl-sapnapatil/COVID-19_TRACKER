/*******************************************************************************************
 * @Purpose   : Database Connection to define url of database through dotenv file
 * @file      : mongoService.js
 * @overview  : for database connection used moongoose
 * @author    : PRAVIN DESHMUKH
 * @since     : 06/07/2020
 *******************************************************************************************/
/**
 * @description Dependencies are installed for execution.
 */
const MongoClient = require('mongodb').MongoClient;

// const MongoClient = mongodb.MongoClient;
require('dotenv').config();
const dbUrl = process.env.COVID19_DB_URL;
const dbName = process.env.DB_NAME;
const collectionName = process.env.COLLECTION_NAME;

class MongoServices {
	async getData() {
		const client = await MongoClient.connect(dbUrl, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		const result = await client
			.db(dbName)
			.collection(collectionName)
			.find()
			.toArray();
		console.log('result');
		console.log('result---------->', result);
		return result;
	}

	async getSearch(request) {
		console.log('in search', request.value);
		const client = await MongoClient.connect(dbUrl, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		const result = await client
			.db(dbName)
			.collection(collectionName)
			.find({
				$and: [
					{
						// eslint-disable-next-line prettier/prettier
						$or: [
							{ detecteddistrict: { $regex: request.value } },
							{ detectedstate: { $regex: request.value } },
						],
					},
				],
			})
			.toArray();
		console.log('result', result.length);
		return result;
	}
}

module.exports = new MongoServices();

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
const dbUrl = process.env.MONGO_DB_URL;
const dbName = process.env.DB_NAME;
const collectionName = process.env.COLLECTION_NAME;

class MongoServices {
	constructor() {
		this.client = MongoClient.connect(dbUrl, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
	}
	async getData() {
		console.log('in getData');
		const result = await this.client
			.db(dbName)
			.collection(collectionName)
			.find()
			.limit(100)
			.toArray();
		console.log('result---------->', result);
		return result;
	}

	async getSearch(request) {
		console.log('in search', request);
		const result = await this.client
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
		console.log('result', result);
		return result;
	}
}

module.exports = new MongoServices();

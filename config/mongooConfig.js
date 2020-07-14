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
const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;
require('dotenv').config();
const dbUrl = process.env.MONGO_DB_URL;
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
			.limit(100)
			.toArray();

		await client.close();
		return result;
	}
	async getSortDataWise(req) {
		let date = req.query;
		const client = await MongoClient.connect(dbUrl, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		const result = await client
			.db(dbName)
			.collection(collectionName)
			.find({ dateannounced: { $gte: '30/01/2020', $lte: '31/02/2020' } })
			.toArray();
		await client.close();
		console.log('mongo', result);
		return result;
	}
}

module.exports = new MongoServices();

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
const dbName = process.env.COVID19_DB_NAME;
const collectionName = process.env.COLLECTION_NAME;
const mongoose = mongoo.mongoose;

class Api {
	async getData() {
		console.log('mongoose data', mongoose);
		const result = await mongoose
			.db(dbName)
			.collection(collectionName)
			.find()
			.toArray();
		console.log('result 99', result[99]);
		await mongoose.close();
		return result;
	}
}

module.exports = new Api();

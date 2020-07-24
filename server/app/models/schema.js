/*******************************************************************************************
 * @Purpose   : Database Connection to define url of database through dotenv file
 * @file      : mongoService.js
 * @overview  : for database connection used moongoose
 * @author    : SINDOOJA GAJAM
 * @since     : 09/07/2020
 *******************************************************************************************/

const mongoose = require('mongoose');
const config = require('../../../config').get();
const { logger } = config;
var Schema = mongoose.Schema;
var Covid19_Data = mongoose.model(
	'Covid19_Data',
	new Schema().set('toJSON', {
		virtuals: true,
		transform: function(doc, ret, field) {
			ret.Covid19_DataObjectId = ret._id;
			delete ret._id;
			delete ret.__v;
			delete ret.id;
			return ret;
		}
	}),
	'india_raw_data'
);

class casesModel {
	async getData(page = 1) {
		const PAGE_SIZE = 10000;                     // Similar to 'limit'
        const skip = (page - 1) * PAGE_SIZE;		 // For page 1, the skip is: (1 - 1) * 20 => 0 * 20 = 0
		const data = await Covid19_Data.find().skip(skip)        // Always use 'skip' first
		.limit(PAGE_SIZE)
		.exec();
		// get total documents in the Posts collection 
		const count = await Covid19_Data.countDocuments();
		console.log(page);
		return ({
			data,
			totalPages: Math.ceil(count / PAGE_SIZE),
			currentPage: page
		  });
		// .aggregate([
        //     { $match: {} },
        //     { $skip: (page - 1) * PAGE_SIZE },
        //     { $limit: PAGE_SIZE },
        // ])
		
	}
}
module.exports = new casesModel();

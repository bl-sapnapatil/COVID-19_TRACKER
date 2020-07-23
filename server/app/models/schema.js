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
	getData() {
		return Covid19_Data.find().limit(100);
	}
}
module.exports = new casesModel();

const mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Covid19 = mongoose.model('Covid19', new Schema(), 'india_raw_data');
class casesModel {
	/**
	 * @description casesModel return the all cases found in db.
	 */
	getAllData() {
		return Covid19.find()
			.then(result => {
				return result;
			})
			.catch(err => {
				return err;
			});
	}
	getDateWiseData(query) {
		return Covid19.find(query)
			.then(result => {
				return result;
			})
			.catch(err => {
				return err;
			});
	}
}
module.exports = new casesModel();

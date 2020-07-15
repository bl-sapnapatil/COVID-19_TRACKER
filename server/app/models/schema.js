const mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Test = mongoose.model('Test', new Schema(), 'india_raw_data');
class casesModel {
	/**
	 * @description casesModel return the all cases found in db.
	 */
	getAllData() {
		return Test.find()
			.then(result => {
				return result;
			})
			.catch(err => {
				return err;
			});
	}
	getDateWiseData(query) {
		return Test.find(query)
			.then(result => {
				return result;
			})
			.catch(err => {
				return err;
			});
	}
}
module.exports = new casesModel();

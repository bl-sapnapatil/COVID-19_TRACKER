/*******************************************************************************************
 * @Purpose   : Get Data of searched value
 * @file      : stateService.js
 * @overview  : Get data according to search value
 * @author    : SINDOOJA GAJAM
 * @since     : 08/07/2020
 *******************************************************************************************/

const mongooservice = require('../../config/mongooConfig');

class SearchService {
	async getSearch() {
		console.log('called service');

		let result = await mongooservice.getData();
		return result;
	}
}

module.exports = new SearchService();

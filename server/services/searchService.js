/*******************************************************************************************
 * @Purpose   : Get Data of searched value
 * @file      : stateService.js
 * @overview  : Get data according to search value
 * @author    : SINDOOJA GAJAM
 * @since     : 08/07/2020
 *******************************************************************************************/

const mongooservice = require('../../config/mongooConfig');
// const Client = require('@elastic/elasticsearch');
// const client = new Client({
// 	node: 'http://localhost:9200',
// });
class SearchService {
	async getSearch(request) {
		console.log('called service');
		let result = await mongooservice.getSearch(request);
		return result;
	}
}

module.exports = new SearchService();

/*******************************************************************************************
 * @Purpose   : Get Data of searched value
 * @file      : stateService.js
 * @overview  : Get data according to search value
 * @author    : SINDOOJA GAJAM
 * @since     : 08/07/2020
 *******************************************************************************************/

const mongooservice = require('../../config/mongooConfig');
// const mongooservice = require('../api/api');
const { Client } = require('@elastic/elasticsearch');
const client = new Client({
	node: 'http://localhost:9200',
});

class SearchService {
	async getSearch(request) {
		let result = await mongooservice.getSearch(request);
		const body = await result.flatMap((doc, index) => [{ index: { _index: 'COVID19' } }, doc]);
		const { response } = await client.bulk({ body: body, refresh: true });
		if (response) {
			console.log('sklsndklnsklnkl', response.error);
		}
		return result;
	}
}

module.exports = new SearchService();

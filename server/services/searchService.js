/*******************************************************************************************
 * @Purpose   : Get Data of searched value
 * @file      : stateService.js
 * @overview  : Get data according to search value from Elasticsearch
 * @author    : SINDOOJA GAJAM
 * @since     : 08/07/2020
 *******************************************************************************************/

const { Client } = require('@elastic/elasticsearch');
const client = new Client({
	node: 'http://localhost:9200',
	maxRetries: 5,
	requestTimeout: 60000
});
const config = require('../../config').get();
const { logger } = config;

class SearchService {
	async getSearch(request, callback) {
		client.search(
			{
				index: 'covid19_data',
				body: {
					query: {
						bool:{
							should: [
								{
									match: {
										detectedstate:  request.value
									},
								},
								{
									match: {
										detecteddistrict: request.value
									}
								}
							]
						}
					},
				},
			},
			(error, response) => {
				if (error) {
					return callback(error);
				} else {
					return callback(null, response.body.hits.hits);
				}
			}
		);
	}
}

module.exports = new SearchService();

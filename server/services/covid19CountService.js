/*******************************************************************************************
 * @Purpose   : Get Count of active, recovered and deceased
 * @file      : covid19CountService.js
 * @overview  : Count of active, recovered and deceased patients
 * @author    : SINDOOJA GAJAM
 * @since     : 08/07/2020
 *******************************************************************************************/
const cron = require('node-cron');
const models = require('../app/models/schema');
const redisService = require('./redisService');
const config = require('../../config').get();
const { Client } = require('@elastic/elasticsearch');
const client = new Client({
	node: 'http://localhost:9200',
	maxRetries: 5,
	requestTimeout: 60000
});
const { logger } = config;

class Covid19CountService {
	constructor() {
		this.countSchedule();
	}

	async getAllCount() {
		let activeCount = 0,
			recoveredCount = 0,
			deceasedCount = 0,
			count = {},
			covid19_data = [];
		// eslint-disable-next-line prettier/prettier
		let result = await models.getData();
		await result.data.map(element => {
			covid19_data.push(element);
		});
		client.ping(
			{},
			{
				// ping usually has a 3000ms timeout
				requestTimeout: 20000,
				// undocumented params are appended to the query string
				hello: 'elasticsearch!'
			},
			function(error, response) {
				if (error) {
					logger.error('Cannot connect to Elasticsearch.', error);
				} else {
					logger.info('Connection to Elasticsearch was successful!');
				}
			}
		);
		const body = await covid19_data.flatMap((doc, index) => [
			{ index: { _index: 'covid19_data', _id: doc._id } },
			doc
		]);

		client.bulk({ body: body, refresh: true }, function(error, response) {
			if (error) {
				logger.error(error);
			} else {
				logger.info(response);
			}
		});
		let covid19Data = JSON.parse(JSON.stringify(covid19_data));
		covid19Data.forEach(element => {
			if (element.currentstatus === 'Recovered') {
				recoveredCount = recoveredCount + 1;
			}
			if (element.currentstatus === 'Hospitalized') {
				activeCount = activeCount + 1;
			}
			if (element.currentstatus === 'Deceased') {
				deceasedCount = deceasedCount + 1;
			}
		});

		count = {
			recoveredCount: recoveredCount,
			activeCount: activeCount,
			deceasedCount: deceasedCount,
			totalPages: result.totalPages,
			currentPage: result.currentPage,
		};
		
		// eslint-disable-next-line no-unused-vars
		await redisService.set(
			'COVID19_COUNT',
			JSON.stringify(count),
			response => {
				return {
					success: true,
					message: 'success',
					data: count
				};
			}
		);
	}

	countSchedule() {
		//will run every day at 12:00 AM
		cron.schedule('0 0 0 * * *', () => {
			console.log('running a task every minute');
			this.getAllCount();
		});
	}

}
// let covidCount = new Covid19CountService();
// covidCount.countSchedule();
module.exports = new Covid19CountService();

/*******************************************************************************************
 * @Purpose   : Get Count of active, recovered and deceased
 * @file      : stateService.js
 * @overview  : Count of active, recovered and deceased patients
 * @author    : SINDOOJA GAJAM
 * @since     : 08/07/2020
 *******************************************************************************************/
const cron = require('node-cron');
const mongooservice = require('../../config/mongooConfig');
const redisService = require('./redisService');
// const mongooservice = require('../api/api');

class Covid19CountService {
	async getAllCount() {
		let activeCount = 0,
			recoveredCount = 0,
			deceasedCount = 0,
			count = {};
		// eslint-disable-next-line prettier/prettier
		let result = await mongooservice.getData();
		console.log('in service', result);
		result.map(data => {
			console.log(data);
		});
		for (var data in result) {
			if (result[data].currentstatus === 'Recovered') {
				recoveredCount = recoveredCount + 1;
			}
			if (result[data].currentstatus === 'Hospitalized') {
				activeCount = activeCount + 1;
			}
			if (result[data].currentstatus === 'Deceased') {
				deceasedCount = deceasedCount + 1;
			}
		}
		count = {
			recoveredCount: recoveredCount,
			activeCount: activeCount,
			deceasedCount: deceasedCount,
		};

		// eslint-disable-next-line no-unused-vars
		redisService.set('COVID19_COUNT', JSON.stringify(count), response => {
			console.log('response', response);
			return {
				success: true,
				message: 'success',
				data: count,
			};
		});
	}

	countSchedule() {
		cron.schedule('0 0 0 * * *', () => {
			console.log('running a task every minute');
			this.getAllCount();
		});
	}
}
let covidCount = new Covid19CountService();
covidCount.countSchedule();
module.exports = new Covid19CountService();

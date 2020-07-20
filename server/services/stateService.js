/*******************************************************************************************
 * @Purpose   : sort state wise data
 * @file      : stateService.js
 * @overview  : sort the state  as per current status
 * @author    : PRAVIN DESHMUKH
 * @since     : 06/07/2020
 *******************************************************************************************/

const covidModel = require('../app/models/schema');
const redisService = require('../services/cacheService');
const { COVID19_STATE_STATS_CACHEKEY } = require('../../redisKey');
const config = require('../../config').get();
const dateFormat = require('dateformat');
/**
 * @description Winston logger derived from the config
 */
const { loggers } = config;

class StateService {
	/**
	 * @description get state data returns a promise which is either resolved/rejected.
	 */
	getStateData() {
		return new Promise((resolve, reject) => {
			covidModel
				.getAllData()
				.then(result => {
					this.getStateStats(result)
						.then(response => {
							redisService.set(
								COVID19_STATE_STATS_CACHEKEY,
								JSON.stringify(response),
								(error, result) => {
									if (error) {
										loggers.error('error', error);
										return reject(error);
									} else {
										loggers.info('Success get all state wise data', result);
										return resolve(response);
									}
								}
							);
						})
						.catch(error => {
							return reject(error);
						});
				})
				.catch(err => {
					return reject(err);
				});
		});
	}

	/**
	 * @description get date stats returns a promise which is either resolved/rejected.
	 */
	getDateStateStats(startDate) {
		let endDate = dateFormat(new Date(), 'dd/mm/yyyy');

		return new Promise((resolve, reject) => {
			let query = { statuschangedate: { $gte: startDate, $lte: endDate } };
			covidModel
				.getDateWiseData(query)
				.then(result => {
					this.getStateStats(result)
						.then(response => {
							return resolve(response);
						})
						.catch(err => {
							return reject(err);
						});
				})
				.catch(err => {
					reject(err);
				});
		});
	}

	/**
	 * @description filter data function return state wise count
	 * @description map:-get two field into result array.
	 * @description set:-using set get unique state name
	 * @description if :- if state in statesArray matches with an completedData state then check
	 * 						completeData of currentStatus and increment count.
	 */
	async getStateStats(data) {
		let casesRecord = {};
		let activeCount = 0;
		let recoveredCount = 0;
		let deathCount = 0;
		let statesArray = [];
		let finalRecord = [];
		let completeData = [];

		let result = await JSON.parse(JSON.stringify(data));
		completeData = await result.map(({ detectedstate, currentstatus }) => ({
			detectedstate,
			currentstatus,
		}));
		statesArray = [...new Set(completeData.map(data => data.detectedstate))];

		for (let state in statesArray) {
			for (let data in completeData) {
				if (statesArray[state] == completeData[data].detectedstate) {
					if (completeData[data].currentstatus == 'Recovered') {
						recoveredCount++;
					}
					if (completeData[data].currentstatus == 'Hospitalized') {
						activeCount++;
					}
					if (completeData[data].currentstatus == 'Deceased') {
						deathCount++;
					}
				}
			}
			casesRecord = {
				stateName: statesArray[state],
				recover: recoveredCount,
				active: activeCount,
				death: deathCount,
				total: recoveredCount + activeCount + deathCount,
			};
			finalRecord.push(casesRecord);
			activeCount = 0;
			recoveredCount = 0;
			deathCount = 0;
		}
		let response = {
			sucess: 'true',
			message: 'success',
			stateData: finalRecord,
		};
		return response;
	}
}
module.exports = new StateService();

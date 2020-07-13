/*******************************************************************************************
 * @Purpose   : sort state wise data
 * @file      : stateService.js
 * @overview  : sort the state  as per current status
 * @author    : PRAVIN DESHMUKH
 * @since     : 06/07/2020
 *******************************************************************************************/

const mongooservice = require('../../config/mongooConfig');
const redisService = require('../services/cacheService');
const { COVID19_STATE_STATS_CACHEKEY } = require('../../redisKey');
const config = require('../../config').get();
/**
 * @description Winston logger derived from the config
 */
const { loggers } = config;

class StateService {
	/**
	 * @description State service async returns a promise which is either resolved/rejected.
	 * @description map:-get two field into result array.
	 * @description set:-using set get unique state name
	 * @description if :- if state in statesArray matches with an completedData state then check
	 * 						completeData of currentStatus and increment count.
	 */
	getStateData() {
		return new Promise((resolve, reject) => {
			let casesRecord = {};
			let activeCount = 0;
			let recoveredCount = 0;
			let deathCount = 0;
			let statesArray = [];
			let finalRecord = [];
			let completeData = [];
			mongooservice
				.getData()
				.then(result => {
					completeData = result.map(({ detectedstate, currentstatus }) => ({
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
					redisService.set(COVID19_STATE_STATS_CACHEKEY, JSON.stringify(response), (error, result) => {
						if (error) {
							loggers.info('error', error);
						} else {
							loggers.info('Success get all state wise data', result);
						}
					});
					resolve(response);
				})
				.catch(err => {
					reject(err);
				});
		});
	}
}
module.exports = new StateService();

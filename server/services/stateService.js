/*******************************************************************************************
 * @Purpose   : sort state wise data
 * @file      : stateService.js
 * @overview  : sort the state  as per current status
 * @author    : PRAVIN DESHMUKH
 * @since     : 06/07/2020
 *******************************************************************************************/

const mongooservice = require('../../config/mongooConfig');
const redis = require('../services/cacheService');
class StateService {
	/**
	 * @description State service async returns a promise which is either resolved/rejected.
	 *
	 */
	async getStateData() {
		let casesRecord = {};

		let activeCount = 0;
		let recoveredCount = 0;
		let deathCount = 0;
		let statesArray = [];
		let finalRecord = [];
		let completeData = [];

		let result = await mongooservice.getData();

		// get two field into result array.
		completeData = result.map(({ detectedstate, currentstatus }) => ({
			detectedstate,
			currentstatus,
		}));

		// using set get unique state name
		statesArray = [...new Set(completeData.map(data => data.detectedstate))];

		for (let state in statesArray) {
			for (let data in completeData) {
				if (statesArray[state] == completeData[data].detectedstate) {
					// if state in statesArray matches with an completedData state then check
					// completeData of currentStatus and increment count.
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
		let key = 'COVID19_STATEDATA';
		redis.set(key, JSON.stringify(finalRecord), error => {
			if (error) {
				console.log('error', error);
			} else {
				console.log('Success get all state wise data');
			}
		});
		let response = {
			sucess: 'true',
			message: 'success',
			stateData: finalRecord,
		};
		return { response };
	}
}

module.exports = new StateService();

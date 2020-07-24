/**********************************************************************************************************
 * Purpose    : Request and send the Response to user
 * @file      : countController.js
 * @overview  : Pass request to services layer and send response form service layer
 * @author    : SINDOOJA GAJAM
 * @since     : 08/07/2020
 *********************************************************************************************************/

const service = require('../services/covid19CountService');
const redisService = require('../services/redisService');
const responseObject = require('../constant/static');

class Covid19CountController {
	/**
	 * register controller to pass request to register service
	 * @param {httpRequest} req
	 * @param {httpResponse} res
	 */
	async getAllCount(req, res) {
		try {
			let result = {};
			await service
				.getAllCount()
				// eslint-disable-next-line no-unused-vars
				.then(data => {
					redisService.get('COVID19_COUNT', covid19Count => {
						result.body = responseObject.successObject;
						result.data = JSON.parse(covid19Count);
						return res.status(responseObject.successObject.statusCode).send(result);
					});
				})
				.catch(error => {
					result.body = responseObject.errorObject;
					result.error = error;
					return res.status(responseObject.errorObject.statusCode).send(result);
				});
		} catch (error) {
			return res.status(422).send(error);
		}
	}
}

module.exports = new Covid19CountController();

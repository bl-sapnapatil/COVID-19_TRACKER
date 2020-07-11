/**********************************************************************************************************
 * Purpose    : Request and send the Response to user
 * @file      : countController.js
 * @overview  : Pass request to services layer and send response form service layer
 * @author    : SINDOOJA GAJAM
 * @since     : 08/07/2020
 *********************************************************************************************************/

const service = require('../services/covid19CountService');
const redisService = require('../services/redisService');

class Covid19CountController {
	/**
	 * register controller to pass request to register service
	 * @param {httpRequest} req
	 * @param {httpResponse} res
	 */
	async getAllCount(req, res) {
		try {
			if (req.body === undefined) throw 'Request body cannot be undefined';
			await service
				.getAllCount()
				// eslint-disable-next-line no-unused-vars
				.then(data => {
					let result = {};
					redisService.get('covid19Count', covid19Count => {
						result.success = true;
						result.message = 'Successfully got data';
						result.data = JSON.parse(covid19Count);
						return res.status(200).send(result);
					});
				})
				.catch(error => {
					return res.status(400).send(error);
				});
		} catch (error) {
			return res.status(422).send(error);
		}
	}
}

module.exports = new Covid19CountController();

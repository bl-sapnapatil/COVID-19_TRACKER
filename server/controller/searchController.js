/**********************************************************************************************************
 * Purpose    : Request and send the Response to user
 * @file      : searchController.js
 * @overview  : Pass request to services layer and send response form service layer
 * @author    : SINDOOJA GAJAM
 * @since     : 08/07/2020
 *********************************************************************************************************/
const service = require('../services/searchService');
const responseObject = require('../constant/static');
const config = require('../../config').get();
const { logger } = config;

class searchController {
	/**
	 * register controller to pass request to register service
	 * @param {httpRequest} req
	 * @param {httpResponse} res
	 */

	async getSearchData(req, res) {
		try {
			let response = {};
			if (req.body.value === undefined)
				throw 'Request body cannot be undefined';
			if (req.body.value === null) throw 'Request body cannot be null';
			if (req.body.value.length === 0)
				throw 'Request body cannot be empty';
			let request = {
				value: req.body.value
			};
			logger.info('request===================>',request);
			await service.getSearch(request, (error, result) => {
				if (error) {
					logger.error('error---------------->', error);
					response.body = responseObject.errorObject;
					response.error = error;
					return res.status(400).send(response);
				} else {
					logger.info(
						'result ---------------->',
						JSON.stringify(result)
					);
					if ( result.length !== 0 ) {
						response.body = responseObject.successObject;
						response.data = result;
						return res.status(responseObject.successObject.statusCode).send(response);
					} else {
						response.body = responseObject.dataNotFound;
						response.data = result;
						return res.status(responseObject.dataNotFound.statusCode).send(response);
					}
				}
			});
		} catch (error) {
			let response = {
				success: false,
				error: error,
				message: 'Error while getting data'
			};
			return res.status(422).send(response);
		}
	}
}

module.exports = new searchController();

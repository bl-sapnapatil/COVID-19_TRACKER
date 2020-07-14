/**********************************************************************************************************
 * Purpose    : Request and send the Response to user
 * @file      : searchController.js
 * @overview  : Pass request to services layer and send response form service layer
 * @author    : SINDOOJA GAJAM
 * @since     : 08/07/2020
 *********************************************************************************************************/
const service = require('../services/searchService');

class searchController {
	/**
	 * register controller to pass request to register service
	 * @param {httpRequest} req
	 * @param {httpResponse} res
	 */

	async getSearchData(req, res) {
		try {
			let response = {};
			if (req.body.value === undefined) throw 'Request body cannot be undefined';
			if (req.body.value === null) throw 'Request body cannot be null';
			if (req.body.value.length === 0) throw 'Request body cannot be empty';
			let request = {
				value: req.body.value,
			};
			await service
				.getSearch(request)
				.then(result => {
					response.success = true;
					response.data = result;
					response.message = 'Successfully got data';
					return res.status(200).send(response);
				})
				.catch(error => {
					console.error('error---------------->', error);
					response.success = false;
					response.error = error;
					response.message = 'Error while getting data';
					return res.status(400).send(response);
				});
		} catch (error) {
			let response = {
				success: false,
				error: error,
				message: 'Error while getting data',
			};
			return res.status(422).send(response);
		}
	}
}

module.exports = new searchController();

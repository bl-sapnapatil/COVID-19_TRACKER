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
			if (req.body.value === undefined) throw 'Request body cannot be undefined';
			if (req.body.value === null) throw 'Request body cannot be null';
			if (req.body.value.length === 0) throw 'Request body cannot be empty';
			let request = {
				value: req.body.value,
			};
			await service
				.getSearch(request)
				.then(data => {
					res.status(200).send(data);
				})
				.catch(error => {
					res.status(400).send(error);
				});
		} catch (error) {
			res.status(422).send(error);
		}
	}
}

module.exports = new searchController();

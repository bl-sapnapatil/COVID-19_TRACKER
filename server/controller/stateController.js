/**********************************************************************************************************
 * Purpose    : Read the user Input as Request and send the Respose to user
 * @file      : stateController.js
 * @overview  : accept the user input as request to pass services layer and send respose form service layer
 * @author    : PRAVIN DESHMUKH
 * @since     : 06/07/2020
 *********************************************************************************************************/
const service = require('../services/stateService');
const config = require('../../config').get();
/**
 * @description Winston logger derived from the config
; */
const { loggers } = config;

class StateController {
	/**
	 * state controller to pass request to state service
	 * @param {httpRequest} req
	 * @param {httpResponse} res
	 */
	getAllStateData(req, res) {
		try {
			service
				.getStateData()
				.then(data => {
					res.status(200).send(data);
				})
				.catch(err => {
					loggers.error('error', err);
					res.status(422).send(err);
				});
		} catch (error) {
			res.status(422).send({
				message: 'Operation failed',
			});
		}
	}

	getDateWiseStats(req, res) {
		try {
			let startDate = req.query.startDate;

			if (startDate === undefined) throw 'start date undefined';

			let date_regex = '^([0]?[1-9]|[1|2][0-9]|[3][0|1])[./-]([0]?[1-9]|[1][0-2])[./-]([0-9]{4}|[0-9]{2})$';

			if (!startDate.match(date_regex)) throw 'date not valid';
			service
				.getDateStateStats(startDate)
				.then(data => {
					res.send(data);
				})
				.catch(err => {
					loggers.error('error', err);
					res.status(422).send(err);
				});
		} catch (error) {
			res.status(422).send({
				error: error,
				message: 'Operation failed',
			});
		}
	}
}

module.exports = new StateController();

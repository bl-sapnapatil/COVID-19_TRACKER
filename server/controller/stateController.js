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
 */
const { loggers } = config;

class StateController {
	/**
	 * state controller to pass request to state service
	 * @param {httpRequest} req
	 * @param {httpResponse} res
	 */
	async getAllStateData(req, res) {
		try {
			await service
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

	async getDateWiseStats(req, res) {
		try {
			var startDate = req.query.startDate;
			await service
				.getDateStateStats(startDate)
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
}

module.exports = new StateController();

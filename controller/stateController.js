/**********************************************************************************************************
 * Purpose    : Read the user Input as Request and send the Respose to user
 * @file      : stateController.js
 * @overview  : accept the user input as request to pass services layer and send respose form service layer
 * @author    : PRAVIN DESHMUKH
 * @since     : 06/07/2020
 *********************************************************************************************************/
const service = require("../services/stateService");
class StateController {
  /**
   * register controller to pass request to register service
   * @param {httpRequest} req
   * @param {httpResponse} res
   */

  async getAllStateData(req, res) {
    try {
      await service
        .getStateData()
        .then((data) => {
          res.status(200).send(data);
        })
        .catch((err) => {
          res.status(422).send(err);
        });
    } catch (error) {
      res.status(422).send({ message: "Operation failed" });
    }
  }
}

module.exports = new StateController();

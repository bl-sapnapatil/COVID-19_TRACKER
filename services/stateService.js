/*******************************************************************************************
 * @Purpose   : sort state wise data
 * @file      : stateService.js
 * @overview  : sort the state  as per current status
 * @author    : PRAVIN DESHMUKH
 * @since     : 06/07/2020
 *******************************************************************************************/

const mongooservice = require("../config/mongooConfig");
class Service {
  async getStateData() {
    let casesRecord = {};

    let activeCount = 0;
    let recoveredCount = 0;
    let deathCount = 0;
    let totalCount = 0;
    let statesArray = [];
    let finalRecord = [];
    var completeData = [];

    let result = await mongooservice.getData();

    for (var data in result) {
      completeData.push({
        state: result[data].detectedstate,
        currentStatus: result[data].currentstatus,
      });
    }

    for (var i in completeData) {
      if (!statesArray.includes(completeData[i].state)) {
        statesArray.push(completeData[i].state);
      }
    }

    for (let state in statesArray) {
      for (let data in completeData) {
        if (statesArray[state] == completeData[data].state) {
          if (completeData[data].currentStatus == "Recovered") {
            recoveredCount++;
          }
          if (completeData[data].currentStatus == "Hospitalized") {
            activeCount++;
          }
          if (completeData[data].currentStatus == "Deceased") {
            deathCount++;
          }
        }
      }
      totalCount = recoveredCount + activeCount + deathCount;
      casesRecord = {
        stateName: statesArray[state],
        recover: recoveredCount,
        active: activeCount,
        death: deathCount,
        total: totalCount,
      };
      finalRecord.push(casesRecord);

      activeCount = 0;
      recoveredCount = 0;
      deathCount = 0;
      totalCount = 0;
    }
    return { sucess: "true", message: "success", data: finalRecord };
  }
}

module.exports = new Service();

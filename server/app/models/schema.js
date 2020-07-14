const mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Test = mongoose.model('Test', new Schema(), 'india_raw_data');
class casesModel {
    getData() {
        return Test.find().limit(50).then((result) => {
            // console.log("result on models", result);
            return result
        }).catch(err => {
            return err
        })
    }

}
module.exports = new casesModel();

/*******************************************************************************************
 * @Purpose   : Test the Get Covid-19 State Wise Data API
 * @file      : getStateDataApi.js
 * @overview  : Testing for Rest Api get state wise data.
 * @author    : PRAVIN DESHMUKH
 * @since     : 08/07/2020
 *******************************************************************************************/

var chai = require('chai'),
	chaiHttp = require('chai-http');

chai.use(chaiHttp);
var app = require('../index');
var expect = require('chai').expect;
chai.should();

// eslint-disable-next-line no-undef
describe('Get Covid-19 State Wise Data', () => {
	// eslint-disable-next-line no-undef
	it('given base route when proper should return message', () => {
		chai.request(app)
			.get('/api')
			.end((err, res) => {
				res.should.have.status(200);
				expect(res.body.message).to.equals('Welcome to the COVID19 Tracker API');
			});
	});

	// eslint-disable-next-line no-undef
	it('given route when proper should return success message', () => {
		chai.request(app)
			.get('/api/getAllStateData')
			.end((err, res) => {
				res.should.have.status(200);
				res.body.should.be.a('array');
			});
	});
});

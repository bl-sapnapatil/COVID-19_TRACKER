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
var stateData = require('../stateData.json');
chai.should();

describe('Get Covid-19 State Wise Data', () => {
	it('given base route when proper should return message', () => {
		chai.request(app)
			.get('/api')
			.end((err, res) => {
				res.should.have.status(200);
				expect(res.body.message).to.equals('Welcome to the COVID19 Tracker API');
			});
	});

	it('given route when proper should return success message', () => {
		chai.request(app)
			.get('/api/getAllStateData')
			.end((err, res) => {
				res.should.have.status(200);
				res.body.should.be.a('array');
			});
	});

	it('given route when proper should return success message', async () => {
		const response = await chai
			.request(app)
			.get('/api/getAllStateData')
			.set('Content-Type', 'application/json');
		expect(response).to.have.status(200);
	});

	it('given route when improper should return error message', async () => {
		const response = await chai
			.request(app)
			.get('/api/getAllStat')
			.set('Content-Type', 'application/json');
		expect(response).to.have.status(500);
	});

	it('given route when improper should return error message', () => {
		chai.request(app)
			.get('/api/getAllData')
			.end((err, res) => {
				res.should.have.status(500);
			});
	});

	it('given route when proper check right property in response body should return success message', () => {
		chai.request(app)
			.get('/api/getAllStateData')
			.send(stateData)
			.end((err, res) => {
				res.should.have.status(200);
				res.body.should.be.a('array');
				res.body[0].should.have.property('stateName');
				res.body[0].should.have.property('recover');
				res.body[0].should.have.property('active');
				res.body[0].should.have.property('death');
				res.body[0].should.have.property('total');
			});
	});
});

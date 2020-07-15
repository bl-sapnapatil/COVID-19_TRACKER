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

describe('Get Covid-19 State Wise Data', () => {
	it('given base route when proper should return message', () => {
		chai.request(app)
			.get('/api')
			.end((err, res) => {
				res.should.have.status(200);
				expect(res.body.message).to.equals('Welcome to the COVID19 Tracker API');
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
});

describe('Get Covid-19 Date wise State Data', () => {
	it('given route when proper should return success message', done => {
		chai.request(app)
			.get('/api/getDateWiseStats?startDate=14/07/2020')
			.set('Content-Type', 'application/json')
			.end((err, res) => {
				res.should.have.status(200);
			});
		done();
	});
	it('given route url parameter value can not empty', done => {
		chai.request(app)
			.get('/api/getDateWiseStats?startDate')
			.set('Content-Type', 'application/json')
			.end((err, res) => {
				res.should.have.status(422);
				res.body.should.be.a('object');
				res.body.should.have.property('message');
			});
		done();
	});
	it('given route improper return error massage', done => {
		chai.request(app)
			.get('/api/getDate')
			.set('Content-Type', 'application/json')
			.end((err, res) => {
				res.should.have.status(500);
				res.body.should.be.a('object');
			});
		done();
	});
});

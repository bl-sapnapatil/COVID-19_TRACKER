let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../index');
// eslint-disable-next-line no-unused-vars
let should = chai.should();
let requestObject = require('./requestObject');
chai.use(chaiHttp);

// eslint-disable-next-line no-undef
describe('getAllCount Function', () => {
	// eslint-disable-next-line no-undef
	it('Successfully getting data', () => {
		chai.request(server)
			.post('/api/search')
			.send(requestObject.searchObject[2])
			.end((err, res) => {
				res.should.have.status(200);
				res.body.should.be.a('Object');
				res.body.body.should.have.property('success').eql(true);
				res.body.body.should.have
					.property('message')
					.eql('Successfully got data');
				res.body.data.should.be.a('Array');
			});
	});

	it('Data not found', () => {
		chai.request(server)
			.post('/api/search')
			.send(requestObject.searchObject[3])
			.end((err, res) => {
				res.should.have.status(404);
				res.body.should.be.a('Object');
				res.body.body.should.have.property('success').eql(true);
				res.body.body.should.have
					.property('message')
					.eql('No data found');
				res.body.data.should.be.a('Array');
			});
	});

	it('Request body cannot be undefined', () => {
		chai.request(server)
			.post('/api/search')
			.end((err, res) => {
				res.should.have.status(422);
				res.body.should.be.a('Object');
				res.body.should.have.property('success').eql(false);
				res.body.should.have
					.property('error')
					.eql('Request body cannot be undefined');
				res.body.should.have
					.property('message')
					.eql('Error while getting data');
			});
	});

	it('Request body cannot be null', () => {
		chai.request(server)
			.post('/api/search')
			.send(requestObject.searchObject[0])
			.end((err, res) => {
				res.should.have.status(422);
				res.body.should.be.a('Object');
				res.body.should.have.property('success').eql(false);
				res.body.should.have
					.property('error')
					.eql('Request body cannot be null');
				res.body.should.have
					.property('message')
					.eql('Error while getting data');
			});
	});

	it('Request body cannot be empty string', () => {
		chai.request(server)
			.post('/api/search')
			.send(requestObject.searchObject[1])
			.end((err, res) => {
				res.should.have.status(422);
				res.body.should.be.a('Object');
				res.body.should.have.property('success').eql(false);
				res.body.should.have
					.property('error')
					.eql('Request body cannot be empty');
				res.body.should.have
					.property('message')
					.eql('Error while getting data');
			});
	});
});

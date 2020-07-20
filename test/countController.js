let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../index');
// eslint-disable-next-line no-unused-vars
let should = chai.should();
chai.use(chaiHttp);

// eslint-disable-next-line no-undef
describe('getAllCount Function', () => {
	// eslint-disable-next-line no-undef
	it('Successfully getting data', () => {
		chai.request(server)
			.get('/api/getAllCount')
			.end((err, res) => {
				res.should.have.status(200);
				res.body.should.be.a('Object');
				res.body.body.should.have.property('success').eql(true);
				res.body.body.should.have.property('message').eql('Successfully got data');
			});
	});
});

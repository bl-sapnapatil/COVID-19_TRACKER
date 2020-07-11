let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../../index');
// eslint-disable-next-line no-unused-vars
let should = chai.should();
chai.use(chaiHttp);

// eslint-disable-next-line no-undef
describe('getAllCount Function', () => {
	// eslint-disable-next-line no-undef
	it('Successfully getting data', done => {
		chai.request(server.app)
			.get('/api/getAllCount')
			.send()
			.end((err, res) => {
				console.log('response.......', res.status);
				res.should.have.status(200);
				res.body.should.be.a('Object');
				res.body.should.have.property('success').eql(true);
				res.body.should.have.property('message').eql('success');
				done();
			});
	});
});

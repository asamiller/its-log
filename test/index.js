var assert = require('assert');
var nock = require('nock');
var chai = require('chai');
var expect = chai.expect;
chai.should();

var dotenv = require('dotenv');
dotenv.load();

var ItsLog = require('..');

// HTTP mocking
nock('https://api.orchestrate.io')
.post('/v0/test')
.reply(201);

describe('Internal Functions', function () {
	var log;
	this.timeout(10000);

	describe('#init()', function () {
		it('should return with the instance', function () {
			log = new ItsLog({
				tags: ['test'],
				file: 'test.js'
			});
		});
	});

	describe('#buildEventMetaData()', function () {
		it('should return the correct data', function () {
			var data = log._buildEventMetaData('some event #WithTags and text #moretags');
			data.should.have.property('file').to.equal('test.js');
			data.should.have.property('tags').to.include('test');
			data.should.have.property('tags').to.include('WithTags');
			data.should.have.property('tags').to.include('moretags');
		});
	});

	describe('#info()', function () {
		it('should return a success', function (done) {
			log.info('Hello distributed log files! #testspass', {a: 1, b: 2}, function (err) {
				if (err) throw new Error(err);
				done();
			});
		});
	});
});

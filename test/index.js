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

	describe('#_findTags()', function () {
		it('should return the correct tags', function () {
			var tags = log._findTags('some event #WithTags and text #moretags');
			tags.should.include('WithTags');
			tags.should.include('moretags');
		});
	});

	describe('#customWinstonFormater()', function () {
		it('should return the correct data', function () {
			var data = log._customWinstonFormater('info', 'this is a message #withatag', {a: 'b'});

			data.should.have.property('level').to.equal('info');
			data.should.have.property('message').to.equal('this is a message #withatag');

			data.should.have.property('meta');
			data.meta.should.have.property('a').to.equal('b');

			data.should.have.property('file').to.equal('test.js');
			data.should.have.property('tags');
			data.tags.should.include('test');
			data.tags.should.include('withatag');
		});
	});

	describe('#info()', function () {
		it('should return a success', function (done) {
			log.info('Hello distributed log files! #testspass', {a: 1, b: 2}, function (err) {
				if (err) throw new Error(err);
				done();
			});
		});

		it('should return a success even without tags and metadata', function (done) {
			log.info('Hello distributed log files!', function (err) {
				if (err) throw new Error(err);
				done();
			});
		});
	});
});

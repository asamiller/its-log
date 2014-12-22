(function () {
	'use strict';

	var winston = require('winston');
	var orchestrate = require('winston-orchestrate');
	var _ = require('lodash');
	var util = require('util');

	/**
	 * Create a log client
	 * @param {object} options
	 * @return {Log}
	 */
	function Log (opts) {
		if (!(this instanceof Log)) {
			return new Log(opts);
		}

		var options = opts || {};

		this._file = options.file;
		this._tags = options.tags || [];
		this._console = options.console || false;

		this._apiKey = process.env.ITSLOG_API_KEY || options.apiKey;
		this._collection = process.env.ITSLOG_COLLECTION || options.collection;

		var orchestrateOptions = {
			apiKey: this._apiKey,
			collection: this._collection,
			customFormatter: this._customWinstonFormater.bind(this),
			timestamp: true
		};

		// init the winston instance
		this._logger = new (winston.Logger)({
			transports: [
				new (winston.transports.Orchestrate)(orchestrateOptions)
			]
		});

		if (this._console) this._logger.add(winston.transports.Console);
	}

	// TODO: this needs to extend winston so it supports info, log, silly, etc...

	/**
	 * Set up log.info() method
	 * @param {string} message
	 * @param {object} extra
	 * @param {function} callback
	 */
	Log.prototype.info = function (message, extra, callback) {
		this._logger.info.apply(null, arguments);
	};
	Log.prototype.warn = function (message, extra, callback) {
		this._logger.warn.apply(null, arguments);
	};
	Log.prototype.error = function (message, extra, callback) {
		this._logger.error.apply(null, arguments);
	};



	/**
	 * Parse tags out of the message string
	 * @param {string} message
	 */
	Log.prototype._findTags = function (message) {
		if (!message) return [];
		var tags = message.match(/#\S+/g) || [];
		return tags.map(function (tag) {
			return tag.replace(/#/g, '');
		});
	};



	/**
	 * Format the winston data for storage in Orchestrate
	 * this takes the extra data passed in from winston and moves
	 * it into the root orchestrate object 
	 * @param {string} level
	 * @param {string} message
	 * @param {object} meta
	 * @return {object}
	 */
	Log.prototype._customWinstonFormater = function (level, message, meta) {
		return {
			level   : level,
			message : message,
			meta    : meta,
			tags    : this._tags.concat(this._findTags(message)),
			file    : this._file
		};
	};

	module.exports = Log;
}());

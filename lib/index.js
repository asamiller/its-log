(function () {
	'use strict';

	var winston = require('winston');
	var orchestrate = require('winston-orchestrate');
	var _ = require('lodash');
	// var S = require('string');

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
		this._tags = options.tags;
		this._console = options.console || false;

		this._apiKey = process.env.ITSLOG_API_KEY || options.apiKey;
		this._collection = process.env.ITSLOG_COLLECTION || options.collection;

		// init the winston instance
		this._logger = new (winston.Logger)({
			transports: [
				new (winston.transports.Orchestrate)({ apiKey: this._apiKey, collection: this._collection })
			]
		});

		if (this._console) logger.add(winston.transports.Console);
	}


	/**
	 * Set up log.info() method
	 * @param {string} name
	 * @param {object} extra
	 * @param {function} callback
	 */
	Log.prototype.info = function (name, extra, callback) {
		// join the data together
		var data = _.extend({}, extra, this._buildEventMetaData(name));

		this._logger.log('info', name, data, callback);
	};


	/**
	 * Build the meta data object for the event
	 * @param {string} name
	 */
	Log.prototype._buildEventMetaData = function (name) {
		var metadata = {};

		// put together the global meta data for the event
		if (this._file) metadata.file = this._file;
		if (this._tags) metadata.tags = this._tags;

		// find any tags in the event name
		var tags = name.match(/#\S+/g).map(function (tag) {
			return tag.replace(/#/g, '');
		});

		metadata.tags = metadata.tags.concat(tags);

		return metadata;
	};

	module.exports = Log;
}());

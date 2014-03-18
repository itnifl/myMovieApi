var _ = require('underscore');
var util = require('util');
var config = require('../config');
var BaseModel = require('../baseModel.js');


/**
 * Constructor.
 * 
 * @class MoviesAsList
 * @constructor
 */
function MoviesAsList() {
  //
};
_.extend(MoviesAsList, BaseModel);

/**
 * getAsList function.
 * @param {String} dir Directory to use content listing as movie names
 * @param {Object} responseHandler callback function with results
 */
MoviesAsList.prototype.getAsList = function(dir, responseHandler) {
	var request = require("request");
	var async = require("async");
	BaseModel.getList(dir, function(movieList) {
		if(config.debug) util.log("Received from base: '" + movieList + "' at MoviesAsList.getAsList()");

		var jsonText = '';
		if(movieList === undefined) {
			movieList = new Array();
			movieList.push('No movie found');
		}
		if(movieList.length > 1) jsonText +=  '[';
		async.each(movieList, 
			function(movie, callback){
				request("http://" + config.api + "/?t=" +movie, function(error, response, body) {
					var movieObj = JSON.parse(body)				
					if(movieObj.Response) {
						jsonText += body;
					}
				 	if(jsonText != '') jsonText += ', ';
				 	callback();
				});
		  	},
		  	function(err){
		  		jsonText = jsonText.substring(0, jsonText.length - 2)
		  		if(movieList.length > 1) jsonText +=  ']';
		    	responseHandler(jsonText);
		  	}
		);

	});	
};

module.exports = MoviesAsList;
var _ = require('underscore');
var util = require('util');
var config = require('../config');
var BaseModel = require('../baseModel.js');
var MongoDB = require('../mongodb');


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
MoviesAsList.prototype.getAsList = function(dir, movieFilterName, responseHandler) {
	var request = require("request");
	var async = require("async");
	BaseModel.getList(dir, function(movieList) {
		if(config.debug) util.log("Received from base: '" + movieList + "' at MoviesAsList.getAsList()");
		var mongodb = new MongoDB(config.mongoServer, config.mongoPort);
		
		var jsonText = '';
		if(movieList === undefined || movieList.length == 0) {
            responseHandler('[{"error": "No movie found"}]');
        } else {
		    if(movieList.length > 1) jsonText +=  '[';

		    async.waterfall([
			    function(waterfall_callback) {
				    util.log("Attempting to connect to mongodb in MoviesAsHtml.getAsHTML..");
				    mongodb.open(function(connectionResponse) {
					    util.log(".. connected!");
					    waterfall_callback(null);
				    });	
			    }, 
			    function(waterfall_callback) {
				    async.each(typeof movieFilterName === 'undefined' || movieFilterName == '' ? movieList : [movieFilterName], 
					    function(movie, callback) {
						    if(config.debug) util.log('Attempting fetch movie "' + movie + '" from mongodb..');
						    function addJsonMovie(__movieString) {
						    	jsonText += __movieString;
		                		if(jsonText != '') jsonText += ', ';
						    }
				            mongodb.getMovie(movie, function(cachedMovie) {
				        	    if(cachedMovie.Response == false)  {
				            	    if(config.debug) util.log('Attempting fetch movie "' + movie + '" from ' +config.api +'..');
								    request("http://" + config.api + "/?t=" +movie, function(error, response, body) {
									    var movieObj = JSON.parse(body);		
									    if(movieObj.Response) {
										    addJsonMovie(body);
                                            if(mongodb.db._state == 'connected') {
										        mongodb.saveMovie(movieObj, function(response) {
				                			        if(response.status != 'success' && config.debug) util.log('Received error while trying to save and cache movie: "' + response.status + '"');
				                			        else if(config.debug) util.log('Successfully saved movie to mongodb.. ');      			                    
				                		        }); 
                                            }
									    }						 	
						 			    callback();
								    });
							    } else {
		                		    var movieString = typeof cachedMovie == 'object' ? JSON.stringify(cachedMovie) : cachedMovie;
		                		    var movieObj = typeof cachedMovie == 'object' ? cachedMovie : JSON.parse(cachedMovie);

		                		    if(movieObj.Response && movieObj.Title == movieFilterName) {		                		    	
		                			    addJsonMovie(movieString);
		                		    } else if (movieObj.Response && (typeof movieFilterName === 'undefined' || movieFilterName == '')) {
										addJsonMovie(movieString);
		                		    }
		                		    callback();
	                		    }
	                	    });
				  	    },
				  	    function(err) {
				  		    jsonText = jsonText.substring(0, jsonText.length - 2)
				  		    if(movieList.length > 1) jsonText +=  ']';
				    	    responseHandler(jsonText);
				    	    waterfall_callback(null);
				  	    }
				    );
			    }], function(err) {
				    if(err && config.debug) util.log("Received error after async waterfall in MoviesAsHtml.getAsHTML(): " + err);
				    if(err) return err;
				    mongodb.close();
			    }
		    );	
        }
	});
};

module.exports = MoviesAsList;
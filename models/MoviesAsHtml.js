var _ = require('underscore');
var config = require('../config');
var BaseModel = require('../baseModel.js');
var MongoDB = require('../mongodb');
var fs = require('fs');
var Handlebars = require('handlebars');
var util = require('util');
var async = require("async");
var request = require("request");

/**
 * Constructor.
 * 
 * @class MoviesAsHTML
 * @constructor
 */
function MoviesAsHtml() {
  //
};
_.extend(MoviesAsHtml, BaseModel);

/***
 * MoviesAsHTML function.
 * @param {String} dir Directory to list movies as html from
 * @param {String} reqRoutePath The route that was used in the request
 * @param {Boolean} includedependencies Boolean to decide if dependencies should be included with the view
 * @param {Object} responseHandler callback to handle response from this function
 */
MoviesAsHtml.prototype.getAsHTML = function(dir, reqRoutePath, includedependencies, responseHandler) {  
  var htmlReturn = "";
  function getView(__reqRoutePath) { 
    if(__reqRoutePath.split(':')[0] == '/moviesAsHTML/large/' || __reqRoutePath.split(':')[0] == '/moviesAsHTML/large') {
    	return includedependencies ? fs.readFileSync('./views/MoviesAsHtmlLargeWithDependencies.template').toString() : fs.readFileSync('./views/MoviesAsHtmlLarge.template').toString();
    } else if(__reqRoutePath.split(':')[0] == '/moviesAsHTML/' || __reqRoutePath.split(':')[0] == '/moviesAsHTML') {
    	return includedependencies ? fs.readFileSync('./views/MoviesAsHtmlWithDependencies.template').toString() : fs.readFileSync('./views/MoviesAsHtml.template').toString();
    } else if(__reqRoutePath.split(':')[0] == '/moviesAsHTMLList') {
    	return fs.readFileSync('./views/MoviesAsHtmlListWithDependencies.template').toString();
    } else {
    	return fs.readFileSync('./views/MoviesAsHtmlLargeWithDependencies.template').toString()
    }  	
  }
  BaseModel.getList(dir, function(movieList) {
		if(config.debug) util.log("Received from base: '" + movieList + "' at MoviesAsHtml.getAsHTML()");
		var mongodb = new MongoDB(config.mongoServer, config.mongoPort);
		var jsonText = '';

		if(movieList === undefined) movieList = new Array();
        if(movieList.length == 0) {
            movieList.push('No movie found');
            var handlebarsData = [{"Title": "None Found", "Year": "0000", "Poster": "http://" + config.serverHostname + ":" + config.serverPort + "/getImage/notValid.jpg", "noExists": "No movie found"}];
            var source = getView(reqRoutePath);
            var template = Handlebars.compile(source);
            var wrapper = {objects: handlebarsData};
			var htmlReturn = template(wrapper);	    
			responseHandler(htmlReturn);
        } else {
		    jsonText +=  '[';
			
		    async.waterfall([
			    function(waterfall_callback) {
				    util.log("Attempting to connect to mongodb in MoviesAsHtml.getAsHTML..");
				    mongodb.open(function(err){
                        if (err) {
                            util.log("Something went wrong at mongodb.open: " + err);
				        }
				        async.each(movieList, 
						    function(movie, callback) {
		                	    if(config.debug) util.log('Attempting fetch movie "' + movie + '" from mongodb..');
			                    mongodb.getMovie(movie, function(cachedMovie) {
			                	    if((cachedMovie.hasOwnProperty("Response") && cachedMovie.Response == false))  {
			                		    if(config.debug) util.log('Response was: "' + cachedMovie.Response + '". Attempting to fetch movie "' + movie + '" from ' + config.api +'..');
										var urlDestination = "http://" + config.api + "/?t=" + movie;
			                		    request(urlDestination, function(error, response, body) {
											var stringResponse = typeof response == 'object' ? JSON.stringify(response, undefined, 2) : response;
										    if(config.debug) util.log('Attempting fetch movie "' + movie + '" from api via url: ' + urlDestination);	
											if(config.verbosedebug) {
											    util.log('Verbosedebug - Got the reply; Error: ' + error + ". Response: " + stringResponse);
												var stringBody = typeof body == 'object' ? JSON.stringify(body, undefined, 2) : body;
												util.log("Body: " + stringBody);
											}	
											if(response.statusCode == 200) {
												var movieObj = typeof body == 'object' ? body : JSON.parse(body);	
												if(config.verbosedebug) {	
													util.log('Verbosedebug - Got a reply with status code 200');
												}														
												movieObj.thumbsUp = 0;
												movieObj.thumbsDown = 0;							    
												mongodb.saveMovie(movieObj, function(response) {
													if(!response.status && config.debug) util.log('Received error while trying to save and cache movie('+movieObj.Title+'): "' + response.error + '"');
													else {
														if(config.debug) util.log('Successfully saved movie to mongodb: ' + movieObj.Title);
														mongodb.getMovie(movie, function(cachedMovie) {
															if(cachedMovie.Response == false)  {
																movieObj.Warning = "This movie was not found in the database, or the database was not available. Thumbs up and down functionality will not be available."; 
															} else {
																movieObj = typeof cachedMovie == 'object' ? cachedMovie : JSON.parse(cachedMovie);
															}
															movieObj.thumbsUp = 0;
															movieObj.thumbsDown = 0;
															jsonText += JSON.stringify(movieObj);
															if(jsonText != '') jsonText += ', ';
															callback();
														});
													}	                    
												 }); 											
											} else {
                                                if (config.debug) util.log('Got status code "' + response.statusCode + '" aborting further handeling of this movie ("' + movie + '")! Looks like the movie info cannot be fetched from either the database or the API.');
                                                util.log('ERROR: The ' + config.api + ' replied with a response other then true. Something is wrong. Are all prerequisites met to be able to communicate with the API?');												
											    callback();
											}																		 
									    });
			                	    } else {
			                		    var movieString = typeof cachedMovie == 'object' ? JSON.stringify(cachedMovie) : cachedMovie;
			                		    var movieObj = typeof cachedMovie == 'object' ? cachedMovie : JSON.parse(cachedMovie);
			                		    if(movieObj.Response) {
			                			    jsonText += movieString;	
			                			    if(jsonText != '') jsonText += ', ';
			                		    }
			                		    callback();
			                	    }		                           			                    
			                    });  		                                 			
					  	    },
					  	    function(err) {		  		
					  		    jsonText = jsonText.length > 2 ? jsonText.substring(0, jsonText.length - 2) : jsonText;
					  		    jsonText +=  ']';
	                            if(jsonText == "[]") {
	                                responseHandler(undefined);
	                                waterfall_callback(null);
	                            } else {
					  		        if(config.debug) util.log('Attempting to render view for all movies fetched..');
					  		        var handlebarsData = JSON.parse(jsonText);
					  		       
					  		        if(config.debug) util.log('Assuming we have fetched "' + handlebarsData.length + '" movies..');
					  		        try {
						  		        var source = getView(reqRoutePath);
							            var template = Handlebars.compile(source);

							            if(!handlebarsData[0].Response) handlebarsData = [{"Title": "None Found", "Year": "0000", "Poster": "http://" + config.serverHostname + ":" + config.serverPort + "/getImage/notValid.jpg", "noExists": "No movie found"}];
							            for (var i = 0; i < handlebarsData.length; i++) {
								            if(handlebarsData[i].Poster != undefined) {
								    	        var filename = handlebarsData[i].Poster.split('/')[handlebarsData[i].Poster.split('/').length -1];
								    	        var path = './coverCache/'+filename;
								    	        if (!fs.existsSync(path)) {				    		
									    	        var responsestream = fs.createWriteStream(path);
									    	        request.get(handlebarsData[i].Poster).pipe(responsestream);
									            }
									            handlebarsData[i].Poster = "http://" + config.serverHostname + ":" + config.serverPort + "/getImage/" + filename;
									            handlebarsData[i].URL = "http://" + config.serverHostname + ":" + config.serverPort;
								            }
								        }
							            var wrapper = {objects: handlebarsData};
							            var htmlReturn = template(wrapper);	    
								        responseHandler(htmlReturn);
					  		        } catch (err) {
					  			        if(config.debug) util.log('Failed to load template view ' + source +', ' + err);
					  			        responseHandler(err);				  			
					  		        }		    
					  		        waterfall_callback(null);	
	                            }
					  	    }
					    );					    
				    });	
			    }
			], function(err) {
		    	mongodb.close();
			    if(err && config.debug) util.log("Received error after async waterfall in MoviesAsHtml.getAsHTML(): " + err);
			    if(err) return err;			    
		    });
        }
	});	
};

module.exports = MoviesAsHtml;
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

/**
 * MoviesAsHTML function.
 * @param {String} dir Directory to list movies as html from
 * @param {Object} responseHandler callback to handle response from this function
 */
MoviesAsHtml.prototype.getAsHTML = function(dir, includedependencies, responseHandler) {  
  var htmlReturn = "";
  BaseModel.getList(dir, function(movieList) {
		if(config.debug) util.log("Received from base: '" + movieList + "' at MoviesAsHtml.getAsHTML()");
		var mongodb = new MongoDB(config.mongoServer, config.mongoPort);
		var jsonText = '';

		if(movieList === undefined) movieList = new Array();
        if(movieList.length == 0) {
            movieList.push('No movie found');
            var handlebarsData = [{"Title": "None Found", "Year": "0000", "Poster": "http://" + config.serverHostname + ":" + config.serverPort + "/getImage/notValid.jpg", "noExists": "No movie found"}];
            var source = includedependencies ? fs.readFileSync('./views/MoviesAsHtmlWithDependencies.template').toString() : fs.readFileSync('./views/MoviesAsHtml.template').toString();
            var template = Handlebars.compile(source);
            var wrapper = {objects: handlebarsData};
			var htmlReturn = template(wrapper);	    
			responseHandler(htmlReturn);
        } else {
		    jsonText +=  '[';
			
		    async.waterfall([
			    function(waterfall_callback) {
				    util.log("Attempting to connect to mongodb in MoviesAsHtml.getAsHTML..");
				    mongodb.open(function(connectionResponse){
					    util.log(".. connected!");
					    waterfall_callback(null);
				    });	
			    }, 
			    function(waterfall_callback) {
				    async.each(movieList, 
					    function(movie, callback){
						    //if(config.debug) util.log('Attempting to open a connection to mongodb if not already connected..');
						    //mongodb.open(function(err) {
                            var err = undefined;
			                    if(err) { 
			                	    util.log("Received error while connecting to mongodb:" + err);
			                	    callback();
			                    } else {
			                	    if(config.debug) console.log('.. success!');
			                	    if(config.debug) util.log('Attempting fetch movie "' + movie + '" from mongodb..');
				                    mongodb.getMovie(movie, function(cachedMovie) {
				                	    if(cachedMovie.Response == false)  {
				                		    if(config.debug) util.log('Attempting fetch movie "' + movie + '" from ' +config.api +'..');
				                		    request("http://" + config.api + "/?t=" +movie, function(error, response, body) {
											    var movieObj = JSON.parse(body);		
											    if(movieObj.Response) {
												    jsonText += body;	
                                                    if(mongodb.db._state == 'connected') {				 
								                        mongodb.saveMovie(movieObj, function(response) {
								                	        if(response.status != 'success' && config.debug) util.log('Received error while trying to save and cache movie: "' + response.status + '"');
								                	        else if(config.debug) util.log('Successfully saved movie to mongodb.. ');      			                    
								                        }); 
                                                    }
								                    if(jsonText != '') jsonText += ', ';
											    }								 	
										 	    callback();
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
			                    }              
			                //});				
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
					  		        var source = includedependencies ? fs.readFileSync('./views/MoviesAsHtmlWithDependencies.template').toString() : fs.readFileSync('./views/MoviesAsHtml.template').toString();			  		
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
							            }
							        }
						            var wrapper = {objects: handlebarsData};
						            var htmlReturn = template(wrapper);	    
							        responseHandler(htmlReturn);
				  		        } catch (err) {
				  			        if(config.debug) util.log('Failed to load ' + (includedependencies ? 'MoviesAsHtmlWithDependencies.template' : '(MoviesAsHtml.template)') +', ' + err);
				  			        responseHandler(err);				  			
				  		        }		    
				  		        waterfall_callback(null);	
                            }
				  	    }
				    );
		    }], function(err) {
			    if(err && config.debug) util.log("Received error after async waterfall in MoviesAsHtml.getAsHTML(): " + err);
			    if(err) return err;
			    mongodb.close();
		    });
        }
	});	
};

module.exports = MoviesAsHtml;
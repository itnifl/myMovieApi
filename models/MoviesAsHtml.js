var _ = require('underscore');
var config = require('../config');
var BaseModel = require('../baseModel.js');
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

		var jsonText = '';
		if(movieList === undefined) {
			movieList = new Array();
			movieList.push('No movie found');
		}
		jsonText +=  '[';
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
		  		jsonText +=  ']';
		  		var handlebarsData = JSON.parse(jsonText);
		  		try {
			  		var source = includedependencies ? fs.readFileSync('./views/MoviesAsHtmlWithDependencies.template').toString() : fs.readFileSync('./views/MoviesAsHtml.template').toString();			  		
				    var template = Handlebars.compile(source);

				    if(!handlebarsData[0].Response) handlebarsData = [{"Title": "Not found", "Year": "0000", "Poster": "undefined"}];
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
		  	}
		);

	});	
};

module.exports = MoviesAsHtml;
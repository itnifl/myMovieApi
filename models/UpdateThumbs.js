var _ = require('underscore');
var util = require('util');
var config = require('../config');
var BaseModel = require('../baseModel.js');
var MongoDB = require('../mongodb');
var async = require("async");


/**
 * Constructor.
 * 
 * @class UpdateThumbs
 * @constructor
 */
function UpdateThumbs() {
  //
};
_.extend(UpdateThumbs, BaseModel);

/**
 * getImage function.
 * @param {Integer} thumbInteger amount if thumbs to increment or decrement (positive or negative integer).
 * @param {String} _id The ID of the movie in MongoDb
 * @param {Object} responseHandler callback function with results
 */
UpdateThumbs.prototype.update = function(thumbInteger, _id, responseHandler) {
	var mongodb = new MongoDB(config.mongoServer, config.mongoPort);

	async.waterfall([
	    function(waterfall_callback) {
		    util.log("Attempting to connect to mongodb in UpdateThumbs.update() ..");
		    mongodb.open(function(connectionResponse) {
		    	mongodb.changeMovieThumbs(_id, thumbInteger, function(thumbUpdateResponse) {
		    		util.log(JSON.stringify(thumbUpdateResponse));
	        	    if(thumbUpdateResponse.Response == false)  {
	            	    if(config.debug) util.log('Failed to update thumbs on id "' + _id + ' when using integer: ' + thumbInteger + '..');
	            	    responseHandler({status: 'failed'});
	            	    waterfall_callback(null); 			    
				    } else {
				    	if(config.debug) util.log('Successfully updated thumbs on id "' + _id + ' when using integer: ' + thumbInteger + '..');
				    	responseHandler({status: 'success'});
				    	waterfall_callback(null);
	    		    }		    		    
    	    	});		   
		    });	
	    }], function(err) {
		    if(err && config.debug) util.log("Received error after async waterfall in UpdateThumbs.update(): " + err);
		    if(err) return err;		    
		    mongodb.close();
	    }	    
    );
};

module.exports = UpdateThumbs;
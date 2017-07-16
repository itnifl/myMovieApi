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
 * update function.
 * @param {Integer} thumbInteger amount if thumbs to increment or decrement (positive or negative integer).
 * @param {String} _id The ID of the movie in MongoDb
 * @param {Function} responseHandler callback function with results
 */
UpdateThumbs.prototype.update = function(thumbInteger, _id, responseHandler) {
	var mongodb = new MongoDB(config.mongoServer, config.mongoPort);

	async.waterfall([
	    function(waterfall_callback) {
		    util.log("Attempting to connect to mongodb in UpdateThumbs.update() ..");
            mongodb.open(function (connectionResponse) {
                if (connectionResponse) {
                    util.log("Something went wrong at mongodb.open: " + connectionResponse);
                }
		    	mongodb.addMovieThumb(_id, thumbInteger, function(thumbUpdateResponse) {
		    		if(config.verbosedebug) util.log('Received info about thumbs to put in MongoDb: ' + JSON.stringify(thumbUpdateResponse));
	        	    if(thumbUpdateResponse.Response == false)  {
	            	    if(config.debug) util.log('Failed to update thumbs on id "' + _id + ' when using integer: ' + thumbInteger + '..');
	            	    responseHandler({status: false});
	            	    waterfall_callback(null); 			    
				    } else {
				    	if(config.debug) util.log('Successfully updated thumbs on id "' + _id + ' when using integer: ' + thumbInteger + '..');
				    	responseHandler({status: true});
				    	waterfall_callback(null);
	    		    }		    		    
    	    	});		   
		    });	
	    }], function(err) {
	    	mongodb.close();
		    if(err && config.debug) util.log("Received error after async waterfall in UpdateThumbs.update(): " + err);
		    if(err) return err;		    		    
	    }	    
    );
};

/**
 * remove function.
 * @param {Integer} thumbInteger - positive to remove thumb up. negative to remove thumb down.
 * @param {String} _id The ID of the movie in MongoDb
 * @param {Function} responseHandler callback function with results
 */
UpdateThumbs.prototype.remove = function(thumbInteger, _id, responseHandler) {
	var mongodb = new MongoDB(config.mongoServer, config.mongoPort);

	async.waterfall([
	    function(waterfall_callback) {
		    util.log("Attempting to connect to mongodb in UpdateThumbs.remove() ..");
            mongodb.open(function (connectionResponse) {
                if (connectionResponse) {
                    util.log("Something went wrong at mongodb.open: " + connectionResponse);
                } 
		    	mongodb.removeMovieThumb(_id, thumbInteger, function(thumbUpdateResponse) {
		    		if(config.verbosedebug) util.log('Received info about thumb to be removed in MongoDb: ' + JSON.stringify(thumbUpdateResponse));
	        	    if(thumbUpdateResponse.Response == false)  {
	            	    if(config.debug) util.log('Failed to remove thumb on id "' + _id + ' when using integer: ' + thumbInteger + '..');
	            	    responseHandler({status: false});
	            	    waterfall_callback(null); 			    
				    } else {
				    	if(config.debug) util.log('Successfully removed thumb on id "' + _id + ' when using integer: ' + thumbInteger + '..');
				    	responseHandler({status: true});
				    	waterfall_callback(null);
	    		    }		    		    
    	    	});		   
		    });	
	    }], function(err) {
	    	mongodb.close();
		    if(err && config.debug) util.log("Received error after async waterfall in UpdateThumbs.remove(): " + err);
		    if(err) return err;		    		    
	    }	    
    );
};

module.exports = UpdateThumbs;
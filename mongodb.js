var _ = require('underscore');
var util = require('util');
var mongodb = require('mongodb');
var config = require('./config');

/**
 * Constructor.
 * 
 * @class MongoDB
 * @constructor
 * @param String mongoServer Address or hostname of mongodb server to connect to.
 * @param Integer mongoPort The port number that the mongodb server listens to.
 */
function MongoDB(mongoServer, mongoPort) {
  	var mongoServer = new mongodb.Server(mongoServer, mongoPort, { auto_reconnect: true });
	this.db = new mongodb.Db('movies', mongoServer, { safe: true });				
};


/**
 * close database connection function.
 */
MongoDB.prototype.close = function() {
	this.db.close();	 
}

/**
 * open database connection function.
 * @param {Object} responseHandler ResponseHandler Callback
 * Initial database operations should be handeled in callback.
 */
MongoDB.prototype.open = function(responseHandler) {
	if(config.verbosedebug) util.log('DB connection status is: ' + this.db._state + "..");
	if(this.db._state != 'connecting' && this.db._state != 'connected') {
        if (config.debug) util.log("Connecting to the 'movies' collection..");
		this.db.open(function(err, db) {
		    if (!err) {
		        if (config.debug) util.log("Connected to the 'movies' collection..");
				db.collection('movies', {strict:true}, function(err, collection) {
				    if (err && config.debug) util.log("Something happened when connecting to the 'movies' collection: " + err);
		        });
		    } else {
		    	if (config.debug) util.log("Failed connecting to 'movies' collection: " + err);
		    }
		    responseHandler(err);  
		});	
	} else if(this.db._state == 'connected') {
		responseHandler(undefined);
	}
}

/**
 * saveMovie function.
 * @param {Object} movieAsjSon A movie represented as jSON to be stored in database
 * @param {Object} responseHandler ResponseHandler Callback
 */
MongoDB.prototype.saveMovie = function(movieAsjSon, responseHandler) {
	var movieObj = typeof movieAsjSon =='object' ? movieAsjSon : JSON.parse(movieAsjSon);
    if (config.verbosedebug) util.log('Saving movieObj: ' + JSON.stringify(movieObj, undefined, 2));
 	if (config.debug) util.log('Saving movie to mongodb: ' + movieObj.Title);

    this.db.collection('movies', function(err, collection) {
    	if(err) return responseHandler({status: err});
    	if (config.debug) util.log('Attempting to upsert movie: ' + movieObj.Title);
        collection.update({"Title": movieObj.Title}, movieObj, {safe:true, upsert:true}, function(err, result) {
            if (err) return responseHandler({status: err});
            if (config.debug) console.log('.. success!');
            responseHandler({status: 'success'});
        });
    });
};

/**
 * getMovie function.
 * @param String title The title of the movie you are searching for
 * @param {Object} responseHandler ResponseHandler Callback
 * Returns a movie as jSON object
 */
MongoDB.prototype.getMovie = function(title, responseHandler) {
    if (config.debug) util.log('Retrieving movie from mongodb: "' + title +'"');
    
    this.db.collection('movies', function (err, collection) {
        collection.findOne({ 'Title': title }, function (err, movie) {
            if (movie != null) { 
                if (config.verbosedebug) util.log("Found movie in mongodb: " + JSON.stringify(movie, undefined, 2));     
                if (config.debug) util.log("Found movie in mongodb: '" + movie.Title + "'..");           
                responseHandler(movie);
            } else {
                if (config.debug) util.log("Found nothing by that title - '" + title + "'..");
               responseHandler({Response: false});
            }
        });
    });
};

/**
 * changeMovieLike function.
 * @param {String} _id A movie represented by it's document ID in MongoDB
 * @param {Integer} integer A positive or negative integer for either the incrementation of one thumbUp or the incrementation of one thumbDown
 * @param {Object} responseHandler ResponseHandler Callback
 */
MongoDB.prototype.changeMovieLike = function(_id, integer, responseHandler) {
    if (config.debug) util.log('Changing thumbs on movie with _id: ' + _id);

    this.db.collection('movies', function(err, collection) {
        if(err) return responseHandler({status: err});
        collection.findOne({ '_id': _id }, function (err, movie) {
            if (movie != null) { 
                if (config.verbosedebug) util.log("Found movie in mongodb by _id: " + JSON.stringify(movie, undefined, 2));     
                if (config.debug) util.log("Found movie in mongodb by _id: '" + movie._id + "'..");
                if (config.debug) util.log("Attempting to change thumbs on '" + movie._id + "'..");

                var thumbsUp = typeof movie.thumbsUp === undefined || isNaN(movie.thumbsUp) ? 0 : movie.thumbsUp;
                var thumbsDown = typeof movie.thumbsDown === undefined || isNaN(movie.thumbsDown) ? 0 : movie.thumbsDown;

                if(integer > 0) thumbsUp += 1;
                else if(integer < 0) thumbsDown += 1;
                else responseHandler({status: 'success'});
                if (config.debug) util.log("Determined to update to this amount of thumbsUp: '" + thumbsUp + "'..");
                if (config.debug) util.log("Determined to update to this amount of thumbsDown: '" + thumbsDown + "'..");

                collection.update(
                    {'_id': _id}, 
                    {'$set' : { thumbsUp: thumbsUp, thumbsDown: thumbsDown }}, 
                    function(err, result) {
                        if (err) return responseHandler({status: err});
                        //if (config.verbosedebug) console.log(result);
                        if (config.debug) console.log('.. success!');
                        responseHandler({status: 'success', thumbsUp: thumbsUp, thumbsDown: thumbsDown});
                    });         
            } else {
                if (config.debug) util.log("Found nothing by that _id - '" + _id + "'..");
               responseHandler({Response: false});
            }
        });                
    });
};

module.exports = MongoDB;
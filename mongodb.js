var _ = require('underscore');
var util = require('util');
var mongodb = require('mongodb');
var config = require('./config');
var ObjectId = require('mongodb').ObjectID

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
 * @param {Function} responseHandler ResponseHandler Callback
 * Initial database operations should be handeled in callback.
 */
MongoDB.prototype.open = function(responseHandler) {
	if(config.verbosedebug) util.log('DB connection status at open call is: ' + this.db._state + "..");
	if(this.db._state != 'connecting' && this.db._state != 'connected') {
		this.db.open(function(err, db) {
		    if (!err) {
		        if (config.debug) util.log("Connected to the 'movies' collection, the connection status is now open..");
				db.collection('movies', {strict:true}, function(err, collection) {
				    if (err && config.debug) util.log("Something happened when connecting to the 'movies' collection: " + err);
                    responseHandler(err);
		        });                
		    } else {
		    	if (config.debug) util.log("Failed connecting to 'movies' collection: " + err);
                responseHandler(err);
		    }		     
		});	
	} else if(this.db._state == 'connected') {
		responseHandler(undefined);
	}
}

/**
 * saveMovie function.
 * @param {Object} movieAsjSon A movie represented as jSON to be stored in database
 * @param {Function} responseHandler ResponseHandler Callback
 */
MongoDB.prototype.saveMovie = function(movieAsjSon, responseHandler) {
	var movieObj = typeof movieAsjSon =='object' ? movieAsjSon : JSON.parse(movieAsjSon);
    if (config.verbosedebug) util.log('Saving movieObj: ' + JSON.stringify(movieObj, undefined, 2));
 	if (config.debug) util.log('Saving movie to mongodb: ' + movieObj.Title);

    if(movieObj.hasOwnProperty("Warning")) delete movieObj.Warning;

    this.db.collection('movies', function(err, collection) {
    	if(err) return responseHandler({status: false, error: err});
    	if (config.debug) util.log('Attempting to upsert movie: ' + movieObj.Title);
        collection.update({"Title": movieObj.Title}, movieObj, {safe:true, upsert:true}, function(err, result) {
            if (err) return responseHandler({status: false, error: err});
            if (config.debug) console.log('.. save success!');
            responseHandler({status: true});
        });
    });
};

/**
 * getMovie function.
 * @param String title The title of the movie you are searching for
 * @param {Function} responseHandler ResponseHandler Callback
 * Returns a movie as JSON object
 */
MongoDB.prototype.getMovie = function(title, responseHandler) {
    if (config.debug) util.log('Retrieving movie from mongodb: "' + title +'"');
    
    this.db.collection('movies', function (err, collection) {
        collection.findOne({ "Title": title }, function (err, movie) {
            if (movie) { 
                if (config.verbosedebug) util.log("Found movie in mongodb: " + JSON.stringify(movie, undefined, 2));     
                if (config.debug && !config.verbosedebug) util.log("Found movie in mongodb: '" + movie.Title + "'..");

                
                var thumbsUp = typeof movie.thumbsUp === undefined || isNaN(movie.thumbsUp) ? 0 : movie.thumbsUp;
                var thumbsDown = typeof movie.thumbsDown === undefined || isNaN(movie.thumbsDown) ? 0 : movie.thumbsDown;

                if(thumbsUp == 0) movie.thumbsUp = thumbsUp;
                if(thumbsDown == 0) movie.thumbsDown = thumbsDown;
				movie.Response = true;
				
                responseHandler(movie);
            } else {
                if (config.debug) util.log("Found nothing by the title: '" + title + "'..");
               responseHandler({Response: false});
            }
        });
    });
};

/**
 * addMovieThumb function.
 * @param {String} _id A movie represented by it's document ID in MongoDB
 * @param {Integer} integer A positive or negative integer for either the incrementation of one thumbUp or the incrementation of one thumbDown
 * @param {Function} responseHandler ResponseHandler Callback
 */
MongoDB.prototype.addMovieThumb = function(_id, integer, responseHandler) {
    if (config.debug) util.log('Incrementing thumbs on movie with _id: ' + _id);

    this.db.collection('movies', function(err, collection) {
        if(err == '{}') return responseHandler({Response: err});        
        collection.findOne({ '_id': ObjectId(_id) }, function (err, movie) {
            if (movie) { 
                if (config.verbosedebug) util.log("Found movie in mongodb by _id: " + JSON.stringify(movie, undefined, 2));     
                if (config.debug) util.log("Found movie in mongodb by _id: '" + movie._id + "'..");

                var thumbsUp = typeof movie.thumbsUp === undefined || isNaN(movie.thumbsUp) ? 0 : movie.thumbsUp;
                var thumbsDown = typeof movie.thumbsDown === undefined || isNaN(movie.thumbsDown) ? 0 : movie.thumbsDown;

                if(integer > 0) thumbsUp += 1;
                else if(integer < 0) thumbsDown += 1;

                if (config.verbosedebug) util.log("Determined to update to this amount of thumbsUp: '" + thumbsUp + "'..");
                if (config.verbosedebug) util.log("Determined to update to this amount of thumbsDown: '" + thumbsDown + "'..");

                collection.update(
                    {'_id': ObjectId(_id) }, 
                    {'$set' : { thumbsUp: thumbsUp, thumbsDown: thumbsDown }}, 
                    function(err, result) {
                        if (err) return responseHandler({Response: err});
                        if (config.debug) console.log('.. success!');
                        responseHandler({Response: true, thumbsUp: thumbsUp, thumbsDown: thumbsDown});
                    });         
            } else {
                if (config.debug) util.log("Found nothing by that _id - '" + _id + "'..");
               responseHandler({Response: false});
            }
        });                
    });
};

/**
 * removeMovieThumb function.
 * @param {String} _id A movie represented by it's document ID in MongoDB
 * @param {Integer} integer A positive or negative integer for either the decrementation of one thumbUp or the decrementation of one thumbDown
 * @param {Function} responseHandler ResponseHandler Callback
 */
MongoDB.prototype.removeMovieThumb = function(_id, integer, responseHandler) {
    if (config.debug) util.log('Decrementing thumbs on movie with _id: ' + _id);

    this.db.collection('movies', function(err, collection) {
        if(err == '{}') return responseHandler({Response: err});        
        collection.findOne({ '_id': ObjectId(_id) }, function (err, movie) {
            if (movie) { 
                if (config.verbosedebug) util.log("Found movie in mongodb by _id: " + JSON.stringify(movie, undefined, 2));     
                if (config.debug) util.log("Found movie in mongodb by _id: '" + movie._id + "'..");

                var thumbsUp = typeof movie.thumbsUp === undefined || isNaN(movie.thumbsUp) ? 0 : movie.thumbsUp;
                var thumbsDown = typeof movie.thumbsDown === undefined || isNaN(movie.thumbsDown) ? 0 : movie.thumbsDown;

                if(integer > 0) thumbsUp -= 1;
                else if(integer < 0) thumbsDown -= 1;

                if (config.verbosedebug) util.log("Determined to update to this amount of thumbsUp: '" + thumbsUp + "'..");
                if (config.verbosedebug) util.log("Determined to update to this amount of thumbsDown: '" + thumbsDown + "'..");

                collection.update(
                    {'_id': ObjectId(_id) }, 
                    {'$set' : { thumbsUp: thumbsUp, thumbsDown: thumbsDown }}, 
                    function(err, result) {
                        if (err) return responseHandler({Response: err});
                        if (config.debug) console.log('.. success!');
                        responseHandler({Response: true, thumbsUp: thumbsUp, thumbsDown: thumbsDown});
                    });         
            } else {
                if (config.debug) util.log("Found nothing by that _id - '" + _id + "'..");
                responseHandler({Response: false});
            }
        });                
    });
};

/**
 * getMovieThumbs function.
 * @param {String} _id A movie represented by it's document ID in MongoDB
 * @param {Function} responseHandler ResponseHandler Callback
 */
MongoDB.prototype.getMovieThumbs = function(_id, responseHandler) {
    if (config.debug) util.log('Getting thumbs on movie with _id: ' + _id);

    this.db.collection('movies', function(err, collection) {
        if(err == '{}') return responseHandler({Response: err});        
        collection.findOne({ '_id': ObjectId(_id) }, function (err, movie) {
            if (movie) { 
                if (config.verbosedebug) util.log("Found movie in mongodb by _id: " + JSON.stringify(movie, undefined, 2));     
                if (config.debug) util.log("Found movie in mongodb by _id: '" + movie._id + "'..");

                var thumbsUp = typeof movie.thumbsUp === undefined || isNaN(movie.thumbsUp) || movie.thumbsUp == '' ? 0 : movie.thumbsUp;
                var thumbsDown = typeof movie.thumbsDown === undefined || isNaN(movie.thumbsDown) || movie.thumbsDown == '' ? 0 : movie.thumbsDown;

                responseHandler({Response: true, _id: _id, thumbsUp: thumbsUp, thumbsDown: thumbsDown});        
            } else {
                if (config.debug) util.log("Found nothing by that _id - '" + _id + "'..");
               responseHandler({Response: false, _id: _id});
            }
        });                
    });
};

module.exports = MongoDB;
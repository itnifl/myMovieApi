var _ = require('underscore');
var util = require('util');
var config = require('../config');
var BaseModel = require('../baseModel.js');


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
 * @param {Integer} thumbsUp amount if thumbs up to increment
 * @param {Integer} thumbsDown amount if thumbs down to increment
 * @param {String} _id The ID of the movie in MongoDb
 * @param {Object} responseHandler callback function with results
 */
UpdateThumbs.prototype.update = function(thumbsUp, thumbsDown, _id, responseHandler) {
	//Missing code to do the update and respond if it was successful or not:
	
	responseHandler({status: 'success'});
};

module.exports = UpdateThumbs;
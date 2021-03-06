var _ = require('underscore');
var util = require('util');
var config = require('../config');
var BaseModel = require('../baseModel.js');


/**
 * Constructor.
 * 
 * @class GetImage
 * @constructor
 */
function GetImage() {
  //
};
_.extend(GetImage, BaseModel);

/**
 * getImage function.
 * @param {String} imageFile Image file to send to the client
 * @param {Object} responseHandler callback function with results
 */
GetImage.prototype.getImage = function(imageFile, responseHandler) {
	var fs = require("fs");
	var path = './coverCache/' + imageFile;
	var img = fs.existsSync(path) ? fs.readFileSync(path) : fs.readFileSync('./coverCache/notValid.jpg') ;
	if(config.debug) util.log('Returning "' + imageFile + '" to responseHandler that will return it to the client..');
	responseHandler(img);
};

module.exports = GetImage;
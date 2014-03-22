var util = require('util');
var BaseController = require('../baseController.js');
var config = require('../config');

/**
 * Constructor.
 * 
 * @class GetImageController
 * @constructor
 */
function GetImageController() {
  this.routes = [
	['get', '/getImage/:image', this.get, 'Retrieves an image from coverCache to the client requesting it']
  ];
}
util.inherits(GetImageController, BaseController);

/**
 * GET /MoviesAsList
 * 
 * @param {Object} req Request
 * @param {Object} res Response
 */
GetImageController.prototype.get = function(req, res) {
  var GetImage = Model.get('GetImage').find(1);
  var image = req.params.image;
  GetImage.getImage(image, function(result) {
  		res.writeHead(200, {'Content-Type': 'image/jpeg' });
     	res.end(result);
  		//res.send(result);
  });  
  //util.log("Sending image by request to client..");
};

module.exports = new GetImageController();
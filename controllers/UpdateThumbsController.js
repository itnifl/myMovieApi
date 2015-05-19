var util = require('util');
var BaseController = require('../baseController.js');
var config = require('../config');

/**
 * Constructor.
 * 
 * @class UpdateThumbsController
 * @constructor
 */
function UpdateThumbsController() {
  this.routes = [
	 ['put', '/updateLikes/:integer', this.post,Thumbs 'Updates thumbs up (positive :integer) and thumbs down (negative :integer) on movies in MongoDB']
  ];
}
util.inherits(UpdateThumbsController, BaseController);

/**
 * PUT /UpdateThumbsController
 * 
 * @param {Object} req Request
 * @param {Object} res Response
 */
UpdateThumbsController.prototype.putThumbs = function(req, res) { 
  if(config.verbosedebug) util.log("Entered UpdateThumbsController via route: " + req.route.path.toString() + " from ip " + req.connection.remoteAddress);
  var UpdateThumbs = Model.get('UpdateThumbs').find(1);

  //Parameters need to be fetched via put and tested:
  var integer = req.body.integer;
  var _id = req.body._id;

  var thumbsUp = 0;
  var thumbsDown = 0;
  if(integer > 0) thumbsUp += 1;
  else if(integer < 0) thumbsDown += 1;
  else return;

  UpdateThumbs.update(thumbsUp, thumbsDown, _id, function(response) {
    if(response.status != 'success' && config.debug) util.log('Failed to update thumbs information on movie "' + response.status + '"');
  })
};

module.exports = new UpdateThumbsController();
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
	 ['put', '/updateThumbs/:id/:integer', this.putThumbs, 'Increments thumbs up (positive put integer) and thumbs down (negative put integer) on movie (put _id) in MongoDB']
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

  var thumbInteger = req.params.integer;
  var _id = req.params.id;

  if(!thumbInteger) {
    if(config.debug) util.log('Parameter integer was either 0 or non valued, exiting.');
    res.send({status: 'failed'})
  };

  if(_id != '' || typeof _id !== undefined) {
    UpdateThumbs.update(thumbInteger, _id, function(response) {
      if(response.status != 'success' && config.debug) util.log('Failed to update thumbs information on movie "' + response + '"');
      else {
        util.log('Updated thumbs on movie with id ' + _id + ' successfully.')
        res.send({status: 'success'})
      };
    });
  } else {
     if(config.debug) util.log('Parameter _id was either empty or undefined, exiting.');
     res.send({status: 'failed'})
  }
};

module.exports = new UpdateThumbsController();
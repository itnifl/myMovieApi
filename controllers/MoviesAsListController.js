var util = require('util');
var BaseController = require('../baseController.js');
var config = require('../config');

/**
 * Constructor.
 * 
 * @class MoviesAsListController
 * @constructor
 */
function MoviesAsListController() {
  this.routes = [
	['get', '/moviesAsList', this.get]
  ];
}
util.inherits(MoviesAsListController, BaseController);

/**
 * GET /MoviesAsList
 * 
 * @param {Object} req Request
 * @param {Object} res Response
 */
MoviesAsListController.prototype.get = function(req, res) {
  var MoviesAsList = Model.get('MoviesAsList').find(1);
  MoviesAsList.getAsList(config.sourceDir, function(result) {
  		res.send(result);
  });  
  util.log("Sending movies as list by request..");
};

module.exports = new MoviesAsListController();
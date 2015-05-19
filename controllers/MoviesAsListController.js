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
  	['get', '/moviesAsList', this.get, 'Displays all movies in sourceDir as JSON'],
  	['get', '/moviesAsList?movieNameFilter=movieName', this.get, 'Displays specified movieName in sourceDir as JSON if it exists']
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
  var movieNameFilter = req.query.movieNameFilter;

  if(config.verbosedebug) util.log('Entered MoviesAsListController via route: ' + req.route.path.toString() +  ' from ip ' + req.connection.remoteAddress);

  if(config.debug) util.log("Received filter: " + movieNameFilter);
  MoviesAsList.getAsList(config.sourceDir, movieNameFilter, function(result) {
  		res.send(result);
  });  
  util.log("Sending movies as list by request from ip " + req.connection.remoteAddress);
};

module.exports = new MoviesAsListController();
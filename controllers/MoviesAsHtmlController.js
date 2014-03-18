var util = require('util');
var BaseController = require('../baseController.js');
var config = require('../config');

/**
 * Constructor.
 * 
 * @class MoviesAsHTMLController
 * @constructor
 */
function MoviesAsHtmlController() {
  this.routes = [
	['get', '/moviesAsHTML', this.get],
	['get', '/moviesAsHTML/:includedependencies', this.get]
  ];
}
util.inherits(MoviesAsHtmlController, BaseController);

/**
 * GET /movieAsHTML
 * 
 * @param {Object} req Request
 * @param {Object} res Response
 */
MoviesAsHtmlController.prototype.get = function(req, res) {
  var MoviesAsHTML = Model.get('MoviesAsHtml').find(1);
  var includedependencies = req.params.includedependencies;
  if(typeof includedependencies === 'undefined') includedependencies = false;
  else includedependencies = true;

  MoviesAsHTML.getAsHTML(config.sourceDir, includedependencies, function(result) {
  		res.send(result);
  });
  util.log("Sending movies as HTML by request..");
};

module.exports = new MoviesAsHtmlController();
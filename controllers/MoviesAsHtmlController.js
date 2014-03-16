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
	['get', '/moviesAsHTML', this.get]
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
  MoviesAsHTML.getAsHTML(config.sourceDir, function(result) {
  		res.send(result);
  });
  util.log("Sending movies as HTML by request..");
};

module.exports = new MoviesAsHtmlController();
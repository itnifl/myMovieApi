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
	['get', '/moviesAsHTML', this.get, 'Displays all movies in sourceDir as HTML carousel but does not includes jQuery and Bootstrap'],
	['get', '/moviesAsHTML/:includedependencies', this.get, 'Displays all movies in sourceDir as HTML carousel and includes jQuery and Bootstrap.'],
    ['get', '/moviesAsHTML/large/:includedependencies', this.getLarge, 'Displays all movies in sourceDir as HTML carousel with jsShowOff and includes dependencies(jQuery and jsShowOff).']
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
  if(typeof includedependencies === 'undefined' || includedependencies == 'false') includedependencies = false;
  else includedependencies = true;

  MoviesAsHTML.getAsHTML(config.sourceDir, includedependencies, function(result) {
  		if(typeof result === 'undefined') res.send('<p>Error: No movies found - is the api configured correctly?</p>');
        else res.send(result);
  });
  util.log("Sending movies as HTML by request..");
};

MoviesAsHtmlController.prototype.getLarge = function(req, res) {
  var MoviesAsHtmlLarge = Model.get('MoviesAsHtmlLarge').find(1);
  var includedependencies = req.params.includedependencies;
  if(typeof includedependencies === 'undefined' || includedependencies == 'false') includedependencies = false;
  else includedependencies = true;

  MoviesAsHtmlLarge.getAsHtml(config.sourceDir, includedependencies, function(result) {
  		if(typeof result === 'undefined') res.send('<p>Error: No movies found - is the api configured correctly?</p>');
        else res.send(result);
  });
  util.log("Sending movies as HTML by request..");
};

module.exports = new MoviesAsHtmlController();
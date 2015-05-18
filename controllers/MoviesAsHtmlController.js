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
	 ['get', '/moviesAsHTML/:includedependencies', this.get, 'Displays all movies in sourceDir as HTML carousel and includes jQuery and Bootstrap if includedependencies is set to true.'],
    ['get', '/moviesAsHTML/large/:includedependencies', this.get, 'Displays all movies in sourceDir as HTML carousel with jsShowOff and includes dependencies(jQuery and jsShowOff) if includedependencies is set to true.']
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

  if(config.verbosedebug) util.log("Entered MoviesAsHtmlController via route: " + req.route.path.toString().toLowerCase());
  MoviesAsHTML.getAsHTML(config.sourceDir, req.route.path.toString().toLowerCase().indexOf("large") > -1 ? true : false , includedependencies, function(result) {
  		if(typeof result === 'undefined') res.send('<p>Error: No movies found - is the api configured correctly?</p>');
        else res.send(result);
  });
  util.log("Sending movies as HTML by request..");
};

module.exports = new MoviesAsHtmlController();
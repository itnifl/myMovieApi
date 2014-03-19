var util = require('util');
var BaseController = require('../baseController.js');
var config = require('../config');

/**
 * Constructor.
 * 
 * @class RootController
 * @constructor
 */
function RootController() {
  this.routes = [
	   ['get', '/', this.get, 'Displays all API capabilities']
  ];
}
util.inherits(RootController, BaseController);

/**
 * GET /
 * 
 * @param {Object} req Request
 * @param {Object} res Response
 */
RootController.prototype.get = function(req, res) {
  var Root = Model.get('Root').find(1);

  Root.getApi(function(routeHtmlResponse) {
      res.send(routeHtmlResponse);
  });
  util.log("Sending api definitions by request ..");
};

module.exports = new RootController();
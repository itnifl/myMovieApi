var express = require('express');
var fs = require('fs');

require('./modelLoader.js');

/**
 * Automatically loads all files in the 'controllers' directory and adds the routes to the server middleware.
 * 
 * @class Router
 * @constructor
 */
function Router() {
  this.app = express();
  this.app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    
    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.send(200);
    } else {
      next();
    }
  });

  var self = this;
  fs.readdirSync('./controllers').forEach(function (file) {
    var controller = require('./controllers/' + file);

    if (controller.hasOwnProperty('routes')) {
      controller.routes.forEach(function (item) {
    	 self.addRoute(item[0], item[1], item[2]);
      });
    }
  });
};

/**
 * Starts the routing loop.
 * 
 * @param {Integer} [port=80] The TCP port to listen for incoming requests on.
 */
Router.prototype.Start = function(port) {
  port = port || 80;

  this.app.listen(port);
};

/**
 * Adds a function as a hook that runs before the request is routed.
 * 
 * @param {Function} callback A function that takes two parameters: request and response
 */
Router.prototype.addHook = function(callback) {
  if (typeof(callback) !== 'function') {
    throw 'Attempted to add hook with a non-function callback';
  }
  
  this.app.use(function(req, res, next) {
    callback(req, res);
    next();
  });
};

/**
 * Adds a new route.
 * 
 * @param {String} verb The HTTP verb to respond to. Accepts GET, POST, PUT, DELETE.
 * @param {String} route The route that will point to the callback function. Example: '/test'.
 * @param {Function} callback A function that takes two parameters: request and response
 */
Router.prototype.addRoute = function(verb, route, callback) {
  if (verb === undefined || verb.length <= 0) {
    throw 'Attempted to add route with undefined HTTP verb';
  }

  if (route === undefined || route.length <= 0) {
    throw 'Attempted to add route with undefined route';
  }

  if (typeof(callback) !== 'function') {
    throw 'Attempted to add route with a non-function callback';
  }
  
  availableVerbs = ['get', 'post', 'put', 'delete'];
  
  if (availableVerbs.indexOf(verb.toLowerCase()) > -1) {
	   this.app[verb](route, callback);
  } else {
    throw 'Attempted to add route with an invalid HTTP verb';
  }
};

/**
 * Gets all routes.
 */
Router.prototype.getRoutes = function() {
  return this.app.routes;
};

module.exports = new Router();
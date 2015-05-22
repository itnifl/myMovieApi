var express = require('express');
var session = require('express-session');
var fs = require('fs');
var util = require('util');
var MongoDB = require('./mongodb');
var config = require('./config');
var io;

require('./modelLoader.js');

/**
 * Automatically loads all files in the 'controllers' directory and adds the routes to the server middleware.
 * 
 * @class Router
 * @constructor
 */
function Router() {
  this.app = express();

  // Enables CORS
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

  //Initialize session handeling in nodejs:
  this.app.use(session({secret: 'MyMovieAppSessionSecret'}));

  //Server static content under the public folder:
  this.app.use(express.static(__dirname + '/public'));

  var self = this;

  fs.readdirSync('./controllers').forEach(function (file) {
    var controller = require('./controllers/' + file);

    if (controller.hasOwnProperty('routes')) {
      controller.routes.forEach(function (item) {
    	   self.addRoute(item[0], item[1], item[2], item[3], item[4]);
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

  io = require('socket.io').listen(this.app.listen(port));
  io.sockets.on('connection', function (socket) {
    var clientIp = socket.request.connection.remoteAddress;
    util.log("A client has connected via socket.io from ip: " + clientIp);
    /*var mongodb = new MongoDB(config.mongoServer, config.mongoPort);

    mongodb.open(function(connectionResponse) {
      mongodb.getAllMovieThumbs(function(thumbInfo) {
        socket.emit('updateThumbCount', thumbInfo);          
      });      
    });*/
  });
  util.log('Socket.io has started');
};

/**
 * Notifies every(if data is found) io.socket client to update the thumb counts of a movie.
 *
 * @param {String} _id The id of the movie in the MongoDb database.
 * @param {Function} callback The callnack function to be used.
 */
Router.prototype.notifyThumbChange = function(_id, callback) {  
  var mongodb = new MongoDB(config.mongoServer, config.mongoPort);

  if (config.debug) util.log("* [ThumbCount] Notify everyone to update thumb count.");
  mongodb.open(function(connectionResponse) {
    mongodb.getMovieThumbs(_id, function(thumbInfo) {
      if(thumbInfo.Response == false)  {
        if(config.verbosedebug) util.log('Failed to notify socket.io clients of thumbs on id \'' + _id + '\': ' + JSON.stringify(thumbInfo));
        io.socket.emit('updateThumbCount', thumbInfo);
        callback();         
      } else {
        if(config.verbosedebug) util.log('Successfully notified socket.io clients of thumbs on id \'' + _id + '\': '+ JSON.stringify(thumbInfo));
        io.sockets.emit('updateThumbCount', thumbInfo);
        callback();
      }               
    });      
  }); 
};

/**
 * Close the io.socket server.
 *.
 */
Router.prototype.ioServerClose = function() {  
  util.log("Closing the io.server by request via ioServerClose()");
  io.close();
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
 * @param {Function} callback A function that takes two parameters: request and response.
 * @param {String} ioSubscription The name of a io.secket function in the router that the route will able to access.
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
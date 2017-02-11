var util = require('util');
var async = require("async");
var BaseController = require('../baseController.js');
var config = require('../config');
var root = require('../server.js');

/**
 * Constructor.
 * 
 * @class UpdateThumbsController
 * @constructor
 */
function UpdateThumbsController() {
  this.routes = [
	 ['put', '/updateThumbs/:id/:integer/:md5fingerprint', this.putThumbs, 'Increments thumbs up (positive put :integer) and thumbs down (negative put :integer) on movie (put :id) in MongoDB identified by a :md5fingerprint']
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
  
  var session = req.session;
  session.md5fingerprint = req.params.md5fingerprint;

  if(!session.md5fingerprint.match(/[a-fA-F0-9]{32}/g)) {
    if(config.verbosedebug) util.log('Tried to enter UpdateThumbsController without a valid md5.');
    res.send({status: false, message: 'Tried to enter UpdateThumbsController without a valid md5.'});
  }

  if(session.md5fingerprint) {
    var UpdateThumbs = Model.get('UpdateThumbs').find(1);

    var thumbInteger = req.params.integer;
    var _id = req.params.id;

    if(!thumbInteger) {
      if(config.debug) util.log('Parameter integer was either 0 or non valued, exiting.');
      res.send({status: false});
    };
    if(!session.thumbUp) {
      session.thumbUp = {
        _id: false
      };
    }
    if(!session.thumbDown) {
      session.thumbDown = {
        _id: false
      };
    }

    if(_id != '' || typeof _id !== undefined) {
      if(session.thumbUp[_id] && thumbInteger > 0) {
        if(config.verbosedebug) util.log('Client (' + req.connection.remoteAddress + ') denied updating thumbUp count since this is already done once on movie with id ' + _id);
        res.send({status: false, message: 'You can only press thumb up once per movie'});
      } else if(session.thumbDown[_id] && thumbInteger < 0) {
        if(config.verbosedebug) util.log('Client (' + req.connection.remoteAddress + ') denied updating thumbDown count since this is already done once on movie with id ' + _id);
        res.send({status: false, message: 'You can only press thumb down once per movie'});
      } else {
        UpdateThumbs.update(thumbInteger, _id, function(response) {
          if(response.status != true && config.debug) util.log('Failed to update thumbs information on movie "' + response + '"');
          else {            
            async.waterfall([
              function(waterfall_callback) {
                if(thumbInteger > 0) session.thumbUp[_id] = true;
                if(thumbInteger < 0) session.thumbDown[_id] = true;
                waterfall_callback(null);
              },
              function(waterfall_callback) {
                if(thumbInteger > 0 && session.thumbDown[_id]) {
                  UpdateThumbs.remove(-1, _id, function(response) {
                    session.thumbDown[_id] = false;
                    root.notifyThumbChange(_id, function() {
                      res.send({status: true});
                      waterfall_callback(null);
                    });
                  });
                } else if(thumbInteger < 0 && session.thumbUp[_id]) {
                  UpdateThumbs.remove(1, _id, function(response) {
                    session.thumbUp[_id] = false;
                    root.notifyThumbChange(_id, function() {
                      res.send({status: true});
                      waterfall_callback(null);
                    });
                  });
                } else {
                  root.notifyThumbChange(_id, function() {
                    res.send({status: true});
                    waterfall_callback(null);
                  });              
                }
              }
            ], function(err) {
                if(err && config.debug) util.log("Received error after async waterfall in UpdateThumbsController.putThumbs(): " + err);
                if(err) return err;       
                util.log('Updated thumbs on movie with id ' + _id + ' successfully.');
              }     
            );
          };
        });
      }
    } else {
       if(config.debug) util.log('Parameter _id was either empty or undefined, exiting.');
       res.send({status: false})
    }
  } else {
    if(config.debug) util.log('Client does not have a session md5 hash, and is therefore not allowed to update thumb counts.');
    res.send({status: false});
  }
}

module.exports = new UpdateThumbsController();
var fs = require('fs');
var util = require('util');
var config = require('./config');
/**
 * Automatically loads all models in the 'models' directory.
 * 
 * @class ModelLoader
 * @constructor
 */
function ModelLoader() {
  this.models = {};
  
  var self = this;
  fs.readdirSync('./models').forEach(function (file) {
    var name = file.substr(0, file.length - 3);
    self.models[name] = require('./models/' + file);
    if(config.debug) util.log('Loaded module: ./models/' + file);    
  });
  if(config.debug) {
  	util.log('Registered modules:');
  	for(var index in self.models) {
  		util.log("   - " + index);
  	}
  }
};


/**
 * Gets a loaded model class by name.
 * 
 * @param {String} name The name of the model to get.
 * @returns {Function} The constructor function for the model.
 */
ModelLoader.prototype.get = function(name) {
  return this.models[name];
};
ModelLoader.prototype.getAll = function() {
  return this.models;
};

global.Model = new ModelLoader();
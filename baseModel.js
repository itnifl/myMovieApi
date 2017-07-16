var util = require('util');
var config = require('./config');
/**
 * Constructor.
 * 
 * @class BaseModel
 * @constructor
 */
function BaseModel() {};

BaseModel.getList = function(dir, callbackHandler) {
	var exec = require('child_process').exec;
	var async = require('async');
	var fs = require('fs');	
  	var folders = fs.readdirSync(dir);
  	var movieNames = new Array();
	
	async.each(folders, 
		function(folder, callback){
			if(config.debug) util.log("Executing: scripts/nameProcessor.pl \"" + folder + "\" at BaseModel.getList()");
			exec("perl scripts/nameProcessor.pl \"" + folder + "\"", function(err, stdout, stderr) {	
				if(config.debug) util.log("Pushing result to return list: '" + stdout + "' after reading '" + folder + "' at BaseModel.getList()");			
				if(stdout) movieNames.push(stdout);
                else util.log("nameProcessor.pl returned an empty string at BaseModel.getList(), is Perl installed on your system?");

                if (stderr) {
                    util.log(stderr);
                }
			    if (err) {
			        util.log(err);
			    }
			    callback();
			});	
	  	},
	  	function(err){
	  		if(config.debug) util.log("Returning: '" + movieNames + "' at at BaseModel.getList()");
	  		callbackHandler(movieNames);		
	  	}
	);		
};

/**
 * Finds an instance of a model based on the ID in the database.
 * 
 * @param {Integer} id The ID of the model instance to find.
 * @returns {Object} Instance of the model.
 */
BaseModel.find = function(id) {
  //console.log('Finding ' + this.name + ' model with id ' + id);
  return new this;
};


module.exports = BaseModel;
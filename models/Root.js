var _ = require('underscore');
var util = require('util');
var fs = require('fs');
var Handlebars = require('handlebars');
var config = require('../config');
var BaseModel = require('../baseModel.js');

/**
 * Constructor.
 * 
 * @class Root
 * @constructor
 */
function Root() {
  //
};
_.extend(Root, BaseModel);

/**
 * getApi function.
 * @param {Object} responseHandler ResponseHandler Callback
 */
Root.prototype.getApi = function(responseHandler) {
	var allRoutes = new Array();
	var allRoutesResult = new Array();
	var vars = '';
	fs.readdirSync('./controllers').forEach(function (file) {
	    allRoutes.push(require('../controllers/' + file));   
  	});	
	for (var i = 0; i < allRoutes.length; i++ ) {
        if (allRoutes[i].hasOwnProperty('routes')) {
          allRoutes[i].routes.forEach(function (item) {
            if(config.debug) console.log("   - Verb: " + item[0] + " - Route: " + item[1] + " - '" + item[3] + "'");
            allRoutesResult.push({verb : item[0], route: item[1], description: item[3] });
          });
        }
    }
    var handlebarsData = JSON.parse(JSON.stringify(allRoutesResult));
    try {
  		var source = fs.readFileSync('./views/RootView.template').toString();			  		
	    var template = Handlebars.compile(source);
	    	    
	    var wrapper = {objects: handlebarsData};
	    var htmlReturn = template(wrapper);	    
		responseHandler(htmlReturn);
	} catch (err) {
		if(config.debug) util.log('Failed to load RootView.template, ' + err);
		responseHandler(err);
	}
};

module.exports = Root;
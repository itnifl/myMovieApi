var config = require('../config');
var util = require('util');
require('../modelLoader');
var moviesAsList = Model.get('MoviesAsList').find(1);
var jsonResult = '';

module.exports = {  
    setUp: function(callback) {
        try {
            console.log('**Running Setup');
            moviesAsList.getAsList('movieDir', function(feedback) {                                            
                jsonResult = JSON.parse(feedback);
                callback();                   
            }); 
        } catch (err) {
            console.log('**Setting up failed:', err.message);
        }

    },
    tearDown: function(callback) {
        console.log('**Running Teardown');
        callback();
    },
    getMoviesAsList: function(test) {   
            test.expect(2);           
            console.log('**Running First set of Tests(2)');
            //if(config.debug) console.log("JSON found: " + JSON.stringify(jsonResult, undefined, 2));
            if(config.debug && jsonResult != '') console.log("Got JSON array with size: " + jsonResult.length);
            test.ok(jsonResult != '' && jsonResult.length > 0, "Test if jsonResult has content..");
            //if(config.debug) console.log("Showing first JSON obj found: " + JSON.stringify(jsonResult[0], undefined, 2));
            test.ok(jsonResult[0].Response == "True" || jsonResult[0].Response == "False", "Test if at least the first json object has response set to either true or false..");
            test.done();                            
    }
}; 

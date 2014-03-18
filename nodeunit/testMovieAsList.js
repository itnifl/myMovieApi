var config = require('../config');
var util = require('util');
var colors = require('colors');
var jsonResult = '';

module.exports = {  
    setUp: function(callback) {
        try {
            console.log('**Running Test Setup'.yellow);
            require('../modelLoader');
            var moviesAsList = Model.get('MoviesAsList').find(1);
            moviesAsList.getAsList('movieDir', function(feedback) {                                            
                jsonResult = JSON.parse(feedback);
                callback();                   
            }); 
        } catch (err) {
            console.log('**Setting up test failed:'.red, err.message);
        }

    },
    tearDown: function(callback) {
        console.log('**Running Test Teardown'.yellow);
        callback();
    },
    getMoviesAsList: function(test) {   
            test.expect(2);           
            console.log('**Running tests: '.yellow + '(2)');
            //if(config.debug) console.log("JSON found: " + JSON.stringify(jsonResult, undefined, 2));
            if(config.debug && jsonResult != '') console.log("**Got JSON array with size: ".yellow + jsonResult.length);
            test.ok(jsonResult != '' && jsonResult.length > 0, "Failed test if jsonResult has content..");
            //if(config.debug) console.log("Showing first JSON obj found: " + JSON.stringify(jsonResult[0], undefined, 2));
            test.ok(jsonResult[0].Response == "True" || jsonResult[0].Response == "False", "Failed test if irst json object has response attribute set to either true or false..");
            test.done();                            
    }
}; 
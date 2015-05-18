var config = require('../config');
var util = require('util');
var colors = require('colors');
var jsonResult1 = '';
var jsonResult2 = '';

module.exports = {  
    setUp: function(callback) {
        try {
            console.log('**Running Test Setup'.yellow);
            require('../modelLoader');
            var moviesAsList = Model.get('MoviesAsList').find(1);
            moviesAsList.getAsList('movieDir', '', function(feedback) {                                            
                jsonResult1 = JSON.parse(feedback); 
                moviesAsList.getAsList('movieDir', 'District 9', function(feedback) {                                            
                    jsonResult2 = JSON.parse(feedback);
                    callback();                   
                });                 
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
            test.expect(4);           
            console.log('**Running tests: '.yellow + '(4)');
            if(config.debug && jsonResult1 != '') console.log("**Got JSON array 1 with size: ".yellow + jsonResult1.length);
            test.ok(jsonResult1 != '' && jsonResult1.length > 0, "Failed test if jsonResult1 has content..");
            test.ok(jsonResult1[0].Response == "True" || jsonResult1[0].Response == "False", "Failed test if irst json object has response attribute set to either true or false..");
            
            if(config.debug && jsonResult2 != '') console.log("**Got JSON array 2 with size: ".yellow + jsonResult2.length);
            test.ok(jsonResult2 != '' && jsonResult2.length > 0, "Failed test if jsonResult2 has content..");
            test.ok(jsonResult2[0].Response == "True" || jsonResult2[0].Response == "False", "Failed test if irst json object has response attribute set to either true or false..");

            test.done();                            
    }
}; 
var config = require('../config');
var util = require('util');
var colors = require('colors');
var routeResponse = '';

module.exports = {  
    setUp: function(callback) {
        try {
            console.log('**Running Test Setup'.yellow);
            require('../modelLoader');
            var root = Model.get('Root').find(1);
            root.getApi(function(response) {                                            
                routeResponse = response;                            
                callback();                   
            }); 
        } catch (err) {
            console.log('**Setting up test failed:'.red, err.message);
            console.log('Error:'.red, err);
        }

    },
    tearDown: function(callback) {
        console.log('**Running Test Teardown'.yellow);
        callback();
    },
    testRoot: function(test) {   
        test.expect(2);           
        console.log('**Running tests: '.yellow + '(1)');
        if(config.debug) console.log("**Got response with length: ".yellow + routeResponse.length);
        test.ok(routeResponse.length > 0, "Failed testing that we did not receive an empty result..");
        var testForHtmlResult = /<[a-z][\s\S]*>/i;
        test.ok(testForHtmlResult.test(routeResponse), "Failed testing if we received html (dependencyless view)..");    
        test.done();                            
    }
}; 
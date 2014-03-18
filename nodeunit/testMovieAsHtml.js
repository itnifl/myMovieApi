var config = require('../config');
var util = require('util');
var colors = require('colors');
var htmlResult = '';
var htmlResultWithDependencies = '';

module.exports = {  
    setUp: function(callback) {
        try {
            console.log('**Running Test Setup'.yellow);
            require('../modelLoader');
            var moviesAsHtml = Model.get('MoviesAsHtml').find(1);
            moviesAsHtml.getAsHTML('movieDir', false, function(feedback) {                                            
                htmlResult = feedback;               
            });
            moviesAsHtml.getAsHTML('movieDir', true, function(feedback) {                                            
                htmlResultWithDependencies = feedback;
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
    getMoviesAsHtml: function(test) {   
            test.expect(4);           
            console.log('**Running tests: '.yellow + '(4)');
            if(config.debug) console.log("**Got first string with length: ".yellow + htmlResult.length);
            if(config.debug) console.log("**Got second string with length: ".yellow + htmlResultWithDependencies.length);
            var testForHtmlResult = /<[a-z][\s\S]*>/i;

            test.ok(htmlResult.length > 0, "Failed testing that we did not receive an empty string (dependencyless view)..");
            test.ok(testForHtmlResult.test(htmlResult), "Failed testing if we received html (dependencyless view)..");
            test.ok(htmlResultWithDependencies.length > 0, "Failed testing that we did not receive an empty string (view including dependencies)..");
            test.ok(testForHtmlResult.test(htmlResultWithDependencies), "Failed testing if we received html (view including dependencies)..");  
            test.done();                            
    }
}; 
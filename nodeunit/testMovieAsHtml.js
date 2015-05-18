var config = require('../config');
var util = require('util');
var colors = require('colors');
var htmlResultSmall = '';
var htmlResultSmallWithDependencies = '';
var htmlResultLarge = '';
var htmlResultLargeWithDependencies = '';

module.exports = {  
    setUp: function(callback) {
        try {
            console.log('**Running Test Setup'.yellow);
            require('../modelLoader');
            var moviesAsHtml = Model.get('MoviesAsHtml').find(1);
            moviesAsHtml.getAsHTML('movieDir', true, false, function(feedback) {                                            
                htmlResultSmall = feedback; 
                moviesAsHtml.getAsHTML('movieDir', true, true, function(feedback) {                                            
                    htmlResultSmallWithDependencies = feedback;
                    moviesAsHtml.getAsHTML('movieDir', false, false, function(feedback) {                                            
                        htmlResultLarge = feedback;  
                        moviesAsHtml.getAsHTML('movieDir', false, true, function(feedback) {                                            
                            htmlResultLargeWithDependencies = feedback;
                            callback();                   
                        });               
                    });                  
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
    getMoviesAsHtml: function(test) {   
            test.expect(8);           
            console.log('**Running tests: '.yellow + '(8)');
            if(config.debug) console.log("**Got first html string with length: ".yellow + htmlResultSmall.length);
            if(config.debug) console.log("**Got second html string with length: ".yellow + htmlResultSmallWithDependencies.length);
            if(config.debug) console.log("**Got third html string with length: ".yellow + htmlResultLarge.length);
            if(config.debug) console.log("**Got fourth html string with length: ".yellow + htmlResultLargeWithDependencies.length);
            var testForHtmlResult = /<[a-z][\s\S]*>/i;

            test.ok(htmlResultSmall.length > 0, "Failed testing that we did not receive an empty string (dependencyless view)..");
            test.ok(testForHtmlResult.test(htmlResultSmall), "Failed testing if we received html (dependencyless view)..");
            test.ok(htmlResultSmallWithDependencies.length > 0, "Failed testing that we did not receive an empty string (view including dependencies)..");
            test.ok(testForHtmlResult.test(htmlResultSmallWithDependencies), "Failed testing if we received html (view including dependencies)..");  

            test.ok(htmlResultLarge.length > 0, "Failed testing that we did not receive an empty string (dependencyless view)..");
            test.ok(testForHtmlResult.test(htmlResultLarge), "Failed testing if we received html (dependencyless view)..");
            test.ok(htmlResultLargeWithDependencies.length > 0, "Failed testing that we did not receive an empty string (view including dependencies)..");
            test.ok(testForHtmlResult.test(htmlResultLargeWithDependencies), "Failed testing if we received html (view including dependencies)..");  
            test.done();                            
    }
}; 
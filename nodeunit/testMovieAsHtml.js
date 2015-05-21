var config = require('../config');
var colors = require('colors');
var htmlResultSmall = '';
var htmlResultSmallWithDependencies = '';
var htmlResultLarge = '';
var htmlResultLargeWithDependencies = '';
var htmlResultListWithDependencies = '';

module.exports = {  
    setUp: function(callback) {
        try { //dir, reqRoutePath, includedependencies, responseHandler)
            console.log('**Running Test Setup'.yellow);
            require('../modelLoader');
            var moviesAsHtml = Model.get('MoviesAsHtml').find(1);
            moviesAsHtml.getAsHTML('movieDir', '/moviesAsHTML/', false, function(feedback) {                                            
                htmlResultSmall = feedback; 
                moviesAsHtml.getAsHTML('movieDir', '/moviesAsHTML/:includedependencies', true, function(feedback) {                                            
                    htmlResultSmallWithDependencies = feedback;
                    moviesAsHtml.getAsHTML('movieDir', '/moviesAsHTML/large/', false, function(feedback) {                                            
                        htmlResultLarge = feedback;  
                        moviesAsHtml.getAsHTML('movieDir', '/moviesAsHTML/large/:includedependencies', true, function(feedback) {                                            
                            htmlResultLargeWithDependencies = feedback;
                            moviesAsHtml.getAsHTML('movieDir', '/moviesAsHTML/large/:includedependencies', true, function(feedback) {                                            
                                htmlResultListWithDependencies = feedback;
                                callback();                   
                            });                  
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
            test.expect(10);           
            console.log('**Running tests: '.yellow + '(10)');
            if(config.debug) console.log("**Got first html string with length: ".yellow + htmlResultSmall.length);
            if(config.debug) console.log("**Got second html string with length: ".yellow + htmlResultSmallWithDependencies.length);
            if(config.debug) console.log("**Got third html string with length: ".yellow + htmlResultLarge.length);
            if(config.debug) console.log("**Got fourth html string with length: ".yellow + htmlResultLargeWithDependencies.length);
            if(config.debug) console.log("**Got fifth html string with length: ".yellow + htmlResultListWithDependencies.length);
            var testForHtmlResult = /<[a-z][\s\S]*>/i;

            test.ok(htmlResultSmall.length > 0, "Failed testing that we did not receive an empty string (small dependencyless view)..");
            test.ok(testForHtmlResult.test(htmlResultSmall), "Failed testing if we received html (small dependencyless view)..");
            test.ok(htmlResultSmallWithDependencies.length > 0, "Failed testing that we did not receive an empty string (small view including dependencies)..");
            test.ok(testForHtmlResult.test(htmlResultSmallWithDependencies), "Failed testing if we received html (small view including dependencies)..");  

            test.ok(htmlResultLarge.length > 0, "Failed testing that we did not receive an empty string (large dependencyless view)..");
            test.ok(testForHtmlResult.test(htmlResultLarge), "Failed testing if we received html (large dependencyless view)..");
            test.ok(htmlResultLargeWithDependencies.length > 0, "Failed testing that we did not receive an empty string (large view including dependencies)..");
            test.ok(testForHtmlResult.test(htmlResultLargeWithDependencies), "Failed testing if we received html (large view including dependencies)..");  
            
            test.ok(htmlResultListWithDependencies.length > 0, "Failed testing that we did not receive an empty string (list view including dependencies)..");
            test.ok(testForHtmlResult.test(htmlResultListWithDependencies), "Failed testing if we received html (list view including dependencies)..");  

            test.done();                            
    }
}; 
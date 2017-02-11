var config = require('../config');
var colors = require('colors');
var routeResponse = '';

module.exports = {  
    setUp: function(callback) {
        try {
            console.log('**Running Test Setup'.yellow);
            require('../modelLoader');
            var UpdateThumbs = Model.get('UpdateThumbs').find(1);
            UpdateThumbs.update(1, "53c2855c0ae7ecfe2aefc516", function(response) {    
                if(config.debug) console.log("**Got response: ".yellow + typeof cachedMovie == 'object' ? JSON.stringify(response) : response);                                        
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
        console.log('**Running tests: '.yellow + '(2)');
        if(config.debug) console.log("**Got response of type: ".yellow + typeof routeResponse);
        test.ok(typeof routeResponse == 'object' , "Failed testing that we received a object as a response");
        test.ok(routeResponse.status, "Failed testing if status of the object was true, something wrong happened");     
        test.done();                         
    }
}; 
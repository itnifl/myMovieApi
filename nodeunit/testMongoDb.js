var config = require('../config');
var colors = require('colors');
var mongodb, saveResponse, getResponse, updateLikeResponse;

var jSonMovie = {
    "Title":"Skyline",
    "Year":"2010",
    "Rated":"PG-13",
    "Released":"12 Nov 2010",
    "Runtime":"94 min",
    "Genre":"Action, Sci-Fi, Thriller",
    "Director":"Colin Strause, Greg Strause",
    "Writer":"Joshua Cordes, Liam O'Donnell",
    "Actors":"Eric Balfour, Scottie Thompson, Brittany Daniel, Crystal Reed",
    "Plot":"Jarrod and his pregnant girlfriend Elaine travel to Los Angeles to meet his old friend and successful entrepreneur Terry, and his wife Candice. Terry gives a party in his apartment for ...",
    "Language":"English",
    "Country":"USA",
    "Awards":"N/A",
    "Poster": "http://nodenet.homelinux.net:3000/getImage/MV5BMjAwNDkwOTc5M15BMl5BanBnXkFtZTcwMTE2MTMwNA@@._V1_SX300.jpg",
    "Metascore":"26",
    "imdbRating":"4.4",
    "imdbVotes":"65,030",
    "imdbID":"tt1564585",
    "Type":"movie",
    "Response":"True",
    "thumbsUp": 1
};

module.exports = {  
    setUp: function(mainCallback) {
        try {
            console.log('**Running Test Setup'.yellow);
            var MongoDB = require('../mongodb');
            console.log('**Creating mongodb object'.yellow);
            mongodb = new MongoDB(config.mongoServer, config.mongoPort);
            mongodb.open(function(err) {
                if(err) return;
                mongodb.saveMovie(jSonMovie, function(firstResponse) {
                    //console.log('**Got saveResponse: '.yellow + firstResponse);
                    saveResponse = firstResponse;           
                    mongodb.getMovie('Skyline', function(movie) {
                        //console.log('**Got getResponse: '.yellow + secondResponse);
                        getResponse = movie;
                        mongodb.updateMovieThumbs(movie._id, 1, function(thirdResponse) {
                            //console.log('**Got getResponse: '.yellow + thirdResponse);
                            updateLikeResponse = thirdResponse;
                            mongodb.close();
                            mainCallback();
                        });
                    });
                });                
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
    testMongoDB: function(test) {   
        test.expect(3);           
        console.log('**Running tests: '.yellow + '(3)');
        //if(config.debug) console.log("**Got mongodb of type: ".yellow + (typeof mongodb));
        test.ok(saveResponse.status == 'success', "Failed saving to mongodb, check config.");
        if(config.debug) console.log("**Got saveResponse : ".yellow + JSON.stringify(saveResponse, undefined, 2));
        test.ok(typeof getResponse !== 'undefined' && getResponse.Response, "Failed fetching movie from mongodb, check config.");
        if(config.debug) console.log("**Got getResponse : ".yellow + JSON.stringify(getResponse, undefined, 2));
        test.ok(typeof updateLikeResponse !== 'undefined' && updateLikeResponse.Response, "Failed updating thombs on movie in mongodb.");
        if(config.debug) console.log("**Got updateLikeResponse : ".yellow + JSON.stringify(updateLikeResponse, undefined, 2));
        test.done();                            
    }
}; 
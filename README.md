My Movie API
============

Initial Comments
----------------
This API uses omdbapi.com to fetch information about movies, thank you omdbapi.com! The movie names that it uses to fetch information with are files and folder names in a given source directory set in configuration.

 This API will show favourite movies both as a list made in JSON and as html that can be used or embedded.
###  The commandments:
	1. All shall be nodeunit tested.
	2. All shall be re-usable.
	3. All shall be MVC structured.
	4. All errors shall be handled gracefully.
	
### The project shall take in use:
	1. Nodejs as base system.
	2. Various packages for nodejs listed in package.json.
	3. Perl scripts for for pre-made functionality.
	4. Mongodb for caching

### NB!! This code works as is, but it is not fully ready yet. The following is missing:
	1. Code for caching in mongodb. This functionality does not exist yet.
	2. Installation instructions for a mongodb ready system.
	3. Several routes and different templates can be used and added. These functionalities do not exist yet.


Prerequisites
-------------
My Movie API installation and operation requires that the following software is installed:

	1. node.js
	2. npm
	3. perl (only v5.14.2 tested)
	4. mongodb if you want this system to cache results from api(recommended).
	5. jQuery and Bootstrap may need to be included in the site which you insert the html response

Installing Prerequisites
------------------------
Install node.js and npm using the following command:

Debian: `sudo apt-get install nodejs` RedHat: `sudo yum install npm`

Take a look at these guides for installing mongodb:
http://docs.mongodb.org/manual/tutorial/install-mongodb-on-ubuntu/
http://docs.mongodb.org/manual/tutorial/install-mongodb-on-windows/
http://docs.mongodb.org/manual/tutorial/install-mongodb-on-red-hat-centos-or-fedora-linux/

Introduction to jQuery:
http://learn.jquery.com/about-jquery/how-jquery-works/

On Bootstrap:
http://getbootstrap.com/getting-started/

Installing
----------
Create a new directory for the application and change to it.

`mkdir -p /opt/nodejs/mymovieapi && cd $_`

Download the latest stable version from Git with the following command:

`git clone https://github.com/itnifl/myMovieApi.git -b master .`

Update all dependencies using the following command:

`npm install`

Start the application using the following command:

`node server.js`

Upgrading
---------
Stop the application.

Update the application from Git using the following command:

`git pull`

Update all dependencies using the following command:

`npm install`

Start the application using the following command:

`node server.js`

Removing
--------
Stop the application.

Delete the top level directory of the application.

Example usage
-------------

```
$.get( "http://yourApiHostnameHere:3000/moviesAsHTML", function(data) {
	$('#divField').hide('fast', function() {
		$(this).css('opacity',0.0).empty();
		$(this).show('fast', function() {
			$(this).css('opacity',1.0);
			$('#divField')
		        .hide()
		        .css('opacity',0.0)
		        .html(data)
		        .slideDown('fast')
		        .animate({opacity: 1.0});
	
		});							
});
```
###Following routes exist:
	1. '/' - lists all routes and theyr descriptions.
	2. '/moviesAsHTML' - returns all movies in folder specified in sourceDir in config.js as a Bootstrap Carousel, but does not include dependecies(jQuer and Bootstrap).
	3. '/moviesAsHTML/true' - returns all movies in folder specified in sourceDir in config.js as a Bootstrap Carousel, and does include dependecies.
	4. '/moviesAsList - returns jSON formattet information about all movies in folder specified in variable sourceDir in config.js as presented by omdbapi.com.
	5. '/getImage/:image'  - returns a cached image and returns it to the client, given that you know the file name and give it as the argument :image.

Maintainers
-----------
Current maintainers of the MyMovieApi project:

Atle Holm (atle@team-holm.net)

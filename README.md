My Movie API
============

Initial Comments
----------------
This API uses omdbapi.com to fetch information about movies, thank you omdbapi.com! The movie names that it uses to fetch information with are files and folder names in a given source directory set in configuration. For example html look at carousel at http://www.team-holm.net

 This API will show favourite movies both as a list made in JSON and as html that can be used or embedded.
###  The commandments:
	1. All shall be nodeunit tested.
	2. All shall be re-usable.
	3. All shall be MVC structured.
	4. All errors shall be handled gracefully(as good as a good try gets).
	
### The project takes in use:
	1. Nodejs as base system.
	2. Various packages for nodejs listed in package.json.
	3. Perl scripts for for pre-made functionality.
	4. Mongodb for caching

### NB!! This code works as is, but more can be added:
- Several routes for different html templates can be used and added. 
- Various other things in my private notes.


Prerequisites
-------------
My Movie API installation and operation requires that the following software is installed:

	1. node.js
	2. npm
	3. perl (only v5.14.2 tested)
	4. mongodb if you want this system to cache results from api(recommended).
	5. jQuery and Bootstrap may need to be included depending on the API route you choose.
	6. jQuery and jShowOff may need to be included depending on the API route you choose.

Installing Prerequisites
------------------------
Install node.js and npm using the following command:

Debian: `sudo apt-get install nodejs` RedHat: `sudo yum install npm`

Install Perl using the following command:

Debian: `sudo apt-get install perl` RedHat: `sudo yum install perl`

Take a look at these guides for installing mongodb on the system where you run MyMovieAPI:
- http://docs.mongodb.org/manual/tutorial/install-mongodb-on-ubuntu/
- http://docs.mongodb.org/manual/tutorial/install-mongodb-on-windows/
- http://docs.mongodb.org/manual/tutorial/install-mongodb-on-red-hat-centos-or-fedora-linux/

When done, create the database movies as such from the Linux console.
`mongo movies`

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

Make sure dependencies are met before we install the modules(Ubuntu):

`apt-get install gcc make build-essential`

Update all dependencies using the following command:

`npm install`

Set up necessary variables by editing config.js.

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
To insert into a div tag with ID divField:

```javascript
$.get("http://yourApiHostnameHere:3000/moviesAsHTML/true", function(data) {
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

If the view dependencies crash with what you already have on your page, you can insert the API results into a iframe. Here the iframe has the id preview-iframe:

```javascript
$.get("http://nodenet.homelinux.net:3000/moviesAsHTML/large/true", function(data) {
     $('#preview-iframe').hide('show', function() {
		$(this).css('opacity',0.0).empty();
		$(this).show('fast', function() {
			$(this).css('opacity',1.0);
			$('#preview-iframe')
				.hide()
				.css('opacity',0.0)
				.slideDown('fast')
				.animate({opacity: 1.0});
				var iframe =  $('#preview-iframe');
				var idoc = iframe[0].contentDocument;
				idoc.open();
				idoc.write(data);
				idoc.close();	    
		});
	});							
});
```

### Following routes exist:
	1. '/' - lists all routes and theyr descriptions.
	2. '/moviesAsHTML' - returns all movies in folder specified in sourceDir in config.js as a Bootstrap Carousel, but does not include dependecies(jQuer and Bootstrap).
	3. '/moviesAsHTML/true' - returns all movies in folder specified in sourceDir in config.js as a Bootstrap Carousel, and does include dependecies.
	4. '/moviesAsHTML/large/:includedependencies' - displays all movies in sourceDir as HTML carousel with jsShowOff and includes dependencies(jQuery and jsShowOff).
	5. '/moviesAsList - returns jSON formattet information about all movies in folder specified in variable sourceDir in config.js as presented by omdbapi.com.
	6. '/moviesAsList?movieNameFilter=movieName'	-  returns jSON formattet information about only the movie specified as movieName.
	7. '/getImage/:image'  - returns a cached image and returns it to the client, given that you know the file name and give it as the argument :image.
	8. '/moviesAsHTMLList'	- return all movies in sourceDir as HTML tabled list and includes jQuery and Bootstrap
	9. '/updateThumbs/:id/:integer/:md5fingerprint'	- updates the thumb info of a movie with :id. Md5fingerprint needed as session identifier. This is derived from the client as an identificator of the client.

All routes are found under http://yourhostname:port/ of the running MyMovieApi system.

### Thank you:
- http://omdbapi.com
- http://ekallevig.com/jshowoff/
- http://getbootstrap.com/
- https://gist.github.com/splosch/eaacc83f245372ae98fe
- https://github.com/HubSpot/pace

Maintainers
-----------
Current maintainers of the MyMovieApi project:

Atle Holm (atle@team-holm.net)
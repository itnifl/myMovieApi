var config = require('./config');
var util = require('util');
var router = require('./router');

router.Start(config.serverPort);
util.log("Listening on port: " + config.serverPort)
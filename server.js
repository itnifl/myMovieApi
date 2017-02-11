var config = require('./config');
var util = require('util');
var router = require('./router');

router.Start(config.serverPort);
exports.notifyThumbChange = router.notifyThumbChange;
exports.ioServerClose = router.ioServerClose;

util.log("Listening on port: " + config.serverPort)
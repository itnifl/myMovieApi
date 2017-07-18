var config = require('./config');
var util = require('util');
var router = require('./router');

if (config.verbosedebug && !config.debug) {
    config.debug = true;
    util.log('Verbosedebug was set to true, but debug to false. Verbosedebug automatically sets debug to true.');
}

router.Start(config.serverPort);
exports.notifyThumbChange = router.notifyThumbChange;
exports.ioServerClose = router.ioServerClose;

util.log("Listening on port: " + config.serverPort)
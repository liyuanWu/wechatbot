const main = require('./main.js');
const eventbus = require('./eventbus.js').eventbus;
eventbus.emit('error', new Error('whoops!'));

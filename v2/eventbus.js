const EventEmitter = require('events');

class MyEmitter extends EventEmitter {}

exports.eventbus = new MyEmitter;

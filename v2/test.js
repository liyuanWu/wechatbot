const main = require('./main.js');
const eventbus = require('./eventbus.js').eventbus;
eventbus.on("bot.ready", () => {
    eventbus.emit('bot.send', 'test message', {room: 'Story Room - 01'});
});

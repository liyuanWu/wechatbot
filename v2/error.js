const eventbus = require("./eventbus.js").eventbus;

eventbus.on('error', (err) => {
    console.error('whoops! there was an error');
    console.error(err);
});

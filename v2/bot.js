const eventbus = require('./eventbus.js').eventbus;
const { Wechaty, Room } = require('wechaty');

async function onLogin() {

    eventbus.on('bot.send', async (message, option) => {
        var sender;
        if(option.contact){
            sender = await Contact.find({name: option.contact});
        }else{
            sender = await Room.find({name: option.room});
        }
        if(sender){
            if(option.media){
                await sender.say(new MediaMessage(option.media));
                return;
            }
            await sender.say(message);
        }
    });

}

Wechaty.instance()
	.on('scan', (url, code) => {
        if (!/201|200/.test(String(code))) {
            const loginUrl = url.replace(/\/qrcode\//, '/l/')
            require('qrcode-terminal').generate(loginUrl)
        }
		console.log(url)
	})

	.on('login', user => {
		console.log(`${user} login`)
        console.log('init bot in eventbus');
        onLogin();
        eventbus.emit('bot.ready');
	})

	.on('message', async function (m) {
		const contact = m.from()
		const content = m.content()
		const room = m.room()

		if (room) {
			console.log(`Room: ${room.topic()} Contact: ${contact.name()} Content: ${content}`)
		} else {
			console.log(`Contact: ${contact.name()} Content: ${content}`)
		}
	})

	.init()

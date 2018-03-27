const { Wechaty, Room } = require('wechaty')

var currentPages = {};
var linkses = {};
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
	})

	.on('friend', async function (contact, request) {
		if (request) {
			await request.accept()
			console.log(`Contact: ${contact.name()} send request ${request.hello}`)
		}
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


		if (m.self()) {
			return
		}

		if (room && room.topic().indexOf('Story Room') > -1)
		{
			const topic = room.topic();
			var currentPage = currentPages[room.topic()];
			var links = linkses[room.topic()];
			var trything = require("./try.js");	
			if( links && links.indexOf(content) > -1){
				trything.post(content, currentPage, async function(c){
					currentPages[topic] = c;
					let keyroom = await Room.find({ topic: topic })
					if (keyroom) {
						var result = trything.parse(c)
						await keyroom.say(result.main);
						links = result.links;
						linkses[topic] = Object.keys(links);
						linkStr = "***** ACTIONS *****\n";
						Object.keys(links).forEach( function(key){ linkStr += "type " + key + " - " + links[key]+"\n" });
						await keyroom.say(linkStr);
					}
				});
				return
			}
			if( currentPage ){
				var result = trything.parse(currentPage)
						await keyroom.say(result.main);
						links = result.links;
						linkses[topic] = Object.keys(links);
						linkStr = "***** ACTIONS *****\n";
						Object.keys(links).forEach( function(key){ linkStr += "type " + key + " - " + links[key]+"\n" });
						await keyroom.say(linkStr);
				return
			}
			trything.get( async function(c){
				currentPages[topic] = c;
				let keyroom = await Room.find({ topic: topic })
				if (keyroom) {
					var result = trything.parse(c)
					await keyroom.say(result.main);
					links = result.links;
					linkses[topic] = Object.keys(links);
					linkStr = "***** ACTIONS *****\n";
					Object.keys(links).forEach( function(key){ linkStr += "type " + key + " - " + links[key]+"\n" });
					await keyroom.say(linkStr);
				}
			});
			return
		}

		if (/hello/.test(content)) {
			m.say("hello how are you")
		}

		if (/room/.test(content)) {
			let keyroom = await Room.find({ topic: "test" })
			if (keyroom) {
				await keyroom.add(contact)
				await keyroom.say("welcome!", contact)
			}
		}

		if (/out/.test(content)) {
			let keyroom = await Room.find({ topic: "test" })
			if (keyroom) {
				await keyroom.say("Remove from the room", contact)
				await keyroom.del(contact)
			}
		}
	})

	.init()

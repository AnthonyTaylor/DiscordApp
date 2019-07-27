var filmsApp = require("./films.js");
var fs = require("fs");

//grabs the message and client to decide if it needs to respond
//convert to switch case
this.chat = function (msg, client) {
	if (msg.content.startsWith("/uptime")) {
		msg.reply(commUptime(client.uptime));
		allCommand(msg.content);
	}else if (msg.content.startsWith("/film ") || msg.content.startsWith("/unseen ")) {
		filmsApp.chat(msg);
		allCommand(msg.content);
	}else if (msg.content.startsWith("/help")) {
		fs.readFile("files/help.txt", "utf8", function(err, contents) {
			if (err) throw err;
			msg.reply(contents);
			allCommand(msg.content);
		});
	} else if(msg.content.startsWith("/exit")){
		if(msg.author.id == "262523692821512194"){ //xzanium's ID
			msg.channel.send("shutting down bot");
			console.log(`Bot shutdown by ${msg.member.user.tag}`);
			client.destroy();
		} else {
			msg.reply("Only xzanium can shutdown the bot");
		}
	}
}

function commUptime(up) {
	let seconds = Math.floor(up / 1000);

	let days     = Math.floor(seconds / (24*60*60));
	seconds -= days    * (24*60*60);
	let hours    = Math.floor(seconds / (60*60));
	seconds -= hours   * (60*60);
	let minutes  = Math.floor(seconds / (60));
	seconds -= minutes * (60);
	return ((days > 0)?(days + " day, "):"") + hours + "h, " + minutes + "m and " + seconds + "s";
}

function allCommand(comm) {
	console.log(`Command completed: ${comm}`);
}

//msg.reply('message');
//msg.channel.send('message');
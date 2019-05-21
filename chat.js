var filmsApp = require("./films.js");
var fs = require("fs");

//grabs the message and client to decide if it needs to respond
//convert to switch case
this.chat = function (msg, client) {
	if (msg.content.startsWith("/uptime")) {
		msg.reply(commUptime(client.uptime));
		allCommand();
	}else if (msg.content.startsWith("/film ")) {
		filmsApp.chat(msg, client);
		allCommand();
	}else if (msg.content.startsWith("/help")) {
		fs.readFile("files/help.txt", "utf8", function(err, contents) {
			if (err) throw err;
			msg.reply(contents);
			allCommand();
		});
	}
}

function commUptime(up) {
	let seconds = Math.floor(up / 1000);
	// day, h, m and s
	let days     = Math.floor(seconds / (24*60*60));
	seconds -= days    * (24*60*60);
	let hours    = Math.floor(seconds / (60*60));
	seconds -= hours   * (60*60);
	let minutes  = Math.floor(seconds / (60));
	seconds -= minutes * (60);
	return ((days > 0)?(days + " day, "):"") + hours + "h, " + minutes + "m and " + seconds + "s";
}

function allCommand() {
	console.log("Command completed");
}

//msg.reply('message');
//msg.channel.send('message');
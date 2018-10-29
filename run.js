//secret credentials
require("dotenv").config();

//my files
var chatApp = require("./chat.js");

//discord setup
const Discord = require("discord.js");
const client = new Discord.Client();

client.on("ready", ()=> {
	console.log("Logged in as xzanium-bot#1729");
});

client.on("message", msg => {
	chatApp.chat(msg, client);
});

client.login(process.env.BOT_CLIENT_ID);
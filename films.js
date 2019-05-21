"use strict";

const MongoClient = require("mongodb").MongoClient;
const MongoUrl = process.env.DB_CONN;
const DB = process.env.DB;
const coll = process.env.coll;

//message passed from chat.js
this.chat = function(msg, client){
	//turn user entered command into an array, stripping "/film " one word per element, seperated by a space
	var	command = msg.content.substring(6).split(" ");  
	//preps empty array to send as search query
	var mQuery = {};
	switch(command[0].toLowerCase()) {
		case "list":
		find(mQuery, msg);
		break;
		case "seen":
		if (command[1] && command[2]){
			//use command.slice(2) and send, with seen, as only args, cutting /film seen, sending the rest as an array
			updateDB('seen', parseInt(command[1]), command[2].toLowerCase(), msg);
		}else{
			msg.reply("\n **Invalid input**");
		}	
		break;
		case "unseen":
		if (command[1] && command[2]){
			updateDB('unseen', parseInt(command[1]), command[2].toLowerCase(), msg);
		}else{
			msg.reply("**\n Invalid input**");
		}	
		break;
		default:
		//ensures both are strings prior to use
		if (command[1]){
			var comm1 = command[0].toLowerCase();
			var comm2 = command[1].toLowerCase();
			
			//prepares Mongo query
			//note: unless otherwise stated the variable at the start of the object will be treated as plaintext
			//in order to use the value held within the variable it needs to be enclosed in square brackets
			mQuery = (comm2 == "seen")? { [comm1]: "seen" } : { [comm1]: {$not: "seen" }}; //TEST THIS
			//console.log(mQuery)
			find(mQuery, msg);
		}else {
			msg.reply("\n **Invalid input**");
		}
		break;
	}
}
/*
params
mQuery: (object) - search query, such as {ant: "seen"}
accepts empty object to search for all
*/
function find(mQuery, msg){
	//connect to the database and collection
	MongoClient.connect(MongoUrl, {useNewUrlParser: true }, function(err, db) {
		if (err) throw err;
		var dbo = db.db(DB);
		var response = "";
		//send the query to the database and convert the response to an array
		dbo.collection(coll).find(mQuery).toArray(function(err, result) {
			if (err) throw err;
			//console.log(JSON.stringify(result, null, 2));
			
			//Check if the result of the MongoDB query is empty
			if(result === undefined || result.length == 0){
				response += "**Error:** No results found"
			}else{
				//for each object in the array, add the ID and name to the response
				response = result.map(x => x.ID + " " + x.name).reduce((a, b) => a + "\n" + b);
			}
			//send the response and close the database connection
			msg.reply("\n" + response);
			db.close();
		});
	});
}

/*
params
val: (string) - seen / unseen
num: (number) - ID of the film
name: (string) - name of the person to be updated
*/
function updateDB(val, num, name, msg){
	//get val and arrays as arguments
	//var name = inputArray[inputArray.length -1];
	//inputArray = inputArray.slice(2);
	
	//connect to the database and collection
	MongoClient.connect(MongoUrl, {useNewUrlParser: true }, function(err, db) {
		if (err) throw err;
		var dbo = db.db("Marvel");
		
		//inputArray.forEach(function)
		var myquery = { ID: num };
		var newvalues = { $set: {[name]: val} };
		
		dbo.collection("Films").updateOne(myquery, newvalues, function(err, res) {
			if (err) throw err;
			if(res.result.nModified == 1){
				msg.reply(`\n Film ${num} updated`);
				var mQuery = { [name]: val };
			}else{
				msg.reply('\n Failed to update');
			}  
			db.close();
		});
	});
}

/*
*	√	/film seen [id] [name] – changing the syntax so that you can mark someone as seen or unseen.  Can these two commands reuse code?
*	√	/film unseen [id] [name] – changing the syntax so that you can mark someone as seen or unseen.  Can these two commands reuse code?
*   	/film update [id] [title] – update the film title
*   	/film add [optional id] [title] (just uses next id if not specified) – Add a new movie, with the ID (integer) parameter being optional
*   	/unseen [name … name] – pass in a list of users and get a list of movies they haven’t seen
* 		refactor the code to separate the functions
*		look into making them "pure" functions
* 	√	use .map, .reduce, and switch(){}
*/


/*
* 	use command.slice() to get all elements in the command after /film seen / unseen to update multiple documents at once. 
*
*/
"use strict";

const MongoClient = require("mongodb").MongoClient;
const MongoUrl = process.env.DB_CONN;
const DB = process.env.DB;

//message passed from chat.js
this.chat = function(msg, client){
	//set up the response with an opening new line (looks nicer in discord)
	var response = "\n";
	//turn user entered command into an array, stripping "/film " one word per element, seperated by a space
	var	command = msg.content.substring(6).split(" ");  
	
	switch(command[0].toLowerCase()) {
		case "list":

		break;
		default:

	}

	if (command[0].toLowerCase().toString() === "list"){
		findAll();
		
	}else if (command[0].toLowerCase().toString() === "update"){
		updateDB(command[1].toLowerCase().toString(), command[2].toLowerCase().toString(), command[3].toLowerCase().toString());
		
	}else{
		//ensures both are strings prior to use
		var comm1 = command[0].toLowerCase().toString();
		var comm2 = command[1].toLowerCase().toString();
			
		//prepares Mongo query
		//note: unless otherwise stated the variable at the start of the object will be treated as plaintext
		//in order to use the value held within the variable it needs to be enclosed in square brackets
		var mQuery = { [comm1]: comm2 };
		
		findSpecific(mQuery);

/*		if (nameTrue(comm1)) {
			findSpecific(mQuery);
		}else{
			msg.reply("name not found");
		}
*/	}
	
	function findSpecific(mQuery){
		//connect to the database and collection
		MongoClient.connect(MongoUrl, function(err, db) {
			if (err) throw err;
			var dbo = db.db(DB);
			
			//send the query to the database and convert the response to an array
			dbo.collection("main").find(mQuery, { _id: 0, ID: 1, name: 1}).toArray(function(err, result) {
				if (err) throw err;
				//console.log(JSON.stringify(result, null, 2));
				
				//Check if the result of the MongoDB query is empty
				if(result === undefined || result.length == 0){
					response += "**Error:** No results found"
				}else{
					//for each object in the array, add the ID and name to the response
					result.forEach(function(obj) { response += obj.ID + " " + obj.name + "\n";});
					//response = result.map(x => x.ID + " " + x.name + "\n")
					//response.reduce(a, b => a + b)
				}
				//send the response and close the database connection
				msg.reply(response);
				db.close();
			});
		});
	}
	
	function findAll(){
		//connect to the database and collection
		MongoClient.connect(MongoUrl, function(err, db) {
			if (err) throw err;
			var dbo = db.db(DB);
			
			//send the query to the database and convert the response to an array
			dbo.collection("main").find().toArray(function(err, result) {
				
				//for each object in the array, add the ID and name to the response
				result.forEach(function(obj) { response += obj.ID + " " + obj.name + "\n";});
				
				//send the response and close the database connection
				msg.reply(response);
				db.close();
			});
		});
	}
	
	function updateDB(num, name, val){
		//connect to the database and collection
		MongoClient.connect(MongoUrl, function(err, db) {
			if (err) throw err;
			var dbo = db.db(DB);
			
			dbo.collection("main").update(
				{"ID" : num},
				{$set: {[name]: val}}
				);
				
			msg.reply(`Film ${num} updated`);
			db.close();
		});
	}

	function nameTrue(toCheck){
		MongoClient.connect(MongoUrl, function(err, db) {
			if (err) throw err;
			var dbo = db.db(DB);
			
			//dbo.collection("main") ...

			//if toCheck exists in document with ID of 1 return true else return falseZ
		});
	}
}
/*
	Find out why update Carl needed caps
	Create a new function to test if command[0] is a name in the first Mongo document and use this in FindSpecific and updateDB
*/
"use strict";

const MongoClient = require("mongodb").MongoClient;
const MongoUrl = process.env.DB_CONN;
const DB = process.env.DB;
const coll = process.env.coll;

//message passed from chat.js
this.chat = function(msg, client){
	//set up the response with an opening new line (looks nicer in discord)
	var response = "\n";
	//turn user entered command into an array, stripping "/film " one word per element, seperated by a space
	var	command = msg.content.substring(6).split(" ");  
	
	switch(command[0].toLowerCase()) {
		case "list":
		findAll();
		break;
		case "seen":
		updateDB('seen', parseInt(command[1]), command[2].toLowerCase());	
		break;
		case "unseen":
		updateDB('unseen', parseInt(command[1]), command[2].toLowerCase());	
		break;
		default:
		//ensures both are strings prior to use
		var comm1 = command[0].toLowerCase();
		var comm2 = command[1].toLowerCase();
		
		//prepares Mongo query
		//note: unless otherwise stated the variable at the start of the object will be treated as plaintext
		//in order to use the value held within the variable it needs to be enclosed in square brackets
		var mQuery = { [comm1]: comm2 };
		console.log(mQuery)
		findSpecific(mQuery);
		break;
	}
	
	/*
	params
	mQuery: (object) - search query, such as ant: "seen"
	*/
	function findSpecific(mQuery){
		//connect to the database and collection
		MongoClient.connect(MongoUrl, {useNewUrlParser: true }, function(err, db) {
			if (err) throw err;
			var dbo = db.db(DB);
			
			//send the query to the database and convert the response to an array
			dbo.collection(coll).find(mQuery).toArray(function(err, result) {
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
		MongoClient.connect(MongoUrl, {useNewUrlParser: true }, function(err, db) {
			if (err) throw err;
			var dbo = db.db(DB);
			//console.log("Number of items:" + dbo.collection(coll).count());
			//send the query to the database and convert the response to an array
			dbo.collection(coll).find().toArray(function(err, result) {
				
				//for each object in the array, add the ID and name to the response
				result.forEach(function(obj) { response += obj.ID + " " + obj.name + "\n";});
				
				//send the response and close the database connection
				msg.reply(response);
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
	function updateDB(val, num, name){
		//connect to the database and collection
		MongoClient.connect(MongoUrl, {useNewUrlParser: true }, function(err, db) {
			if (err) throw err;
			var dbo = db.db("Marvel");
			var myquery = { ID: num };
			var newvalues = { $set: {[name]: val} };

			dbo.collection("Films").updateOne(myquery, newvalues, function(err, res) {
			  if (err) throw err;
			  if(res.result.nModified == 1){
				console.log(`Film ${num} updated`);
				var mQuery = { [name]: val };
				findSpecific(mQuery)
			  }else{
				console.log('Failed to update');
			  }  
			  db.close();
			});
		  });
	}
}

/*
*  √ /film seen [id] [name] – changing the syntax so that you can mark someone as seen or unseen.  Can these two commands reuse code?
*  √ /film unseen [id] [name] – changing the syntax so that you can mark someone as seen or unseen.  Can these two commands reuse code?
*   /film update [id] [title] – update the film title
*   /film add [optional id] [title] (just uses next id if not specified) – Add a new movie, with the ID (integer) parameter being optional
*   /unseen [name … name] – pass in a list of users and get a list of movies they haven’t seen

*/
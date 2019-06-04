"use strict";

const MongoClient = require("mongodb").MongoClient;
const MongoUrl = process.env.DB_CONN;
const DB = process.env.DB;
const coll = process.env.coll;

//message passed from chat.js
this.chat = function(msg){
	//turn user entered command into an array, stripping "/film " one word per element, seperated by a space
	var	command = msg.content.substring(6).split(" ");  
	//preps empty array to send as search query
	var mQuery = {};
	
	let response = (value) => {msg.reply(`\n ${value}`)}
	
	MongoClient.connect(MongoUrl, {useNewUrlParser: true }, async function(err, db) {
		if (err) throw err;
		
		switch(command[0].toLowerCase()) {
			case "list":
			find(mQuery, response, db);
			
			break;
			case "seen":
			if (command[1] && command[2]){
				//use command.slice(2) and send, with seen, as only args, cutting /film seen, sending the rest as an array
				//send array of films as /film seen 1,2,3,4,5,6,7,8 dad
				//use command[1].split(",") to separate them
				updateDB('seen', parseInt(command[1]), command[2].toLowerCase(), response, db);
			}else{
				msg.reply("\n **Invalid input**");
			}	
			break;
			case "unseen":
			if (command[1] && command[2]){
				let result = await updateDB('unseen', parseInt(command[1]), command[2].toLowerCase(), response, db);
				msg.reply(result)
			}else{
				msg.reply("**\n Invalid input**");
			}	
			break;
			case "add":
			if (command[1] && command[2]){
				var doc =  {
					ID: command[1],
					name: msg.content.slice(11 + command[1].length)
				};
				addFilm(doc, response, db)
			} else {
				msg.reply("**\n Invalid input**");
			}
			break;
			case "update":
			if (command[1] && command[2]){
				var doc =  {
					ID: command[1],
					name: msg.content.slice(11 + command[1].length)
				};
				updateTitle(doc, response, db);
			} else {
				msg.reply("**\n Invalid input**");
			}
			break;
			case "delete":
			if(command[1] && !command[2]){
				var delQuery = {ID: command[1]};
				removeFilm(delQuery, response, db);
			}else {
				msg.reply("\n **Invalid input**");
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
				//this shows any films that are not currently associated with the name as unseen 
				mQuery = (comm2 == "seen")? { [comm1]: "seen" } : { [comm1]: {$ne: "seen" }};
				find(mQuery, response, db);
			}else {
				msg.reply("\n **Invalid input**");
			}
			break;
		}
	});
}

/*
params
mQuery: (object) - search query, such as {ant: "seen"}
accepts empty object to search for all
*/
function find(mQuery, callback, db){
	//connect to the database and collection
	console.log(mQuery);
	var response = "";
	var dbo = db.db(DB);
	//send the query to the database and convert the response to an array
	dbo.collection(coll).find(mQuery).toArray(function(err, result) {
		if (err) throw err;
		//Check if the result of the MongoDB query is empty
		if(result === undefined || result.length == 0){
			response = "**Error:** No results found";
		}else{
			//for each object in the array, add the ID and name to the response
			response = result.map(x => x.ID + " " + x.name).reduce((a, b) => a + "\n" + b);	
		}
		if (callback) callback(response)
		//send the response and close the database connection
		db.close();
	});
	
	
	
}

/*
params
val: (string) - seen / unseen
num: (number) - ID of the film
name: (string) - name of the person to be updated
msg: (object) - the full message that initiated the request, used to reply
*/
async function updateDB(val, num, name, callback, db){
	//get val and arrays as arguments
	//var name = inputArray[inputArray.length -1];
	//inputArray = inputArray.slice(2);
	
	//connect to the database and collection
	var dbo = db.db(DB);
	
	//inputArray.forEach(function)
	var myquery = { ID: num };
	var newvalues = { $set: {[name]: val} };
	let response = ""
	
	try {
		let res = await dbo.collection(coll).updateOne(myquery, newvalues);

		if(res.result.nModified == 1){
			response = `Film ${num} updated`;
		}else{
			response = 'Failed to update';
		}  
		
		db.close();
		return response;
	} catch (err){
		console.log(err);
	}
}

/*
Params:
doc: (onject): ID, name
*/
function addFilm(doc, callback, db){
	var dbo = db.db(DB);
	let response = "";
	dbo.collection(coll).insertOne(doc, function(err, res) {
		if (err) throw err;
		if (res.insertedId){
			response = `${doc.name} has been added.`;
		}else{
			response = 'Failed to add';
		}
		if (callback) callback(response);
		db.close();
	});
}

/*
params
delQuery: (object) - ID: film ID 
*/
function removeFilm(delQuery, callback, db){
	var dbo = db.db(DB);
	let response = "";
	dbo.collection(coll).deleteMany(delQuery,  function(err, res) {
		if (err) throw err;
		if(res.deletedCount > 0){
			response = `${delQuery.ID} has been removed.`;
		}else{
			response = 'Failed to delete';
		}
		if (callback) callback(response);
		db.close();
	});
}


/*Params:
doc: (onject): ID, name
*/
function updateTitle(doc, callback, db){
	var dbo = db.db(DB);
	var myquery = { ID: doc.ID };
	var newvalues = { $set: {name: doc.name} };
	let response = "";
	dbo.collection(coll).updateOne(myquery, newvalues, function(err, res) {
		if (err) throw err;
		if(res.result.nModified == 1){
			response = `Film ${doc.ID} updated`;
		}else{
			response = 'Failed to update';
		}  
		if (callback) callback(response);
		db.close();
	});
}

/*
*	√	/film seen [id] [name] – changing the syntax so that you can mark someone as seen or unseen.  Can these two commands reuse code?
*	√	/film unseen [id] [name] – changing the syntax so that you can mark someone as seen or unseen.  Can these two commands reuse code?
*   √	/film update [id] [title] – update the film title
*   √	/film add [optional id] [title] (just uses next id if not specified) – Add a new movie, with the ID (integer) parameter being optional
*   	/unseen [name … name] – pass in a list of users and get a list of movies they haven’t seen
* 	√	refactor the code to separate the functions
*		look into making them "pure" functions
* 	√	use .map, .reduce, and switch(){}
*/


/*
* 	use command.slice() to get all elements in the command after /film seen / unseen to update multiple documents at once. 
*
*/
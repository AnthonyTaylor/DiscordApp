//setup
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

function createDB(DBname){
	var urlWithDB = url + DBName;
	MongoClient.connect(urlWithDB, { useNewUrlParser: true }, function(err, db) {
		if (err) throw err;
		console.log("Database created!");
		db.close();
	});
}
function createColl(DBName, collName){
	MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
		if (err) throw err;
		var dbo = db.db(DBName);
		dbo.createCollection(collName, function(err, res) {
			if (err) throw err;
			console.log("Collection created!");
			db.close();
		});
	});
}
function addDocs(DBName, collName){
	MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
		if (err) throw err;
		var dbo = db.db(DBName);
		var myobj = [
			{
				ID: 1,
				name: "Iron Man",
				owned: "true",
				ant: "seen",
				carl: "seen"
			},
			{
				ID: 2,
				name: "The Incredible Hulk",
				owned: "true",
				ant: "seen",
				carl: "seen"
			},
			{
				ID: 3,
				name: "Iron Man 2",
				owned: "true",
				ant: "seen",
				carl: "seen"
			},
			{
				ID: 4,
				name: "Thor",
				owned: "true",
				ant: "seen",
				carl: "seen"
			},
			{
				ID: 5,
				name: "Captain America: The First Avenger",
				owned: "true",
				ant: "seen",
				carl: "seen"
			},
			{
				ID: 6,
				name: "Marvel's The Avengers",
				owned: "true",
				ant: "seen",
				carl: "seen"
			},
			{
				ID: 7,
				name: "Iron Man 3",
				owned: "true",
				ant: "seen",
				carl: "seen"
			},
			{
				ID: 8,
				name: "Thor: The Dark World",
				owned: "true",
				ant: "seen",
				carl: "seen"
			},
			{
				ID: 9,
				name: "Captain America: The Winter Soldier",
				owned: "true",
				ant: "seen",
				carl: "seen"
			},
			{
				ID: 10,
				name: "Guardians of the Galaxy",
				owned: "true",
				ant: "seen",
				carl: "seen"
			},
			{
				ID: 11,
				name: "Avengers: Age of Ultron",
				owned: "true",
				ant: "seen",
				carl: "seen"
			},
			{
				ID: 12,
				name: "Ant Man",
				owned: "true",
				ant: "seen",
				carl: "seen"
			},
			{
				ID: 13,
				name: "Captain America: Civil War",
				owned: "true",
				ant: "seen",
				carl: "seen"
			},
			{
				ID: 14,
				name: "Doctor Strange",
				owned: "true",
				ant: "seen",
				carl: "seen"
			},
			{
				ID: 15,
				name: "Guardians of the Galaxy Vol. 2",
				owned: "true",
				ant: "seen",
				carl: "seen"
			},
			{
				ID: 16,
				name: "Spiderman: Homecoming",
				owned: "true",
				ant: "seen",
				carl: "seen"
			},
			{
				ID: 17,
				name: "Thor: Ragnarok",
				owned: "true",
				ant: "seen",
				carl: "seen"
			},
			{
				ID: 18,
				name: "Black Panther",
				owned: "true",
				ant: "seen",
				carl: "seen"
			},
			{
				ID: 19,
				name: "Avengers: Infinity War",
				owned: "true",
				ant: "seen",
				carl: "seen"
			},
			{
				ID: 20,
				name: "Ant-Man and the Wasp",
				owned: "true",
				ant: "seen",
				carl: "seen"
			},
			{
				ID: 21,
				name: "Captain Marvel",
				owned: "false",
				ant: "unseen",
				carl: "unseen"
			},
			{
				ID: 22,
				name: "Avengers: Endgame",
				owned: "false",
				ant: "unseen",
				carl: "unseen"
			},
			{
				ID: 23,
				name: "Spider-Man: Far From Home",
				owned: "false",
				ant: "unseen",
				carl: "unseen"
			}
		];
		dbo.collection(collName).insertMany(myobj, function(err, res) {
			if (err) throw err;
			console.log("Number of documents inserted: " + res.insertedCount);
			db.close();
		});
	});
}
function findDocs(DBName, collName, findQuery){
	MongoClient.connect(url , { useNewUrlParser: true }, function(err, db) {
		if (err) throw err;
		var dbo = db.db(DBName);
		dbo.collection(collName).find(findQuery).toArray(function(err, result) {
			if (err) throw err;
			console.log(result);
			db.close();
		});
	});
}
function updateDocs(DBName, collName, num, name, val){
	MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
		if (err) throw err;
		var dbo = db.db(DBName);
		var myquery = { ID: num };
		var newvalues = { $set: {[name]: val} };
		
		dbo.collection(collName).updateOne(myquery, newvalues, function(err, res) {
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
function findDBs(url){
	var MongoClient = require('mongodb').MongoClient;
	
	// Connect using MongoClient
	MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
		// Use the admin database for the operation
		var adminDb = db.admin();
		// List all the available databases
		adminDb.listDatabases(function(err, result) {
			console.log(result.databases);
			db.close();
		});
	});
}

var DBName = "Marvel";
var  collName = "Films";
var findQuery = {ID: 1}
var num = 13;
var name = "benedict"
var val = "seen"

//createDB(DBName);
//createColl(DBName, collName);
//addDocs(DBName, collName);
//findDocs(DBName, collName, findQuery);
//updateDocs(DBName, Films, num, name, val);
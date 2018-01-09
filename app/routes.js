module.exports = function(app) {

	var db = require('./models/db')
	var express = require('express')
  , router = express.Router()

	app.get('/getData', function(req, res) {
	  var collection = db.getCollection('excel')

	  collection.find().toArray(function(err, docs) {
	    res.send({docs: docs, success : true})
	  })
	})

	app.post('/saveData', function(req, res) {
		var data = req.body;
	  	var collection = db.getCollection('excel')
	  	var error = null;
	  	for (var i = 1; i < data.length - 1; i++) {
	  		var obj = {};
	  		obj = {
	  			'name' : data[i][0],
	  			'email' : data[i][1],
	  			'age' : data[i][2]
	  		}
	  		collection.insert(obj, function(err, result) {
	  			error = err;
				if(err) {
					res.send({success: false})
				}
			})
	  	}
	  	if (!error) {
	  		res.send({success: true});
	  	}
	  	
	})

	app.post('/saveDataManual', function(req, res) {
		
		var data = req.body;
	  	var collection = db.getCollection('excel')
  		
  		collection.insert(data, function(err, result) {
			if(err) {
				res.send({success: false})
			}  else {
				res.send({success: true})
			}
		 })
	  	
	})

	app.post('/saveDataTable', function(req, res) {
		
		var data = req.body;
		var error = null;
	  	var collection = db.getCollection('excel')
	  	var docsMain = [];
  		collection.find().toArray(function(err, docs) {
		    docsMain = docs;
		    for (var i = 0; i < docsMain.length; i++) {
		  		var update = {};
		  		update = {
		  			'name' : data[i].name,
		  			'email' : data[i].email,
		  			'age' : data[i].age
		  		}
		  		var query = {
		  			'name' : docsMain[i].name,
		  			'email' : docsMain[i].email,
		  			'age' : docsMain[i].age
		  		}
		  		var newValue = {$set: update};
				collection.updateOne(query, newValue, {upsert: true}, function(err, data) {
					error = err;
		            if (err) {
		                console.log('err', err)
		            }
		        });
		  	}
		  	if (!error) {
		  		res.send({success: true});
		  	}
		});
	})

	app.post('/deleteData', function(req, res) {
		var data = req.body;
	  	var collection = db.getCollection('excel')
	  	collection.remove({ "name": data.name,'email' : data.email, 'age' : data.age }, function(err, result) {
			if(err) {
				res.send({success: false})
			}  else {
				res.send({success: true})
			}
		})
	  	
	})

	// server routes ===========================================================
	// handle things like api calls
	// authentication routes

	// frontend routes =========================================================
	// route to handle all angular requests
	app.get('*', function(req, res) {
		res.sendfile('./public/index.html');
	});

};
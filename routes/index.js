
/*
 * routes/index.js
 * 
 * Routes contains the functions (callbacks) associated with request urls.
 */

var Entity = require("../models/entity.js"); //our db model
var Intent = require("../models/intent.js"); //our db model
var Nodes = require("../models/nodes.js"); //our db model
var Learning = require("../models/learningIntent.js"); //our db model

/*
	GET /
*/

// home page route to show all suggested foods
exports.index = function(req, res) {
	res.render('index.html')
	
	console.log("main page requested");


}


exports.test = function(req, res) {
	
	console.log("test page requested");

	res.render('test.html');

}

exports.dialogue = function(req, res) {
	
	console.log("dialogue page requested");

	Entity.find({}, 'name slug upvotes photo recommendedBy',{sort:'-upvotes'}, function(err, data){

		if (err) {
			console.log(err);
			res.send("Unable to query database for food").status(500);
		};

		console.log("retrieved " + data.length + " ent products from database");

		//build and render the template data object, which we will pass into the page
		var templateData = {
			entity : data,
			pageTitle : "Willow"
		}

		res.render('dialogue.html', templateData);

	});

}


exports.entities = function(req, res) {
	
	console.log("entities page requested");

	res.render('entities.html');

}
exports.intents = function(req, res) {
	
	console.log("intents page requested");

	res.render('intents.html');

}

exports.stopList = function(req, res) {
	
	console.log("stopList page requested");

	res.render('stopWords.html');

}

exports.animation = function(req, res) {
	
	console.log("animation page requested");

	res.render('animation.html');

}

// exports.entities = function(req, res) {
// 	app.db.inventory.insertOne({ item: "canvas", qty: 100, tags: ["cotton"], size: { h: 28, w: 35.5, uom: "cm" } })
// }



exports.addEntitiesToDB = function(req, res) {
	var entityToSave = new Entity({
		json : JSON.parse(req.body.jsonArray)
	});
	
	// save the food to the database
	entityToSave.save(function(err,data){
		if (err) {
			res.json('failure');

		} else {
			console.log("saved entities")
			res.json('success');
		}
	});

};

exports.addIntentsToDB = function(req, res) {

	var intentToSave = new Intent({
		json : JSON.parse(req.body.jsonArray)
	});
	
	// save the food to the database
	intentToSave.save(function(err,data){
		if (err) {
			res.json('failure');

		} else {
			console.log("saved intents")
			res.json('success');
		}
	});
};


exports.addNodesToDB = function(req, res) {

	var nodesToSave = new Nodes({
		json : JSON.parse(req.body.jsonArray)
	});
	
	// save the food to the database
	nodesToSave.save(function(err,data){
		if (err) {
			res.json('failure');

		} else {
			console.log("saved nodes")
			res.json('success');
		}
	});
};


exports.addLearningToDB = function(req, res) {
	console.log(req.body)
	var learningSave = new Learning({
		phrase : req.body.phrase,
		classification : req.body.classification,
		tokens: req.body["tokens[]"],
		//??????????????????? [] 
	});
	
	// save the food to the database
	learningSave.save(function(err,data){
		if (err) {
			res.json('failure');

		} else {
			console.log("saved nodes")
			res.json('success');
		}
	});
};

exports.deleteAllLearning = function(req, res) {

	Learning.remove( { } )
	console.log("FUCK this")
	Learning.remove({}, function(err){
		if (err){ 
			console.error(err);
			res.send("Error when trying to remove food: "+ requestedSlug);
		}

		res.send("Removed sucsess");
	});
	

};




exports.getLatestEntities = function(req, res){
	// enetities = Entity.find({}, {sort:{$natural:-1}})
	Entity.find({}).limit(1).sort({dateAdded:-1}).exec(function(err, data){
		var jsonData = {
			status : 'OK',
			json : data[0].json,
			dateAdded: data[0].dateAdded
		}

		res.json(jsonData);
	});
}


exports.getLatestIntents = function(req, res){
	// enetities = Entity.find({}, {sort:{$date:-1}})
	Intent.find({}).limit(1).sort({dateAdded:-1}).exec(function(err, data){
		console.log(data[0].dateAdded)	
		console.log(data.length)	
		var jsonData = {
			status : 'OK',
			json : data[0].json,
			dateAdded: data[0].dateAdded
		}

		res.json(jsonData);
	});
}

exports.getLatestNodes = function(req, res){
	// enetities = Entity.find({}, {sort:{$natural:-1}})
	Nodes.find({}).limit(1).sort({dateAdded:-1}).exec(function(err, data){

		// prepare data for JSON
		var jsonData = {
			status : 'OK',
			json : data[0].json,
			dateAdded: data[0].dateAdded
		}

		res.json(jsonData);
	});
}
exports.getLearningIntents = function(req, res){
	// enetities = Entity.find({}, {sort:{$natural:-1}})
	Learning.find({}).sort({dateAdded:-1}).exec(function(err, data){

		

		res.json(data);
	});
}







/*
	GET /api/food
*/

// api route to return all food as JSON
// exports.allFoodApi = function(req, res) {

// 	// this is another way of doing a db query, which is identical to the above
// 	foodQuery = Food.find({}); // query for all food with no filters
// 	foodQuery.sort('-upvotes'); // sort by upvotes
	
// 	// display only these fields from food data
// 	foodQuery.select('name slug upvotes photo recommendedBy');
	
// 	foodQuery.exec(function(err, data){

// 		// prepare data for JSON
// 		var jsonData = {
// 			status : 'OK',
// 			food : data
// 		}

// 		res.json(jsonData);
// 	});

// }

/*
	GET /food/:slug
*/

// get a single food item and display it to user
// exports.oneFood = function(req, res) {

// 	console.log("detail page requested for food with slug " + req.params.slug);

// 	//get the requested food item by the param on the url /food/:slug
// 	var requestedSlug = req.params.slug;

// 	// query the database for that food with findOne, searching by its slug
// 	// see http://mongoosejs.com/docs/api.html#model_Model.findOne
// 	Food.findOne({slug:requestedSlug},function(err, data){

// 		if (err) {
// 			console.log(err);
// 			return res.status(500).send("There was an error on the food query");
// 		}

// 		if (data == null) {
// 			console.log("couldn't find that food!")
// 			return res.status(404).render('404.html');
// 		}

// 		console.log("Found the matching food item! --> " + data.name);

// 			//prepare template data to pass into the view
// 			var templateData = {
// 				food : data,
// 				pageTitle : data.name
// 			}

// 			// render and return the template
// 			res.render('detail.html', templateData);				
		
// 	}); // end of .findOne query

// }

/*
	GET api/food/:slug
*/

// get a single food item and return it in json
// same as above only responds in json

// exports.oneFoodApi = function(req, res) {

// 	console.log("detail page requested for food with slug " + req.params.slug);

// 	//get the requested food item by the param on the url /food/:slug
// 	var requestedSlug = req.params.slug;

// 	// query the database for that food with findOne, searching by its slug
// 	// see http://mongoosejs.com/docs/api.html#model_Model.findOne
// 	Food.findOne({slug:requestedSlug},function(err, data){

// 		if (err) {
// 			console.log(err);
// 			return res.status(500).send("There was an error on the food query");
// 		}

// 		if (data == null) {
// 			console.log("couldn't find that food!")
// 			return res.status(404).render('404.html');
// 		}

// 		console.log("Found the matching food item! --> " + data.name);

// 			//prepare template data to pass into the view
// 			var jsonData = {
// 				food : data,
// 				status : 'OK'
// 			}

// 			// return the JSON
// 			res.json(jsonData);			
		
// 	}); // end of .findOne query

// }

/*
	GET /add
*/

// serves up the add product form
// exports.addFoodForm = function(req, res){

// 	var templateData = {
// 		pageTitle : 'Suggest a Product!'
// 	};

// 	res.render('create_form.html', templateData);
// }

/*
	POST /add
*/

// saves a new product to the database from the POST request


/*
	POST /food/:slug/edit
*/

//prepares and populates the form to edit a food
// exports.editFoodForm = function(req, res) {

// 	// Get food by its slug in /food/:slug/edit
// 	var requestedSlug = req.params.slug;

// 	// query the database for that food with findOne, searching by its slug
// 	// see http://mongoosejs.com/docs/api.html#model_Model.findOne	
// 	Food.findOne({slug:requestedSlug},function(err, data){

// 		if (err) {
// 			console.error("ERROR");
// 			console.error(err);
// 			res.send("There was an error querying for "+ requestedSlug).status(500);
// 		}

// 		if (data == null) {
// 			console.log("couldn't find that food!")
// 			return res.status(404).render('404.html');
// 		}

// 		if (data != null) {

// 			// prepare template data
// 			var templateData = {
// 				pageTitle: "Edit "+data.name,
// 				food: data
// 			};

// 			// render the edit form, passing in the existing values so the user can see them
// 			res.render('edit_form.html',templateData);

// 		}

// 	}) // end .findOne

// }

/*
	POST /food/:slug/edit
*/

//takes the data from the POST request and updates the food
// exports.updateFoodToDb = function(req, res) {

// 	// Get food by its slug in /food/:slug/edit
// 	var requestedSlug = req.params.slug;

// 	// accept form post data
// 	// make it into an object we'll save
// 	var updatedData = {
// 		name: req.body.name,
// 		photo: req.body.photo,
// 		recommendedBy: req.body.recommendedBy,
// 		slug : req.body.name.toLowerCase().replace(/[^\w ]+/g,'').replace(/ +/g,'_') 
// 		// the above nifty function takes the name and makes a slug out of it like 
// 		// hello-this-is-the-name
// 	}


// 	// query and update the requested food
// 	// see http://mongoosejs.com/docs/api.html#model_Model.update
// 	// $set updates the field if it exists, otherwise it adds it
// 	// http://docs.mongodb.org/manual/reference/operator/update/set/
// 	Food.update({slug:requestedSlug}, { $set: updatedData}, function(err, data){

// 		if (err) {
// 			console.error("ERROR: While updating");
// 			console.error(err);			
// 		}

// 		if (data != null) {
// 			// redirect to that updated food!
// 			res.redirect('/food/' + updatedData.slug);

// 		} else {

// 			// unable to find that food, return 404
// 			console.error("unable to find food: " + data.slug);
// 			return res.status(404).render('404.html');
// 		}
// 	})
// }

/*
	GET /food/:slug/upvote
*/

// increments the upvote a given food
// exports.incrementUpvote = function(req,res){

// 	// Get food by its slug in /food/:slug/upvote
// 	var requestedSlug = req.params.slug;

// 	// query the database for that food with findOne, searching by its slug
// 	// see http://mongoosejs.com/docs/api.html#model_Model.findOne	
// 	Food.findOne({slug:requestedSlug},function(err, data){

// 		if (err) {
// 			console.error("ERROR");
// 			console.error(err);
// 			res.send("There was an error querying for "+ requestedSlug).status(500);
// 		}

// 		if (data == null) {
// 			console.log("couldn't find that food!")
// 			return res.status(404).render('404.html');
// 		}

// 		if (data != null) {

// 			// now we will update this returned data
// 			var newUpvoteCount = data.upvotes + 1; // increment by 1
// 			Food.update({slug:requestedSlug},{upvotes:newUpvoteCount},function(err,response){

// 				if(err){
// 					console.log(err);
// 					return res.json({status:"ERROR"});
// 				}

// 				res.json(data); // respond back with JSON

// 			}) // end update

// 		}

// 	}) // end .findOne

// }

/*
	GET /food/:slug/delete
*/

// deletes a food with a given slug
// exports.deleteFood = function(req,res) {

// 	// Get food by its slug in /food/:slug/edit
// 	var requestedSlug = req.params.slug;
	
// 	// remove the requested food based on its requestedSlug
// 	// http://mongoosejs.com/docs/api.html#model_Model-remove
// 	Food.remove({slug:requestedSlug}, function(err){
// 		if (err){ 
// 			console.error(err);
// 			res.send("Error when trying to remove food: "+ requestedSlug);
// 		}

// 		res.send("Removed the food! <a href='/'>Back to home</a>.");
// 	});

// };



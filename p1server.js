// {
//     "node": true,
//     "camelcase": true,
//     "indent": 4,
//     "undef": true,
//     "quotmark": "single",
//     "maxlen": 80,
//     "trailing": true,
//     "curly": true,
//     "eqeqeq": true,
//     "forin": true,
//     "immed": true,
//     "latedef": true,
//     "newcap": true,
//     "nonew": true,
//     "unused": true,
//     "strict": true
// }

 /*global require*/

 //server side javascript
 /*	CPSC 473 Project 1: Filmder (Should I watch this?)
	Submitted by- Team- Oscillatory Memorization
	Email- supra.chavan@gmail.com
 */

//Modules required to run the application
var express = require('express');
var bodyParser = require('body-parser');
// var path = require('path');
var mongoose = require('mongoose');
var request = require('request');

mongoose.connect('mongodb://localhost/Project1');
mongoose.set('debug', true);

var userSchema = new mongoose.Schema({  
	userName: String,
	email: String,
	password: String
});

var movieSchema = new mongoose.Schema({
	movieName: String,
	mUserId: [String],
	mUpVote: Number,
	mDownVote: Number,
	mTitle: String,
	mYear: String,
	mPosterUrl: String
});

var UserDb = mongoose.model('user', userSchema); 
var MovieDb = mongoose.model('movie', movieSchema);

var app = express();
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use("/", express.static("public"));

console.log('server side, listening at port 3000');

/**
 * Route for signup functionality for first-time user
 * 
 */
app.post('/signup', function(req, res){
	console.log('inside post method');
	UserDb.findOne({userName: req.body.username}).exec(function(err, user){
		if(!user){
			var u1 = new UserDb({userName: req.body.username,
								password: req.body.password,
								email: req.body.email });
			u1.save(function(err, result) {
				if(err){
					console.log('error while signing up'+err);
					res.json('error while signing up');
				}
				else{
					console.log('user registered successfully');
					res.json('user registered successfully');
				}
			});
		}
		else{
			console.log('user already exists');
			res.json('user already exists, please try again with diffrent user name');
		}
	});
});

/**
 * Route for login functionality for registered user
 * 
 */
app.post('/login', function(req, res){
	console.log('inside post-login method');
	UserDb.findOne({userName: req.body.username1}).exec(function(err, user){
		if(!user){
					console.log('user does not exist'+err);
					res.json({'error':'user does not exist, please sign up first'});
		}
		else{
			    if(user.password !== req.body.password1){
		    			console.log('authentication failure');
						res.json({'error':'authentication failure, please check your details'});
			    }
			    else{
					console.log('user login successful');
					res.json({'username':req.body.username1, 'userid':user._id});
				}
			}	
	});
});

/**
 * Route for functionality to add movies for logged-in user
 * 
 */
app.post('/addmovies', function(req, res){
	var flagCounter = 0;
	console.log('inside addmovies post method');
	var movieName = req.body.movieName;
	var uName = req.body.userId;
	var omdbResponse = {};

	//Request to OMDb API for retriving movie information
	var movieParameterName = movieName.split(' ').join('+');
	var movieParameterString ="http://www.omdbapi.com/?t=" + movieParameterName + "&y=&plot=short&r=json&tomatoes=true";

	request(movieParameterString, function(error, response, body){
		if(!error && response.statusCode == 200) {
			omdbResponse = JSON.parse(body);
			if(omdbResponse.Response == "False"){
				console.log('Not found in OMDb');
				res.json('Not Found in OMDb');
			}
			else{
				MovieDb.findOne({movieName: req.body.movieName}).exec(function(err, movie){
					if(!movie){
						var m1 = new MovieDb({
												movieName: req.body.movieName, 
												mUpVote: 0,
												mDownVote: 0,
												mTitle: omdbResponse.Title,
												mYear: omdbResponse.Year,
												mPosterUrl: omdbResponse.Poster 
											});
						m1.mUserId.push(uName);
						m1.save(function(err, result) {
							if(err){
								console.log('error while adding movie To DB');
								res.json('error while adding movie to db');
							}
							else{
								console.log('movie added successfully');
								res.json(omdbResponse.Title + ' was added successfully to your List');
							}
						}); //end m1.save function
					} //end-if
					else{
						console.log(movie.mUserId.length);
						for(var i=0;i<movie.mUserId.length;i++){
							if(movie.mUserId[i] === req.body.userId)
							{
								// console.log('movie already exists in user's list');
								console.log(movie.mUserId[i]);
								flagCounter++;
							}
							console.log(flagCounter);
						}
						if(flagCounter == 1){
							res.json("movie already exists in your list");
						}
						else{
							movie.mUserId.push(req.body.userId);
							movie.save(function(err, result) {
								if(err){
									console.log('error while adding movie');
									res.json('error while adding movie');
								}
								else{
									console.log('movie added to your list successfully');
									res.json('movie added to your list successfully');
								}
							});
						} //end inner else
					} //end outer else
				}); //end find() function
			} //end outer else

		}//end outermost if
		else{
			console.log('No response from OMDB');
			res.json('No response from OMDB');
		}
	}); //end request
}); //end post

/**
 * Route for functionality to delete movies for logged-in user
 * 
 */
app.post('/deletemovie', function(req, res){
	console.log('inside delete movie method');

	MovieDb.findOne({movieName: req.body.movieName}).exec(function(err, movie){
		if(!movie){
			console.log('movie not present in your list');
			res.json('movie not present in your list');
		}
		else{
			movie.mUserId.pull(req.body.userId);
			movie.save();
			if(movie.mUserId.length === 0){
				MovieDb.find({movieName : req.body.movieName}).remove(function(err, movie){
					if(err){
						console.log('error while deleting movie');
						res.json('error while deleting movie');
					}
					else{
						console.log('movie deleted from your list');
						res.json('movie deleted from your list successfully');
					}

				}); //end find
			}
			else{
				console.log('movie deleted from your list in else');
				res.json('movie deleted from your list successfully');
			}

		}
	}); //end findOne
				
}); //end post

/**
 * Route for functionality to update score (upvotes/downvotes) for movies
 * 
 */
app.post('/scoreUpdate', function(req, res){
	console.log('inside post method for voting');
	console.log('The movie is ' + req.body.movieName);

	MovieDb.findOne({movieName:req.body.movieName},{_id:0, mUpVote:1, mDownVote:1}, function(err, movie) {
			console.log(movie);
			if (req.body.score == 1) {
			  	console.log('Updating upvote!');
		 		MovieDb.update({movieName:req.body.movieName},{$inc: {mUpVote: 1}}, function(err, raw) {
			 	    if (err) {
			 		  console.log('err');
			 		} else {
			 		  console.log('The raw response from Mongo was ', raw);
					  res.json({upVote: movie.mUpVote + 1, downVote: movie.mDownVote});
			 	 	}
		 		}); //end update
			} else if (req.body.score == -1){
				console.log('Updating downvote!');
		 		MovieDb.update({movieName:req.body.movieName},{$inc: {mDownVote: 1}}, function(err, raw) {
			 	    if (err) {
			 		  console.log('err');
			 		} else {
			 		  console.log('The raw response from Mongo was ', raw);
					  res.json({upVote: movie.mUpVote, downVote: movie.mDownVote + 1});
			 	 	}
		 	 	}); //end update
			} //end else if
	}); //end findOne
}); //end post

/**
 * Route for functionality to display one movie at random on home page
 * 
 */
app.get('/ShowMovie', function(req,res) {
	console.log('in get all movies');
	MovieDb.find({},{movieName:1, _id:0, mUpVote: 1, mDownVote: 1, mTitle: 1, mPosterUrl: 1, mYear: 1}, function(err, movies) {
	    if (err) {
	      console.log('error while getting movie');
	      res.json('error while getting movie');
	    } 
	    else {
	      console.log(movies);
	      var movieIndex = movies[Math.floor(Math.random()*movies.length)]; //Function to get one random movie from the database at a time
	      res.json(movieIndex);
	    }
	}); //end find
}); //end get

/**
 * Route for functionality to display all movies and votes for 1 logged-in user 
 * 
 */
app.post('/showMoviesFor1User', function(req,res) {
	console.log('in get all movies for 1 user');
	UserDb.findOne({_id: req.body.userID}).exec(function(err, user){
		MovieDb.find({mUserId:user._id},{movieName:1,mUpVote:1,mDownVote:1,mPosterUrl:1, _id:0},function(err, movies) {
		    if (err) {
		      console.log('error while showing movies for 1 user');
		      res.json('error while showing movies for 1 user');
		    } else {
		      console.log(movies);
		      res.json({'username':req.body.username1, 'userid':user._id, 'movieList':movies});
		    }
		}); //end find
	}); //end findOne
}); //end post


app.listen(3000);
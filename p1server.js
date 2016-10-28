//server side javascript

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

var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var mongoose = require('mongoose');
var request = require('request');

mongoose.connect('mongodb://localhost/Project1');
mongoose.set('debug', true)

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

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

console.log('server side, listening at port 3000');
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
	var str = JSON.stringify(req.body);
	// console.log(req.body);
	// console.log(str);
	var obj = JSON.parse(str);
	// console.log(obj);
	// console.log('body: ' + JSON.stringify(req.body));
});

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
					// MovieDb.find({mUserId:user._id},{movieName:1,_id:0},function(err, movies) {
					//     if (err) {
					//       // onErr(err, callback);
					//       console.log('error!!!!');
					//     } else {
					//       console.log(movies)
					//       res.json({'username':req.body.username1, 'userid':user._id, 'movieList':movies});
					//     }
					// });
					res.json({'username':req.body.username1, 'userid':user._id});
					}
			}
					
		
	});
	// var str = JSON.stringify(req.body);
	// var obj = JSON.parse(str);
});

app.post('/addmovies', function(req, res){
	var flagCounter = 0;
	console.log('inside addmovies post method');
	var movieName = req.body.movieName;
	var uName = req.body.userId;
	var omdbResponse = {};
	console.log(movieName);
	console.log(req.body.userId);
	movieParameterName = movieName.split(' ').join('+');
	movieParameterString ="http://www.omdbapi.com/?t=" + movieParameterName + "&y=&plot=short&r=json&tomatoes=true";

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
					});
				}
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
					}
					
				}
				});
			}

		}//endif
		else{
			console.log('No response from OMDB');
			res.json('No response from OMDB');
		}
	});
});

// app.get('/hi', function(req,res) {
// 	console.log('in get all movies');
// 	var movieCollection = MovieDb.find();
// 	console.log(movieCollection);
// 	console.log(JSON.stringify(movieCollection));
// 	res.json(movieCollection);
// });

app.post('/scoreUpdate', function(req, res){
	console.log('inside post method for voting');
	console.log('The movie is ' + req.body.movieName);

	MovieDb.findOne({movieName:req.body.movieName},{_id:0, mUpVote:1, mDownVote:1}, 
		function(err, movie) {
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
		 	 });
			} else if (req.body.score == -1){
			  console.log('Updating downvote!');
		 	  MovieDb.update({movieName:req.body.movieName},{$inc: {mDownVote: 1}}, function(err, raw) {
		 	    if (err) {
		 		  console.log('err');
		 		} else {
		 		  console.log('The raw response from Mongo was ', raw);
				  res.json({upVote: movie.mUpVote, downVote: movie.mDownVote + 1});
		 	 }
		 	 });
			}
		});


	//var str = JSON.stringify(req.body);
	// console.log(req.body);
	// console.log(str);
	//var obj = JSON.parse(str);
	// console.log(obj);
	// console.log('body: ' + JSON.stringify(req.body));
});

app.get('/ShowMovie', function(req,res) {
		// MovieDb.aggregate([ {$sample: {size: 1} } ])
	// console.log(MovieDb.aggregate([ {$sample: {size: 1} } ]));
	console.log('in get all movies');
	MovieDb.find({},{movieName:1,
						_id:0,
						mUpVote: 1,
						mDownVote: 1,
						mTitle: 1,
						mPosterUrl: 1,
						mYear: 1
					},function(err, movies) {
			    if (err) {
			      // onErr(err, callback);
			      console.log('error!!!!');
			    } 
			    else {
			      // mongoose.connection.close();
			      console.log(movies);
			      var movieIndex = movies[Math.floor(Math.random()*movies.length)];
			      res.json(movieIndex);
			      // callback("", movies);
			    }
		});
});

app.post('/showMoviesFor1User', function(req,res) {
	console.log('in get all movies for 1 user');
	UserDb.findOne({_id: req.body.userID}).exec(function(err, user){
		
					MovieDb.find({mUserId:user._id},{movieName:1,mUpVote:1,mDownVote:1,mPosterUrl:1, _id:0},function(err, movies) {
					    if (err) {
					      // onErr(err, callback);
					      console.log('error!!!!');
					    } else {
					      console.log(movies)
					      res.json({'username':req.body.username1, 'userid':user._id, 'movieList':movies});
					    }
					});
	});
});


app.listen(3000);
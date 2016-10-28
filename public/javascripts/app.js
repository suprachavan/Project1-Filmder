/* jshint browser: true, jquery: true, camelcase: true, indent: 2, undef: true, quotmark: single, maxlen: 80, trailing: true, curly: true, eqeqeq: true, forin: true, immed: true, latedef: true, newcap: true, nonew: true, unused: true, strict: true */

//client side javascript
 /* CPSC 473 Project 1: Filmder (Should I watch this?)
  Submitted by- Team- Oscillatory Memorization
  Email- supra.chavan@gmail.com
 */


//==========================================================
//Use to display movie into html 
//  IN    movieObject - movieObject only that is formatted
//                      from OMBD
//  
//  TAG   #movieCard - html id 
//==========================================================
var ListArray= [];
var AddMovieToHtml= function(movieObject){
  'use strict';

  //$('#movieCard2').append(
  $('#movieCard').empty();
  $('#ShowTitle').empty();

   $('#movieCard').append(
    '<div class="ui three column middle aligned very relaxed stackable grid">' +
    
    '<div class="middle aligned center black column">' +
    '<div id="VoteResult2"><div class="ui buttons">' + 
    '<div id="VoteUp" class="ui huge huge aligned fluid positive button">'+
    '<i class="large thumbs up icon"></i>Watch It</div>'+
    '</div></div>'+
    '</div><div class="ui vertical divider"></div>' +
    
    '<div class="middle aligned center black column">' +
    '<img class="ui middle aligned center medium rounded image" src=' + 
    movieObject.mPosterUrl + '>' +
    '</div><div class="ui vertical divider"></div>' +
    
    '<div class="middle aligned center black column">' +
    '<div id="VoteResult">' +
    '<div class="ui buttons">' + 
          '<div id="VoteDown" class="ui huge aligned fluid negative button" >'+
          '<i class="large thumbs down icon"></i>Skip it</div>'+
    '</div>' +
    '<div class="ui buttons">' + 
    '<div id="NeverSeen" class="ui huge aligned fluid violet button">'+
     'Haven\'t Seen<i class="large right arrow icon"></i></div>'+
    '</div>' +
    
    
    '</div>'+
    '</div></div></div>'
    );
    $('#ShowTitle').append(
      '<div class="middle aligned center large black "><h1>'+ 
          movieObject.mTitle + '</h1>('+ movieObject.mYear +')</div><br>'
    );

    VoteButton(movieObject.movieName);
    //console.log("printEverything");
};

var VoteButton = function(nameMovie){
 

  
  $('#VoteUp').click(function () {
    'use strict';
    //console.log('TTTT 33' + nameMovie);
    $('#VoteResult').empty();
    $('#VoteResult2').empty();
    Voting(nameMovie,1);
    
  });
  
  $('#VoteDown').click(function () {
    //console.log('testDown');
    $('#VoteResult').empty();
    $('#VoteResult2').empty();
    Voting(nameMovie,-1);
    
  });

  $('.nextButton').click(function(){
  //console.log(nameMovie +'Next');
    callShowAllMoviesFunction();
  });
  
  $('#NeverSeen').click(function(){
    //console.log("never");
    callShowAllMoviesFunction();
  });

};



var Nexting = function(){
  'use strict';
  
  $('#VoteResult').append(
    '<br><div class="nextButton ui buttom aligned fluid inverted button">'+
                          'NEXT MOVIE</div>');
  $('#VoteResult2').append(
    '<br><div class="nextButton ui buttom aligned fluid inverted button">'+
                           'NEXT MOVIE</div>');
  VoteButton();
};


var Voting = function(nameMovie,score){
  'use strict';
  var result; 
  var jsonStr = JSON.stringify({'movieName': nameMovie, 'score': score});
  //console.log(jsonStr);

  
  $.ajax({  
    type: 'POST',
    data: jsonStr,
      dataType: 'json',
      contentType: 'application/json',
      url: 'http://localhost:3000/scoreUpdate',            
      success: function(data) {
        result = data;
        console.log(result);
        $('#VoteResult2').append(
          '<div><h3>Result</h3><i class="huge thumbs green up icon"></i><h3>' + 
              result.upVote + '</h3><br><br>');
        $('#VoteResult').append(
          '<div><h3>Result</h3><i class="huge thumbs red down icon"></i><h3>' + 
              result.downVote + '</h3><br><br>');

        Nexting();
      },
      error: function(){
        console.log('Cannot Vote');
      }
  });
  
};
//end of new code
var flag =false;
var checkLogin = function(){
  'use strict';
  var spanContent = $('.userId').text();
  console.log('spanContent'+spanContent);
  console.log('flag:'+flag);
  if(spanContent){
    if(flag === true){
      console.log('in function true');
      $('.login_seg').hide();
       $('.right_menu1').hide();       
     $('.right_menu2').show();
     $('.main_seg').show();
     $('.right_menu3').show();  
    }
    else{
        console.log('in function false');
         $('.right_menu2').show();  //show
        $('.login_seg').show();    
        $('.right_menu1').hide();   //hide
        $('.main_seg').hide();   
        $('.right_menu3').hide();    
    }
  }
  else{
      console.log('in else');
      $('.right_menu1').show();
      $('.main_seg').show();
      $('.right_menu2').hide();
      $('.login_seg').hide();
      $('.right_menu3').hide(); 
  }
};

$(function(){
  'use strict';
  // loadCount++;
  

  callShowAllMoviesFunction();


  $('.watch').click(function(){
    console.log('watch button clicked');
  });

  $('.login_seg').hide();
  
  // if(loadCount<=1){
  //   $('.right_menu2').hide();
  // }
  // else{
  //   $('.right_menu2').show();
  // }

  checkLogin();

  $('.logout').click(function(){

    $('.right_menu2').hide();
    $('.right_menu1').show();
    $('.login_seg').hide();
    $('.main_seg').show();
    $('span.userId').empty();
    $('.right_menu3').hide();

  });

  $('.signup').click(function () {
    $('.signup_modal').modal('show');
  });

  $('.login').click(function () {
    $('.login_modal').modal('show');
  });

  $('.addmovie_button').click(function () {
    $('.result3').empty();
    $('.addmovie_modal').modal('show');
  });

  $('.showmovie_button').click(function () {
    var userID = $('span.userId').text();
    var jsonStr = JSON.stringify({'userID': userID});
    callShowMoviesFor1User(jsonStr);
    $('.movie_seg').show();
  });

  $('.deletemovie_button').click(function(){
    $('.result4').empty();
    $('.deletemovie_modal').modal('show');
  });

  $('.redirect').click(function(){
    flag = true;  //home page clicked and user logged in
    checkLogin();
  });

  $('.profile').click(function(){
    $('.right_menu1').hide();
    $('.right_menu2').show();
    $('.main_seg').hide();
    $('.login_seg').show();
    $('.right_menu3').hide();
  });

  $('.login').on('click', function(){
    $('signup_modal').modal('hide');
    $('login_modal').modal('show');
  });

  $('.signup').on('click', function(){
    $('signup_modal').modal('show');
    $('login_modal').modal('hide');
  });

  $('.login_form').form({
    fields: {
          ulname: {
              identifier : 'ulname',
              rules: [
                {
                  type   : 'empty',
                  prompt : 'Please enter a username'
                }
                ]
            },
            pwd: {
                identifier : 'pwd',
                rules: [
                  {
                    type   : 'empty',
                    prompt : 'Please enter a password'
                  }
                ]
              },
        },  
    onSuccess: function(event) {
      callLogInFunction();
      event.preventDefault();
      console.log('form valid');
      $('.result3').empty();
    }

  });

  $('.signup_form').form({ 
  fields: {
          username: {
          identifier : 'uname',
          rules: [
            {
              type   : 'empty',
              prompt : 'Please enter a username'
            }
          ]
        },
        email: {
          identifier : 'email',
          rules: [
                {
                  type   : 'email',
                  prompt : 'Please enter a valid email address'
                },
      
          ]
        },
        pwd1: {
          identifier : 'pwd1',
          rules: [
            {
              type   : 'empty',
              prompt : 'Please enter a password'
            },
            {
              type   : 'length['+6+']',
              prompt : 'Your password must be at least 6 characters'
            }
          ]
        },
        pwd2: {
          identifier : 'pwd2',
          rules: [
            {
              type   : 'empty',
              prompt : 'Please enter a password'
            },
            {
              type   : 'length['+6+']',
              prompt : 'Your password must be at least 6 characters'
            },
            {
              type   : 'match[pwd1]',
              prompt : 'Passwords do not match'
            }
          ]
        },
        terms: {
          identifier : 'chck',
          rules: [
            {
              type   : 'checked',
              prompt : 'You must agree to the terms and conditions'
            }
          ]
        }
  },  
    onSuccess: function(event) {
      callSignUpFunction();
      event.preventDefault();
      console.log('form valid');
      
      }
  });
  $('.addmovie_form').form({
    // $('.result3').html();
    fields: {
          moviename: {
              identifier : 'moviename',
              rules: [
                {
                  type   : 'empty',
                  prompt : 'This field cannot be empty'
                }
                ]
            }
        },  
    onSuccess: function(event) {
      callAddMoviesFunction();
      event.preventDefault();
      console.log('form valid');
     
    }
  });
  $('.deletemovie_form').form({
    fields: {
          dmoviename: {
              identifier : 'dmoviename',
              rules: [
                {
                  type   : 'empty',
                  prompt : 'This field cannot be empty'
                }
                ]
            }
        },  
    onSuccess: function(event) {
      callDeleteMoviesFunction();
      event.preventDefault();
      console.log('form valid');
     
    }
  });

  
  
});


//ListAllUserMovie-------------------------------------------------
// list all the movie the user have with the score attach to it
//  IN       - arrayLenght - size of an array
//  IN       - movieArray - array of an object
//                          contian movieName and Score
//  TAG      - listAllMovies - id
//------------------------------------------------------------------
/*
var ListAllUserMovie = function(arrayLenght, movieArray){
  var counter = 0;
  $('#listAllMovies').empty();
  
  $('#listAllMovies').append('<div class="ui middle aligned dividec list">');
  for(; counter < arrayLenght; counter++){
    $('#listAllMovies').append(
    '<div class="item">' +
      '<div class="right floated content">' +
        '<div>' + movieArray[counter].score + '</div>' +
      '</div>' +
      '<div class="content">' + movieArray[counter].movieName + '</div>' +
    '</div>'
    )
  }
    $('#listAllMovies').append('</div>');
}

*/

var callSignUpFunction = function(){
  'use strict';
    // body...
    // submit form data as json on button click
    var uname = document.getElementsByName('uname')[0].value;
    var email = document.getElementsByName('email')[0].value;
    var pwd1 = document.getElementsByName('pwd1')[0].value;
    var jsonStr = JSON.stringify({'username': uname,
                                  'email': email,
                                  'password': pwd1});
    console.log(jsonStr);

    $.ajax({
                    type: 'POST',
                    data: jsonStr,
                    dataType: 'json',
                    contentType: 'application/json',
                    url: 'http://localhost:3000/signup',            
                    success: function(data) {
                                    console.log('success');
                                    console.log(jsonStr);
                                    console.log(JSON.stringify(data));
                                    console.log(data);
                                    $('.result').html(data);
                                    $('.signup_form').trigger('reset');
                                    $('login_modal').modal('destroy');
                                }
                        });
   };
   var callLogInFunction = function(){
     'use strict';
    // body...
    // submit form data as json on button click
    var ulname = document.getElementsByName('ulname')[0].value;
    var pwd = document.getElementsByName('pwd')[0].value;
    var jsonStr = JSON.stringify({'username1': ulname, 'password1': pwd});
    console.log(jsonStr);

    $.ajax({
                    type: 'POST',
                    data: jsonStr,
                    dataType: 'json',
                    contentType: 'application/json',
                    url: 'http://localhost:3000/login',            
                    success: function(data) {
                                    console.log('success');
                                    console.log(jsonStr);
                                    console.log(JSON.stringify(data));
                                    console.log(data);

                                    if(data.error){
                                      $('.result2').html(data.error);
                                      $('.login_form').trigger('reset');
                                    }
                                    else{
                                      $('.result2').html(data);
                                      $('.login_form').trigger('reset');
                                      $('.login_modal').modal('hide');

                                      $('.right_menu1').hide();
                                      $('.pointing.label').text(
                                        'Welcome '+data.username);

                                      $('.userId').text(data.userid);
                                      console.log(data.userid);
                                      $('.userId').hide();

                                      $('.right_menu2').show();

                                      $('.login_seg').show();
                        $('.main_seg').hide();

                        $('.movie_seg').hide();

                        // console.log(data.movieList.length);
                        // for(var i=0;i<data.movieList.length;i++)
                        // {
                        //  console.log('inside for loop');
                        //  console.log(data.movieList[i].movieName);
                        //  $result = $('<div class='+"'listitem'"+'><div class='+"'listcontent'"+'>').
                //                        text(data.movieList[i].movieName);
                //                        $('.listitem').append($result);
                          
                        // }
                                    }
                                      

                      }
                      
                    //%%%%%%%%%%%%%%%%%%%%%%%%
                    //%%%Use for the List%%%%%
                    //%%%%%%%%%%%%%%%%%%%%%%%%
                    //{movieList: [{movieName: <> , movieScore: <>}]}
                    //ListAllUserMovie(data.movieList.lenght, data.movieList);

          });
    //get all the movies for this user from database


   };
   var callAddMoviesFunction = function() {
     'use strict';
    // body..
    console.log('calladdmf');
    var movieName = document.getElementsByName('moviename')[0].value;
    var userID = $('span.userId').text();
    console.log(userID);
    // var uname = 
    var jsonStr = JSON.stringify({'movieName': movieName, 
                                  'userId': userID});
    console.log(jsonStr);
        $.ajax({
                    type: 'POST',
                    data: jsonStr,
                    dataType: 'json',
                    contentType: 'application/json',
                    url: 'http://localhost:3000/addmovies',            
                    success: function(data) {
                                    // console.log('success');
                                    // console.log(jsonStr);
                                    // console.log(JSON.stringify(data));
                                    // console.log(data);
                                    $('.result3').html(data);
                                    $('.addmovie_form').trigger('reset');
                                    // $('.addmovie_modal').modal('hide');
                                    $('.result3').html();
                                   
                                }
                        });
   };
   var callDeleteMoviesFunction = function(){
     'use strict';
    var movieName = document.getElementsByName('dmoviename')[0].value;
    var userID = $('span.userId').text();
    console.log(userID);
    // var uname = 
    var jsonStr = JSON.stringify({'movieName': movieName, 'userId': userID});
    console.log(jsonStr);
        $.ajax({
                    type: 'POST',
                    data: jsonStr,
                    dataType: 'json',
                    contentType: 'application/json',
                    url: 'http://localhost:3000/deletemovie',            
                    success: function(data) {
                                    // console.log('success');
                                    // console.log(jsonStr);
                                    // console.log(JSON.stringify(data));
                                    // console.log(data);
                                    $('.result4').html(data);
                                    $('.deletemovie_form').trigger('reset');
                                    // $('.deletemovie_modal').modal('hide');
                                    $('.result4').html();
                                   
                                }
                        }); 
   };

   var callShowAllMoviesFunction =function () {
     'use strict';
    // body...
    console.log('in ajax get');
    $.ajax({
                    type: 'GET',
                    // data: jsonStr,
                    dataType: 'json',
                    contentType: 'application/json',
                    url: 'http://localhost:3000/ShowMovie',            
                    success: function(data) {
                                    console.log('success');
                                    console.log(JSON.stringify(data));
                                    console.log(data);
                                    AddMovieToHtml(data);
                                    // $('.result3').html(data);
                                    // $('.addmovie_form').trigger('reset');
                                    // // $('.addmovie_modal').modal('hide');
                                    // $('.result3').html();
                                    // ConnectToOMDB();

                                    // $('.right_menu1').hide();
                                    // $('.pointing.label').text('Welcome '+data);

                                    // $('.right_menu2').show();

                                }
                        });
   };

var callShowMoviesFor1User = function(jsonStr){
 'use strict';
    $('.movie_seg').empty();

    $.ajax({
                    type: 'POST',
                    data: jsonStr,
                    dataType: 'json',
                    contentType: 'application/json',
                    url: 'http://localhost:3000/showMoviesFor1User',            
                    success: function(data) {
                                    console.log('success');
                                    console.log(jsonStr);
                                    console.log(JSON.stringify(data));
                                    console.log(data);

                                    if(data.error){
                                      // $('.result2').html(data.error);
                                      console.log('error');
                                    }
                                    else{
                        console.log(data.movieList.length);
                        /*
                        if(ListArray.length > 0){
                          for(var i=0;i < data.movieList.length;i++)
                              {
                          ListArray.push(data.movieList[data.movieList[i].movieName].movieName);
                          $('.movie_seg').append('<div class="ui grey inverted segment">'+
                                                '<div class="ui grid">' + 
                                                '<div class="eight wide column"><h3>' +
                                                data.movieList[data.movieList[i].movieName].movieName +
                                                '</h3></div><div class="eight wide column">'+
                                                '<div class="ui right floated span"><h3><i class="thumbs green up icon"></i>'+
                                                data.movieList[data.movieList[i].movieName].mUpVote +
                                                '  |  <i class="thumbs red down icon"></i>'+ 
                                                data.movieList[data.movieList[i].movieName].mDownVote +
                                                '</h3></div></div></div>'
                          );  
                              }
                        }
                        */
                        if(true){
                            for(var i=0;i < data.movieList.length;i++)
                              {
                                console.log(data.movieList[i].movieName);
                                ListArray.push(data.movieList[i].movieName);
                                $('.movie_seg').append('<div class="ui grey inverted segment">'+
                                                    '<div class="ui grid">' + 
                                                    '<div class="eight wide column"><h3>' +
                                                    data.movieList[i].movieName +
                                                    '</h3></div><div class="eight wide column">'+
                                                    '<div class="ui right floated span"><h3><i class="thumbs green up icon"></i>'+
                                                    data.movieList[i].mUpVote +
                                                    '  |  <i class="thumbs red down icon"></i>'+
                                                    data.movieList[i].mDownVote +
                                                    '</h3></div></div></div>'
                            );  
                            }
                          
                        }//end else
                                 }
                                      

                    } //end success
                    

    }); //end ajace

   };



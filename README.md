#Filmder: Tinder for Films

Project 1 : Should I watch this?  Strangers vote on your TV and movie choices

##Run the web application directly from this [link](https://enigmatic-woodland-38728.herokuapp.com/)


##Project Summary
This is a Single Page Web application implemented using HTML, Semantic UI, JavaScript, Node.js and MongoDB. 

The application enables strangers to vote up or down on user's movie choices, one at a time. First-time users need to sign up on the website after which they can log in and add movies to the list. They can also delete movies from their list or view their list of current movies/TV shows and number of up-votes and down-votes. The application supports number of features such as form validation for users, user authentication, etc. All the data pertaining to users and movies is stored at the back end in a MongoDB data store.

The application interacts with a free Web API- OMDb i.e. Open Movie Database (https://www.omdbapi.com/) to collect information about movies/TV shows such as official title, poster, release year, etc.


##How to install

1. Clone the project directory from the github repository- https://github.com/suprachavan/Project1-Filmder
2. Navigate to the home project directory and run `npm install`
3. Start up the MongoDB and server using command `foreman start`
4. Step 3 will give an error if MongoDB is already running. Please make sure that the process for MongoDB is already stopped before running the command in Step 3. In case of this error in Step 3, You may directly start up the server with `node p1server.js` command.
4. The server will be listening on localhost:3000
5. Navigate to localhost:3000 through your favorite browser

##Note: 

While running the application for the very first time, the home page may appear blank (with only header, footer, and menu bar present). This is because the data store is empty at the moment (i.e. no data about user or movies present).
In this case, sign up as a first-time user, log in to your account, add a few movies and then log out.
Hit refresh button on the browser and now the random movie will appear with buttons to vote.
You can then proceed to vote for movies or sign up and log in as a new user, add movies, delete movies, view list, etc.

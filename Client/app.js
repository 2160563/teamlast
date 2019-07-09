/**
* MODULE DEPENDENCIES
*/
var Semaphore = require('semaphore-sms-api');
var Q = require('q');
var async = require('async');
var express = require('express');
var session = require('express-session');
var webPush = require('web-push');
var path = require('path');
var bodyParser = require('body-parser');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var convertTime = require('convert-time');
global.bcrypt = require('bcrypt');
var mysql = require('mysql');
var fs = require('fs');
var FileReader = require('filereader');
var app = express();
var connection = mysql.createConnection ({
  host     : 'localhost',
  user     : 'teampalak',
  password : 'teampalak',
  database : 'teampalak'
});
connection.connect();
global.db = connection;
const publicVapidKey = "BOy3eO_ACgr1SiYPV0tsZYMF4mcY1UcKrWYlz2PMxUXKWN1vNQVa3pOssKUsi5kFekBk5QO24on9T0mglB0tTSw";
const privateVapidKey = "YtC241gDm5lYqKVSovOEoFATHb6vw7KxuK9n3f0P4aE";

webPush.setVapidDetails('mailto:test@example.com', publicVapidKey, privateVapidKey);
app.listen(8081, function() {
  console.log("Server running on port 8081.");
});

/**
* CACHE
*/
var apikey = "b22e39f9a51eb225cf3d9c15be73119d";
global.sms = new Semaphore(apikey);

require('dotenv').config({ path: 'variables.env' });
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({
  secret: 'somesecretkey',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: null }
}));
app.use(express.static(path.join(__dirname, 'views')));
app.get('/', routes.index); //DISPLAY HOME PAGE
app.get('/login', routes.login); //DISPLAY LOGIN PAGE
app.get('/register', routes.register); //DISPLAY SIGNUP PAGE
app.get('/userProfile', user.userProfile); //display user profile page
app.post('/register', user.register); //ADD ACCOUNT
app.post('/login', user.login); //VALIDATE LOGIN
app.get('/home', user.home); //call for dashboard page after login
app.get('/editProfile', routes.editProfile); //Display editProfile
app.get('/results',user.resultsPage);
app.get('/client',user.client);
app.post('/subscribe', (req, res) => {
  const subscription = req.body

  res.status(201).json({});

  // create payload
  const payload = JSON.stringify({
    title: 'Welcome to Teampalak',
    message: 'testing',
  });

  webPush.sendNotification(subscription, payload)
    .catch(error => console.error(error));
});
app.get('/registrations', user.registrations);
app.get('/tournaments', user.tournaments);
app.get('/history', user.history);
app.get('/history2', user.history2);
app.get('/login_tournaments', user.login_tournaments);
app.get('/logout', user.logout); //call for logout
app.get('/bracket',user.bracket);
app.post('/editProfile', user.editProfile);
app.post('/changeInGameNameLol',user.changeInGameNameLol);
app.post('/changeInGameNameDota2',user.changeInGameNameDota2);
app.post('/uploadProfile',user.uploadProfile);

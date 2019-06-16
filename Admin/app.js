/**
* MODULE DEPENDENCIES
*/
var express = require('express');
var moment = require('moment');
var session = require('express-session');
var bodyParser = require('body-parser');
var routes = require('routes');
var http = require('http');
var path = require('path');
var bcrypt = require('bcrypt');
var fileUpload = require('express-fileupload');
var mysql = require('mysql');
var app = express();
var db_config = {
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'teampalak'
};
var con;
var fs = require('fs');
var FileReader = require('filereader');

//CONNECT TO DATABASE AND HANDLE CONNECTION ERRORS
function handleDisconnect() {
  con = mysql.createConnection(db_config); 
  con.connect(function(err) { 
    if(err) {
      console.log('Error connecting to database: ', err);
      setTimeout(handleDisconnect, 2000); 
    } 
  });

  con.on('error', function(err) {
    if(err.code === 'PROTOCOL_CONNECTION_LOST') { 
      handleDisconnect();                        
    } else {                                      
      throw err;                         
    }
  });
}

handleDisconnect();

app.listen(3001, function() {
  console.log("Admin module running on port 3001.");
});

/**
* CACHE
*/
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  secret: 'somesecretkey',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: null }
}));

app.use(function(request, response, next) {
  response.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  next();
});

app.use(fileUpload());
 
/**
* PAGES
*/
app.get('/', (request, response) => {
  let user = request.session.user;
  let accountType = request.session.accountType;

  if(user) {
    con.query('SELECT * FROM accounts WHERE AccountType = "Admin" AND username = ?',[user], function(err, rows, fields) {
      con.query('SELECT tournaments.TournamentID, TournamentName, TournamentGame, TournaRange, Status, DATE_FORMAT(tournament_details.TSched,"%M %d, %Y") AS tDate, DATE_FORMAT(tournament_details.TSched,"%l:%i %p") AS tTime, tournament_details.Max_participants, tournament_details.TVenue, FORMAT(tournament_details.registration_fee, 2) AS registration_fee, LENGTH(tournament_details.Tpic) AS Tpiclength FROM tournaments INNER JOIN tournament_details ON tournaments.TournamentID = tournament_details.TournamentID WHERE DATE_FORMAT(tournament_details.TSched,"%Y-%m-%d") = DATE_FORMAT(CONVERT_TZ(NOW(),"+0:00","+08:00"),"%Y-%m-%d") AND Status = "Open"', function(err, rows1, fields){
        con.query('SELECT tournaments.TournamentID, TournamentName, TournamentGame, TournaRange, Status, DATE_FORMAT(tournament_details.TSched,"%M %d, %Y") AS tDate, DATE_FORMAT(tournament_details.TSched,"%l:%i %p") AS tTime, tournament_details.Max_participants, tournament_details.TVenue, FORMAT(tournament_details.registration_fee, 2) AS registration_fee, LENGTH(tournament_details.Tpic) AS Tpiclength FROM tournaments INNER JOIN tournament_details ON tournaments.TournamentID = tournament_details.TournamentID WHERE DATE_FORMAT(tournament_details.TSched,"%Y-%m-%d") > DATE_FORMAT(CONVERT_TZ(NOW(),"+0:00","+08:00"),"%Y-%m-%d") AND Status = "Open"', function(err, rows2, fields){
          response.render('index', {
            today: moment(new Date()).format('MMMM DD, YYYY'),
            user: user,
            data: rows1,
            data2: rows2,
            accountType: accountType
          });
        });
      });
    });
  } else {
    response.redirect('/login');
  }
});

//DISPLAYS LOG IN PAGE
app.get('/login', (request, response) => {
  let user = request.session.user;
  let accountType = request.session.accountType;

  if(user) {
    response.redirect('/');   
  } else {
    response.render('login', {
      user: user,
      accountType: accountType
    });
  }
});

//VALIDATES LOG IN
app.post('/login', (request, response) => {
  if (request.body.user) {
    con.query('SELECT * FROM accounts WHERE AccountType = "Admin" AND username = ?',[request.body.user], function(err, rows, fields) {
      if(rows.length > 0) {
        con.query('SELECT * FROM accounts WHERE AccountType = "Admin" AND username = ?',[request.body.user], function(err, rows, fields) {
          if(bcrypt.compareSync(request.body.password, rows[0].Password)) {
            request.session.user = request.body.user;
            request.session.accountType = rows[0].AccountType;
            response.send("<script type='text/javascript'>alert('Successfully logged in.'); window.location.replace(\"/\");</script>")
          } else {
            response.send("<script type='text/javascript'>alert('Incorrect username/password.'); window.location.replace(\"/login\");</script>")
          }
        });
      } else {
        response.send("<script type='text/javascript'>alert('No account registered.'); window.location.replace(\"/login\");</script>")
      }
    });
  }
});

//DISPLAYS SIGN UP PAGE
app.get('/signup', (request, response) => {
  let user = request.session.user;
  let accountType = request.session.accountType;
  
  if(user && accountType == 'Admin') {
    response.render('signupform', {
      user: user,
      accountType: accountType
    });
  } else {
    response.redirect('/');
  }
});

//ADDS ACCOUNT
app.post('/signup', (request, response) => {
  if (request.body.user) {
    var query = "SELECT * FROM accounts WHERE username = ?";
    con.query(query,[request.body.user], function(err, rows, fields) {
      if(rows.length > 0) {
        response.send("<script type='text/javascript'>alert('Username is already taken.'); window.location.replace(\"/signup\");</script>");
      } else {
        if(request.body.password != request.body.repassword) {
          response.send("<script type='text/javascript'>alert('Passwords do not match.'); window.location.replace(\"/signup\");</script>");
        } else {
          var insert = "INSERT INTO accounts (username, password, firstname, lastname, email) VALUES ?";
          let hash = bcrypt.hashSync(request.body.password, 10);
          var values = [
            [request.body.user, hash, request.body.firstName, request.body.lastName, request.body.email]
          ];
          con.query(insert,[values], function(err, rows, fields) {
            response.send("<script type='text/javascript'>alert('Account successfully registered.'); window.location.replace(\"/signup\");</script>");
          });
        }
      }
    });       
  }
});

//DISPLAYS TOURNAMENTS PAGE
app.get('/tournaments', (request, response) => {
  let user = request.session.user;
  let accountType = request.session.accountType;
  var tomorrow = moment(new Date()).add(1, 'days').format('YYYY-MM-DD');
  
  if(user && accountType == 'Admin') {
    //ORIGINAL QUERY
    //con.query('SELECT tournaments.TournamentID, TournamentName, TournamentGame, TournaRange, Status, DATE_FORMAT(tournament_details.TSched,"%M %d, %Y") AS tDate, DATE_FORMAT(tournament_details.TSched,"%l:%i %p") AS tTime, tournament_details.Max_participants, tournament_details.TVenue, FORMAT(tournament_details.registration_fee, 2) AS registration_fee, LENGTH(tournament_details.Tpic) AS Tpiclength FROM tournaments INNER JOIN tournament_details ON tournaments.TournamentID = tournament_details.TournamentID', function(err, rows, fields) {
    con.query('SELECT t.TournamentID AS TournamentID, t.TournamentName AS TournamentName, t.TournamentGame AS TournamentGame, td.TournaRange AS TournaRange, t.Status AS Status, DATE_FORMAT(td.TSched,"%M %d, %Y") AS tDate, DATE_FORMAT(td.TSched,"%l:%i %p") AS tTime, td.Max_participants AS Max_participants, td.TVenue AS TVenue, FORMAT(td.registration_fee, 2) AS registration_fee, LENGTH(td.Tpic) AS Tpiclength, rt.registeredteams AS registeredteamID FROM tournament_details td INNER JOIN (SELECT TournamentID, TournamentName, TournamentGame, Status FROM tournaments) t  ON t.TournamentID = td.TournamentID LEFT JOIN (SELECT COUNT(registeredteamID) AS registeredteams, tournament_details.TournamentID FROM tournament_details LEFT JOIN registered_teams ON tournament_details.TournamentID = registered_teams.TournamentID WHERE Status = "Approved" GROUP BY TournamentID) rt ON td.TournamentID = rt.TournamentID', function(err, rows, fields) {
      //con.query('SELECT COUNT(tourna.ID) AS teams FROM (SELECT Team1ID AS ID FROM game WHERE TournaID = ? UNION SELECT Team2ID AS ID FROM game WHERE TournaID = ?) AS tourna', [index, index], function(err, rows2, fields) {
        response.render('tournaments', {
          user: request.session.user,
          accountType: request.session.accountType,
          data: rows,
          tomorrow: tomorrow
        });
      //});
    });
  } else {
    response.redirect('/');
  }
});

//DISPLAYS ADD TOURNAMENT PAGE
app.get('/addtournament', (request, response) => {
  let user = request.session.user;
  let accountType = request.session.accountType;
  var tomorrow = moment(new Date()).add(1, 'days').format('YYYY-MM-DD');

  if(user && accountType == 'Admin') {
    response.render('addtournament', {
      user: user,
      accountType: accountType,
      tomorrow: tomorrow
    });
  } else {
    response.redirect('/');
  }
});

//ADDS TOURNAMENT
app.post('/addtournament', (request, response) => {
  let user = request.session.user;
  let accountType = request.session.accountType;

  if(user && accountType == 'Admin') {
    var lowerrankname;
    var lowerrankvalue;
    var upperrankname;
    var upperrankvalue;

    if(request.body.TournamentGame == "LoL") {
      con.query('SELECT rankid, rankname, ranklb, rankub FROM leaguerank WHERE rankid IN (?,?)', [request.body.LowerRank, request.body.UpperRank], function(err, rank, fields){
        lowerrankname = rank[0].rankname;
        lowerrankvalue = rank[0].ranklb;
        upperrankname = rank[1].rankname;
        upperrankvalue = rank[1].rankub;

        var values = [
          [request.body.TournamentName, request.body.TournamentGame, lowerrankvalue, upperrankvalue, 'Open']
        ];

        con.query('INSERT INTO tournaments (TournamentName, TournamentGame, tournaLB, tournaUB, Status) VALUES ?',[values], function(err, rows, fields) {
          con.query('SELECT LAST_INSERT_ID() AS lastID', function(err, rows, fields) {
            
            if(request.body.TournamentPicture) {
              var image = fs.readFileSync(path.resolve(__dirname, "../TEAMPALAK/upload/" + request.body.TournamentPicture));
              var filetype = path.extname(request.body.TournamentPicture);

              if(filetype == '.jpg' || filetype == '.png' || filetype == '.jpeg') {
                  var values2 = [
                    [rows[0].lastID, request.body.FirstPrize, request.body.SecondPrize, lowerrankname + " - " + upperrankname, request.body.tDate + " " + request.body.tTime, request.body.TournamentVenue, request.body.Price, request.body.MaxParticipants, image]
                  ];
                  con.query('INSERT INTO tournament_details (TournamentID, 1stPrize, 2ndPrize, TournaRange, TSched, TVenue, registration_fee, Max_participants, Tpic) VALUES ?',[values2], function(err, rows, fields) {
                    //response.send("<script type='text/javascript'>alert('Tournament has been added.'); window.location.replace(\"/tournaments\");</script>");
                    response.redirect('/tournaments');
                  });
              } else {
                response.send("<script type='text/javascript'>alert('Invalid image.'); window.location.replace(\"/tournaments\");</script>");
              }
            } else { 
              var values2 = [
                [rows[0].lastID, request.body.FirstPrize, request.body.SecondPrize, lowerrankname + " - " + upperrankname, request.body.tDate + " " + request.body.tTime, request.body.TournamentVenue, request.body.Price, request.body.MaxParticipants]
              ];

              con.query('INSERT INTO tournament_details (TournamentID, 1stPrize, 2ndPrize, TournaRange, TSched, TVenue, registration_fee, Max_participants) VALUES ?',[values2], function(err, rows, fields) {
                //response.send("<script type='text/javascript'>alert('Tournament has been added.'); window.location.replace(\"/tournaments\");</script>");
                response.redirect('/tournaments');
              });
            }
          });
        });
      });
    } else {
      con.query('SELECT rankid, rankname, ranklb, rankub FROM dota_ranks WHERE rankid IN (?,?)', [request.body.LowerRank, request.body.UpperRank], function(err, rank, fields){
        lowerrankname = rank[0].rankname;
        lowerrankvalue = rank[0].ranklb;
        upperrankname = rank[1].rankname;
        upperrankvalue = rank[1].rankub;

        var values = [
          [request.body.TournamentName, request.body.TournamentGame, lowerrankvalue, upperrankvalue, 'Open']
        ];

        con.query('INSERT INTO tournaments (TournamentName, TournamentGame, tournaLB, tournaUB, Status) VALUES ?',[values], function(err, rows, fields) {
          con.query('SELECT LAST_INSERT_ID() AS lastID', function(err, rows, fields) {
            
            if(request.body.TournamentPicture) {
              var image = fs.readFileSync(path.resolve(__dirname, "../TEAMPALAK/upload/" + request.body.TournamentPicture));
              var filetype = path.extname(request.body.TournamentPicture);

              if(filetype == '.jpg' || filetype == '.png' || filetype == '.jpeg') {
                  var values2 = [
                    [rows[0].lastID, request.body.FirstPrize, request.body.SecondPrize, lowerrankname + " - " + upperrankname, request.body.tDate + " " + request.body.tTime, request.body.TournamentVenue, request.body.Price, request.body.MaxParticipants, image]
                  ];
                  con.query('INSERT INTO tournament_details (TournamentID, 1stPrize, 2ndPrize, TournaRange, TSched, TVenue, registration_fee, Max_participants, Tpic) VALUES ?',[values2], function(err, rows, fields) {
                    //response.send("<script type='text/javascript'>alert('Tournament has been added.'); window.location.replace(\"/tournaments\");</script>");
                    response.redirect('/tournaments');
                  });
              } else {
                response.send("<script type='text/javascript'>alert('Invalid image.'); window.location.replace(\"/tournaments\");</script>");
              }
            } else { 
              var values2 = [
                [rows[0].lastID, request.body.FirstPrize, request.body.SecondPrize, lowerrankname + " - " + upperrankname, request.body.tDate + " " + request.body.tTime, request.body.TournamentVenue, request.body.Price, request.body.MaxParticipants]
              ];

              con.query('INSERT INTO tournament_details (TournamentID, 1stPrize, 2ndPrize, TournaRange, TSched, TVenue, registration_fee, Max_participants) VALUES ?',[values2], function(err, rows, fields) {
                //response.send("<script type='text/javascript'>alert('Tournament has been added.'); window.location.replace(\"/tournaments\");</script>");
                response.redirect('/tournaments');
              });
            }
          });
        });
      });
    }
  } else {
    response.redirect('/');
  }
});

//DISPLAYS TOURNAMENT DETAILS
app.post('/viewtdetails', (request, response) => {
  let user = request.session.user;
  let accountType = request.session.accountType;
  let index = parseInt(request.body.TournamentID);
  var tomorrow = moment(new Date()).add(1, 'days').format('YYYY-MM-DD');

  con.query('SELECT tournaments.TournamentID, REPLACE(FORMAT(1stPrize, 2), ",", "") AS FirstPrize, REPLACE(FORMAT(2ndPrize, 2), ",", "") AS SecondPrize, SUBSTRING_INDEX(TournaRange,"-",1) AS LowerRank, SUBSTRING_INDEX(TournaRange,"-",-1) AS UpperRank, TournamentName, TournamentGame, Status, DATE_FORMAT(tournament_details.TSched,"%Y-%m-%d") AS tDate, DATE_FORMAT(tournament_details.TSched,"%H:%i") AS tTime, tournament_details.Max_participants, tournament_details.TVenue, FORMAT(tournament_details.registration_fee, 2) AS registration_fee, TO_BASE64(CAST(tournament_details.Tpic AS CHAR)) AS Tpic FROM tournaments INNER JOIN tournament_details ON tournaments.TournamentID = tournament_details.TournamentID WHERE tournaments.TournamentID = ?', index, function(err, rows, fields) {
    //con.query('SELECT COUNT(tourna.ID) AS teams FROM (SELECT Team1ID AS ID FROM game WHERE TournaID = ? UNION SELECT Team2ID AS ID FROM game WHERE TournaID = ?) AS tourna', [index, index], function(err, rows2, fields) {
      response.render('tdetails', {
        user: request.session.user,
        accountType: request.session.accountType,
        data: rows,
        //data2: rows2,
        TournamentID: index,
        tomorrow: tomorrow,
        edit: parseInt(0)
      });
    //});
  });
});

//DISPLAYS TOURNAMENT DETAILS
app.post('/viewtregister', (request, response) => {
  let user = request.session.user;
  let accountType = request.session.accountType;
  let index = parseInt(request.body.TournamentID);
  let GameID = parseInt(request.body.GameID);
  let winnerArray = request.body.roundWinner;

  con.query('SELECT MAX(Rounds) AS round FROM game WHERE tournamentID = ?', index, function(err, latestround, fields){
    if(latestround[0].round != null){
      var round = latestround[0].round;
      if(winnerArray){
        if(round < 4 ){
          for(i = 0; i < winnerArray.length; i+=2){
            var str = winnerArray[i];
            var str2 = winnerArray[i+1];
            var array = str.split(",");
            var array2 = str2.split(",");

            var values = [
              [index, round+1, array[1], array2[1]]
            ];

            con.query('UPDATE game SET Winner = ? WHERE GameID = ?', [array[1], array[0]]);
            con.query('UPDATE game SET Winner = ? WHERE GameID = ?', [array2[1], array2[0]]);
            con.query('INSERT INTO game (tournamentID, Rounds, Team1ID, Team2ID) VALUES ?', [values]);
          }
          round = round + 1;
          con.query('SELECT t.TournamentID AS TournamentID, t.TournamentName AS TournamentName, t.TournamentGame AS TournamentGame, REPLACE(FORMAT(td.1stPrize, 2), ",", "") AS FirstPrize, REPLACE(FORMAT(td.2ndPrize, 2), ",", "") AS SecondPrize, td.TournaRange AS TournaRange, t.Status AS Status, DATE_FORMAT(td.TSched,"%M %d, %Y") AS tDate, DATE_FORMAT(td.TSched,"%l:%i %p") AS tTime, td.Max_participants AS Max_participants, td.TVenue AS TVenue, FORMAT(td.registration_fee, 2) AS registration_fee, TO_BASE64(CAST(td.Tpic AS CHAR)) AS Tpic, rt.registeredteams AS registeredteamID, rt.seed FROM tournament_details td INNER JOIN (SELECT TournamentID, TournamentName, TournamentGame, Status FROM tournaments) t  ON t.TournamentID = td.TournamentID LEFT JOIN (SELECT COUNT(registeredteamID) AS registeredteams, SUM(Seed) AS seed, tournament_details.TournamentID FROM tournament_details LEFT JOIN registered_teams ON tournament_details.TournamentID = registered_teams.TournamentID WHERE Status = "Approved" GROUP BY TournamentID) rt ON td.TournamentID = rt.TournamentID WHERE td.TournamentID = ?', index, function(err, rows, fields){
            con.query('SELECT registeredteamID, TeamName, Status, TournamentID FROM registered_teams INNER JOIN teams ON registered_teams.registeredteamID = teams.TeamID WHERE Status = "Approved" AND TournamentID = ?', index, function(err, rows2, fields) {
              con.query('SELECT registeredteamID, TeamName, Status, TournamentID FROM registered_teams INNER JOIN teams ON registered_teams.registeredteamID = teams.TeamID WHERE Status = "Pending" AND TournamentID = ?', index, function(err, rows3, fields) {
                con.query('SELECT game.GameID, game.tournamentID, game.Rounds, game.Team1ID, teama.TeamName AS Team1Name, game.Team2ID, teamb.TeamName AS Team2Name FROM game as game INNER JOIN teams as teama on teama.TeamID = game.Team1ID INNER JOIN teams as teamb on teamb.TeamID = game.Team2ID WHERE tournamentID = ? AND Rounds = ?', [index, round], function(err, rows4, fields){
                  response.render('tregister', {
                    results: false,
                    user: request.session.user,
                    accountType: request.session.accountType,
                    data: rows,
                    data2: rows2,
                    data3: rows3,
                    data4: rows4,
                    TournamentID: index,
                    edit: parseInt(0)
                  });
                });
              });
            });
          });
        } else {
          var str = request.body.roundWinner;
          var array = str.split(",");

          con.query('UPDATE game SET Winner = ? WHERE GameID = ?', [array[1], array[0]]);
          con.query('SELECT t.TournamentID AS TournamentID, t.TournamentName AS TournamentName, t.TournamentGame AS TournamentGame, REPLACE(FORMAT(td.1stPrize, 2), ",", "") AS FirstPrize, REPLACE(FORMAT(td.2ndPrize, 2), ",", "") AS SecondPrize, td.TournaRange AS TournaRange, t.Status AS Status, DATE_FORMAT(td.TSched,"%M %d, %Y") AS tDate, DATE_FORMAT(td.TSched,"%l:%i %p") AS tTime, td.Max_participants AS Max_participants, td.TVenue AS TVenue, FORMAT(td.registration_fee, 2) AS registration_fee, TO_BASE64(CAST(td.Tpic AS CHAR)) AS Tpic, rt.registeredteams AS registeredteamID, rt.seed FROM tournament_details td INNER JOIN (SELECT TournamentID, TournamentName, TournamentGame, Status FROM tournaments) t  ON t.TournamentID = td.TournamentID LEFT JOIN (SELECT COUNT(registeredteamID) AS registeredteams, SUM(Seed) AS seed, tournament_details.TournamentID FROM tournament_details LEFT JOIN registered_teams ON tournament_details.TournamentID = registered_teams.TournamentID WHERE Status = "Approved" GROUP BY TournamentID) rt ON td.TournamentID = rt.TournamentID WHERE td.TournamentID = ?', index, function(err, rows, fields){
            con.query('SELECT registeredteamID, TeamName, Status, TournamentID FROM registered_teams INNER JOIN teams ON registered_teams.registeredteamID = teams.TeamID WHERE Status = "Approved" AND TournamentID = ?', index, function(err, rows2, fields) {
              con.query('SELECT registeredteamID, TeamName, Status, TournamentID FROM registered_teams INNER JOIN teams ON registered_teams.registeredteamID = teams.TeamID WHERE Status = "Pending" AND TournamentID = ?', index, function(err, rows3, fields) {
                con.query('SELECT game.GameID, game.tournamentID, game.Rounds, game.Team1ID, teama.TeamName AS Team1Name, game.Team2ID, teamb.TeamName AS Team2Name, game.Winner AS WinnerID, teamc.TeamName AS WinnerName FROM game as game INNER JOIN teams as teama on teama.TeamID = game.Team1ID INNER JOIN teams as teamb on teamb.TeamID = game.Team2ID INNER JOIN teams as teamc ON teamc.TeamID = game.Winner WHERE tournamentID = ?', index, function(err, rows4, fields){
                  response.render('tregister', {
                    results: true,
                    user: request.session.user,
                    accountType: request.session.accountType,
                    data: rows,
                    data2: rows2,
                    data3: rows3,
                    data4: rows4,
                    TournamentID: index,
                    edit: parseInt(0)
                  });
                });
              });
            });
          });
        }
      } else {
        con.query('SELECT Winner FROM game WHERE tournamentID = ? AND Rounds = ?', [index, 4], function(err, checkwinner, fields){
          if(checkwinner.length && checkwinner[0].Winner != null){
            con.query('SELECT t.TournamentID AS TournamentID, t.TournamentName AS TournamentName, t.TournamentGame AS TournamentGame, REPLACE(FORMAT(td.1stPrize, 2), ",", "") AS FirstPrize, REPLACE(FORMAT(td.2ndPrize, 2), ",", "") AS SecondPrize, td.TournaRange AS TournaRange, t.Status AS Status, DATE_FORMAT(td.TSched,"%M %d, %Y") AS tDate, DATE_FORMAT(td.TSched,"%l:%i %p") AS tTime, td.Max_participants AS Max_participants, td.TVenue AS TVenue, FORMAT(td.registration_fee, 2) AS registration_fee, TO_BASE64(CAST(td.Tpic AS CHAR)) AS Tpic, rt.registeredteams AS registeredteamID, rt.seed FROM tournament_details td INNER JOIN (SELECT TournamentID, TournamentName, TournamentGame, Status FROM tournaments) t  ON t.TournamentID = td.TournamentID LEFT JOIN (SELECT COUNT(registeredteamID) AS registeredteams, SUM(Seed) AS seed, tournament_details.TournamentID FROM tournament_details LEFT JOIN registered_teams ON tournament_details.TournamentID = registered_teams.TournamentID WHERE Status = "Approved" GROUP BY TournamentID) rt ON td.TournamentID = rt.TournamentID WHERE td.TournamentID = ?', index, function(err, rows, fields){
              con.query('SELECT registeredteamID, TeamName, Status, TournamentID FROM registered_teams INNER JOIN teams ON registered_teams.registeredteamID = teams.TeamID WHERE Status = "Approved" AND TournamentID = ?', index, function(err, rows2, fields) {
                con.query('SELECT registeredteamID, TeamName, Status, TournamentID FROM registered_teams INNER JOIN teams ON registered_teams.registeredteamID = teams.TeamID WHERE Status = "Pending" AND TournamentID = ?', index, function(err, rows3, fields) {
                  con.query('SELECT game.GameID, game.tournamentID, game.Rounds, game.Team1ID, teama.TeamName AS Team1Name, game.Team2ID, teamb.TeamName AS Team2Name, game.Winner AS WinnerID, teamc.TeamName AS WinnerName FROM game as game INNER JOIN teams as teama on teama.TeamID = game.Team1ID INNER JOIN teams as teamb on teamb.TeamID = game.Team2ID INNER JOIN teams as teamc ON teamc.TeamID = game.Winner WHERE tournamentID = ?', index, function(err, rows4, fields){
                    response.render('tregister', {
                      results: true,
                      user: request.session.user,
                      accountType: request.session.accountType,
                      data: rows,
                      data2: rows2,
                      data3: rows3,
                      data4: rows4,
                      TournamentID: index,
                      edit: parseInt(0)
                    });
                  });
                });
              });
            });
          } else {
            con.query('SELECT t.TournamentID AS TournamentID, t.TournamentName AS TournamentName, t.TournamentGame AS TournamentGame, REPLACE(FORMAT(td.1stPrize, 2), ",", "") AS FirstPrize, REPLACE(FORMAT(td.2ndPrize, 2), ",", "") AS SecondPrize, td.TournaRange AS TournaRange, t.Status AS Status, DATE_FORMAT(td.TSched,"%M %d, %Y") AS tDate, DATE_FORMAT(td.TSched,"%l:%i %p") AS tTime, td.Max_participants AS Max_participants, td.TVenue AS TVenue, FORMAT(td.registration_fee, 2) AS registration_fee, TO_BASE64(CAST(td.Tpic AS CHAR)) AS Tpic, rt.registeredteams AS registeredteamID, rt.seed FROM tournament_details td INNER JOIN (SELECT TournamentID, TournamentName, TournamentGame, Status FROM tournaments) t  ON t.TournamentID = td.TournamentID LEFT JOIN (SELECT COUNT(registeredteamID) AS registeredteams, SUM(Seed) AS seed, tournament_details.TournamentID FROM tournament_details LEFT JOIN registered_teams ON tournament_details.TournamentID = registered_teams.TournamentID WHERE Status = "Approved" GROUP BY TournamentID) rt ON td.TournamentID = rt.TournamentID WHERE td.TournamentID = ?', index, function(err, rows, fields){
              con.query('SELECT registeredteamID, TeamName, Status, TournamentID FROM registered_teams INNER JOIN teams ON registered_teams.registeredteamID = teams.TeamID WHERE Status = "Approved" AND TournamentID = ?', index, function(err, rows2, fields) {
                con.query('SELECT registeredteamID, TeamName, Status, TournamentID FROM registered_teams INNER JOIN teams ON registered_teams.registeredteamID = teams.TeamID WHERE Status = "Pending" AND TournamentID = ?', index, function(err, rows3, fields) {
                  con.query('SELECT game.GameID, game.tournamentID, game.Rounds, game.Team1ID, teama.TeamName AS Team1Name, game.Team2ID, teamb.TeamName AS Team2Name FROM game as game INNER JOIN teams as teama on teama.TeamID = game.Team1ID INNER JOIN teams as teamb on teamb.TeamID = game.Team2ID WHERE tournamentID = ? AND Rounds = ?', [index, round], function(err, rows4, fields){
                    response.render('tregister', {
                      results: false,
                      user: request.session.user,
                      accountType: request.session.accountType,
                      data: rows,
                      data2: rows2,
                      data3: rows3,
                      data4: rows4,
                      TournamentID: index,
                      edit: parseInt(0)
                    });
                  });
                });
              });
            });
          }
        });
      }
    } else {
      con.query('SELECT t.TournamentID AS TournamentID, t.TournamentName AS TournamentName, t.TournamentGame AS TournamentGame, REPLACE(FORMAT(td.1stPrize, 2), ",", "") AS FirstPrize, REPLACE(FORMAT(td.2ndPrize, 2), ",", "") AS SecondPrize, td.TournaRange AS TournaRange, t.Status AS Status, DATE_FORMAT(td.TSched,"%M %d, %Y") AS tDate, DATE_FORMAT(td.TSched,"%l:%i %p") AS tTime, td.Max_participants AS Max_participants, td.TVenue AS TVenue, FORMAT(td.registration_fee, 2) AS registration_fee, TO_BASE64(CAST(td.Tpic AS CHAR)) AS Tpic, rt.registeredteams AS registeredteamID, rt.seed FROM tournament_details td INNER JOIN (SELECT TournamentID, TournamentName, TournamentGame, Status FROM tournaments) t  ON t.TournamentID = td.TournamentID LEFT JOIN (SELECT COUNT(registeredteamID) AS registeredteams, SUM(Seed) AS seed, tournament_details.TournamentID FROM tournament_details LEFT JOIN registered_teams ON tournament_details.TournamentID = registered_teams.TournamentID WHERE Status = "Approved" GROUP BY TournamentID) rt ON td.TournamentID = rt.TournamentID WHERE td.TournamentID = ?', index, function(err, rows, fields){
        con.query('SELECT registeredteamID, TeamName, Status, TournamentID FROM registered_teams INNER JOIN teams ON registered_teams.registeredteamID = teams.TeamID WHERE Status = "Approved" AND TournamentID = ?', index, function(err, rows2, fields) {
          con.query('SELECT registeredteamID, TeamName, Status, TournamentID FROM registered_teams INNER JOIN teams ON registered_teams.registeredteamID = teams.TeamID WHERE Status = "Pending" AND TournamentID = ?', index, function(err, rows3, fields) {
            con.query('SELECT game.GameID, game.tournamentID, game.Rounds, game.Team1ID, teama.TeamName AS Team1Name, game.Team2ID, teamb.TeamName AS Team2Name FROM game as game INNER JOIN teams as teama on teama.TeamID = game.Team1ID INNER JOIN teams as teamb on teamb.TeamID = game.Team2ID WHERE tournamentID = ?', index, function(err, rows4, fields){
              response.render('tregister', {
                results: false,
                user: request.session.user,
                accountType: request.session.accountType,
                data: rows,
                data2: rows2,
                data3: rows3,
                data4: rows4,
                TournamentID: index,
                edit: parseInt(0)
              });
            });
          });
        });
      });
    }
  });
});

//APPROVES TOURNAMENT REGISTRATION
app.post('/approveteam', (request, response) => {
  let user = request.session.user;
  let accountType = request.session.accountType;
  let index = parseInt(request.body.TournamentID);
  let registeredteamID = parseInt(request.body.registeredteamID);

  con.query('UPDATE registered_teams SET Status = "Approved" WHERE registeredteamID = ? AND TournamentID = ?', [registeredteamID, index], function(err, row, fields) {
    con.query('SELECT t.TournamentID AS TournamentID, t.TournamentName AS TournamentName, t.TournamentGame AS TournamentGame, td.TournaRange AS TournaRange, t.Status AS Status, DATE_FORMAT(td.TSched,"%M %d, %Y") AS tDate, DATE_FORMAT(td.TSched,"%l:%i %p") AS tTime, td.Max_participants AS Max_participants, td.TVenue AS TVenue, FORMAT(td.registration_fee, 2) AS registration_fee, TO_BASE64(CAST(td.Tpic AS CHAR)) AS Tpic, rt.registeredteams AS registeredteamID, rt.seed FROM tournament_details td INNER JOIN (SELECT TournamentID, TournamentName, TournamentGame, Status FROM tournaments) t  ON t.TournamentID = td.TournamentID LEFT JOIN (SELECT COUNT(registeredteamID) AS registeredteams, SUM(Seed) AS seed, tournament_details.TournamentID FROM tournament_details LEFT JOIN registered_teams ON tournament_details.TournamentID = registered_teams.TournamentID WHERE Status = "Approved" GROUP BY TournamentID) rt ON td.TournamentID = rt.TournamentID WHERE td.TournamentID = ?', index, function(err, rows, fields){
      con.query('SELECT registeredteamID, TeamName, Status, TournamentID FROM registered_teams INNER JOIN teams ON registered_teams.registeredteamID = teams.TeamID WHERE Status = "Approved" AND TournamentID = ?', index, function(err, rows2, fields) {
        con.query('SELECT registeredteamID, TeamName, Status, TournamentID FROM registered_teams INNER JOIN teams ON registered_teams.registeredteamID = teams.TeamID WHERE Status = "Pending" AND TournamentID = ?', index, function(err, rows3, fields) {
          response.render('tregister', {
            user: request.session.user,
            accountType: request.session.accountType,
            data: rows,
            data2: rows2,
            data3: rows3,
            TournamentID: index,
            edit: parseInt(0)
          });
        });
      });
    });
  });
});

//DENIES TOURNAMENT REGISTRATION
app.post('/denyteam', (request, response) => {
  let user = request.session.user;
  let accountType = request.session.accountType;
  let index = parseInt(request.body.TournamentID);
  let registeredteamID = parseInt(request.body.registeredteamID);

  con.query('UPDATE registered_teams SET Status = "Denied" WHERE registeredteamID = ? AND TournamentID = ?', [registeredteamID, index], function(err, row, fields) {
    con.query('SELECT t.TournamentID AS TournamentID, t.TournamentName AS TournamentName, t.TournamentGame AS TournamentGame, td.TournaRange AS TournaRange, t.Status AS Status, DATE_FORMAT(td.TSched,"%M %d, %Y") AS tDate, DATE_FORMAT(td.TSched,"%l:%i %p") AS tTime, td.Max_participants AS Max_participants, td.TVenue AS TVenue, FORMAT(td.registration_fee, 2) AS registration_fee, TO_BASE64(CAST(td.Tpic AS CHAR)) AS Tpic, rt.registeredteams AS registeredteamID, rt.seed FROM tournament_details td INNER JOIN (SELECT TournamentID, TournamentName, TournamentGame, Status FROM tournaments) t  ON t.TournamentID = td.TournamentID LEFT JOIN (SELECT COUNT(registeredteamID) AS registeredteams, SUM(Seed) AS seed, tournament_details.TournamentID FROM tournament_details LEFT JOIN registered_teams ON tournament_details.TournamentID = registered_teams.TournamentID WHERE Status = "Approved" GROUP BY TournamentID) rt ON td.TournamentID = rt.TournamentID WHERE td.TournamentID = ?', index, function(err, rows, fields){
      con.query('SELECT registeredteamID, TeamName, Status, TournamentID FROM registered_teams INNER JOIN teams ON registered_teams.registeredteamID = teams.TeamID WHERE Status = "Approved" AND TournamentID = ?', index, function(err, rows2, fields) {
        con.query('SELECT registeredteamID, TeamName, Status, TournamentID FROM registered_teams INNER JOIN teams ON registered_teams.registeredteamID = teams.TeamID WHERE Status = "Pending" AND TournamentID = ?', index, function(err, rows3, fields) {
          response.render('tregister', {
            user: request.session.user,
            accountType: request.session.accountType,
            data: rows,
            data2: rows2,
            data3: rows3,
            TournamentID: index,
            edit: parseInt(0)
          });
        });
      });
    });
  });
});

//CREATES MATCHES
app.post('/creatematches', (request, response) => {
  let user = request.session.user;
  let accountType = request.session.accountType;
  let index = parseInt(request.body.TournamentID);

  con.query('SELECT TournamentID, TeamID FROM teams INNER JOIN registered_teams ON teams.TeamID = registered_teams.registeredteamID WHERE TournamentID = ? AND Status = "Approved" ORDER BY teamAvg', index, function(err, test, fields){
    for(i = 0; i < test.length; i++ ){
      con.query('UPDATE registered_teams SET Seed = ? WHERE TournamentID = ? AND registeredteamID = ?', [i+1, test[i].TournamentID, test[i].TeamID]);
    }
    for(seed = 1; seed < test.length; seed+=2){
      con.query('SELECT registeredteamID FROM registered_teams WHERE Seed IN (?,?) AND Status = "Approved" AND TournamentID = ?', [seed, seed+1, index], function(err, row, fields){
        var values = [
          [index, 1, row[0].registeredteamID, row[1].registeredteamID]
        ];
        con.query('INSERT INTO game (tournamentID, Rounds, Team1ID, Team2ID) VALUES ?', [values]);
      });
    }
    con.query('SELECT t.TournamentID AS TournamentID, t.TournamentName AS TournamentName, t.TournamentGame AS TournamentGame, td.TournaRange AS TournaRange, t.Status AS Status, DATE_FORMAT(td.TSched,"%M %d, %Y") AS tDate, DATE_FORMAT(td.TSched,"%l:%i %p") AS tTime, td.Max_participants AS Max_participants, td.TVenue AS TVenue, FORMAT(td.registration_fee, 2) AS registration_fee, TO_BASE64(CAST(td.Tpic AS CHAR)) AS Tpic, rt.registeredteams AS registeredteamID, rt.seed FROM tournament_details td INNER JOIN (SELECT TournamentID, TournamentName, TournamentGame, Status FROM tournaments) t  ON t.TournamentID = td.TournamentID LEFT JOIN (SELECT COUNT(registeredteamID) AS registeredteams, SUM(Seed) AS seed, tournament_details.TournamentID FROM tournament_details LEFT JOIN registered_teams ON tournament_details.TournamentID = registered_teams.TournamentID WHERE Status = "Approved" GROUP BY TournamentID) rt ON td.TournamentID = rt.TournamentID WHERE td.TournamentID = ?', index, function(err, rows, fields){
      con.query('SELECT registeredteamID, TeamName, Status, TournamentID FROM registered_teams INNER JOIN teams ON registered_teams.registeredteamID = teams.TeamID WHERE Status = "Approved" AND TournamentID = ?', index, function(err, rows2, fields) {
        con.query('SELECT registeredteamID, TeamName, Status, TournamentID FROM registered_teams INNER JOIN teams ON registered_teams.registeredteamID = teams.TeamID WHERE Status = "Pending" AND TournamentID = ?', index, function(err, rows3, fields) {
          con.query('SELECT game.GameID, game.tournamentID, game.Rounds, game.Team1ID, teama.TeamName AS Team1Name, game.Team2ID, teamb.TeamName AS Team2Name FROM game as game INNER JOIN teams as teama on teama.TeamID = game.Team1ID INNER JOIN teams as teamb on teamb.TeamID = game.Team2ID WHERE tournamentID = ?', index, function(err, rows4, fields){
            response.render('tregister', {
              results: false,
              user: request.session.user,
              accountType: request.session.accountType,
              data: rows,
              data2: rows2,
              data3: rows3,
              data4: rows4,
              TournamentID: index,
              edit: parseInt(0)
            });
          });
        });
      });
    });
  });
});

//UPDATES TOURNAMENT DETAILS
app.post('/updatetournament', (request, response) => {
  let user = request.session.user;
  let accountType = request.session.accountType;
  let index = parseInt(request.body.TournamentID);

  var TournamentName = request.body.TournamentName;
  var FirstPrize = request.body.FirstPrize;
  var SecondPrize = request.body.SecondPrize;
  var TournaRange;
  var TournamentGame = request.body.TournamentGame;
  var TSched = request.body.tDate + " " + request.body.tTime;
  var TVenue = request.body.TournamentVenue;
  var MaxParticipants = request.body.MaxParticipants;
  var registration_fee = request.body.Price;
  var lowerrankname;
  var lowerrankvalue;
  var upperrankname;
  var upperrankvalue;

  if(request.body.TournamentGame == "LoL") {
    con.query('SELECT rankid, rankname, ranklb, rankub FROM leaguerank WHERE rankid IN (?,?)', [request.body.LowerRank, request.body.UpperRank], function(err, rank, fields){
      lowerrankname = rank[0].rankname;
      lowerrankvalue = rank[0].ranklb;
      upperrankname = rank[1].rankname;
      upperrankvalue = rank[1].rankub;
      TournaRange = lowerrankname + " - " + upperrankname;

      if(request.body.TournamentPicture) {
        var image = fs.readFileSync(path.resolve(__dirname, "../TEAMPALAK/upload/" + request.body.TournamentPicture));
        var filetype = path.extname(request.body.TournamentPicture);

        if(filetype == '.jpg' || filetype == '.png' || filetype == '.jpeg') {
          con.query('UPDATE tournaments SET TournamentName = ?, TournamentGame = ?, tournaLB = ?, tournaUB = ? WHERE TournamentID = ?', [TournamentName, TournamentGame, lowerrankvalue, upperrankvalue, index], function(err, rows, fields) {
            con.query('UPDATE tournament_details SET 1stPrize = ?, 2ndPrize = ?, TournaRange = ?, TSched = ?, TVenue = ?, Max_participants = ?, registration_fee = ?, Tpic = ? WHERE TournamentID = ?', [FirstPrize, SecondPrize, TournaRange, TSched, TVenue, MaxParticipants, registration_fee, image, index], function(err, rows, fields) {
              response.redirect('/tournaments');
            });
          });
        } else {
          response.send("<script type='text/javascript'>alert('Invalid image.'); window.location.replace(\"/tournaments\");</script>");
        }
      } else {
        con.query('UPDATE tournaments SET TournamentName = ?, TournamentGame = ?, tournaLB = ?, tournaUB = ? WHERE TournamentID = ?', [TournamentName, TournamentGame, lowerrankvalue, upperrankvalue, index], function(err, rows, fields) {
          con.query('UPDATE tournament_details SET 1stPrize = ?, 2ndPrize = ?, TournaRange = ?, TSched = ?, TVenue = ?, Max_participants = ?, registration_fee = ? WHERE TournamentID = ?', [FirstPrize, SecondPrize, TournaRange, TSched, TVenue, MaxParticipants, registration_fee, index], function(err, rows, fields) {
            response.redirect('/tournaments');
          });
        });
      }
    });
  } else {
    con.query('SELECT rankid, rankname, ranklb, rankub FROM dota_ranks WHERE rankid IN (?,?)', [request.body.LowerRank, request.body.UpperRank], function(err, rank, fields){
      lowerrankname = rank[0].rankname;
      lowerrankvalue = rank[0].ranklb;
      upperrankname = rank[1].rankname;
      upperrankvalue = rank[1].rankub;
      TournaRange = lowerrankname + " - " + upperrankname;

      if(request.body.TournamentPicture) {
        var image = fs.readFileSync(path.resolve(__dirname, "../TEAMPALAK/upload/" + request.body.TournamentPicture));
        var filetype = path.extname(request.body.TournamentPicture);

        if(filetype == '.jpg' || filetype == '.png' || filetype == '.jpeg') {
          con.query('UPDATE tournaments SET TournamentName = ?, TournamentGame = ?, tournaLB = ?, tournaUB = ? WHERE TournamentID = ?', [TournamentName, TournamentGame, lowerrankvalue, upperrankvalue, index], function(err, rows, fields) {
            con.query('UPDATE tournament_details SET 1stPrize = ?, 2ndPrize = ?, TournaRange = ?, TSched = ?, TVenue = ?, Max_participants = ?, registration_fee = ?, Tpic = ? WHERE TournamentID = ?', [FirstPrize, SecondPrize, TournaRange, TSched, TVenue, MaxParticipants, registration_fee, image, index], function(err, rows, fields) {
              response.redirect('/tournaments');
            });
          });
        } else {
          response.send("<script type='text/javascript'>alert('Invalid image.'); window.location.replace(\"/tournaments\");</script>");
        }
      } else {
        con.query('UPDATE tournaments SET TournamentName = ?, TournamentGame = ?, tournaLB = ?, tournaUB = ? WHERE TournamentID = ?', [TournamentName, TournamentGame, lowerrankvalue, upperrankvalue, index], function(err, rows, fields) {
          con.query('UPDATE tournament_details SET 1stPrize = ?, 2ndPrize = ?, TournaRange = ?, TSched = ?, TVenue = ?, Max_participants = ?, registration_fee = ? WHERE TournamentID = ?', [FirstPrize, SecondPrize, TournaRange, TSched, TVenue, MaxParticipants, registration_fee, index], function(err, rows, fields) {
            response.redirect('/tournaments');
          });
        });
      }
    });  
  }
});

//REMOVES TOURNAMENT PICTURE
app.post('/removetpicture', (request, response) => {
  let user = request.session.user;
  let accountType = request.session.accountType;
  let index = parseInt(request.body.TournamentID);

  con.query('UPDATE tournament_details SET Tpic = ? WHERE TournamentID = ?', ["", index], function(err, rows, fields) {
    response.redirect('/tournaments');
  });
});

//CLOSES TOURNAMENT
app.post('/closetournament', (request, response) => {
  let user = request.session.user;
  let accountType = request.session.accountType;
  let index = parseInt(request.body.TournamentID);

  con.query('UPDATE tournaments SET status = "Closed" WHERE tournaments.TournamentID = ?', index, function(err, rows, fields) {
    response.redirect('/tournaments');
  });
});

//REMOVES TOURNAMENT
app.post('/removetournament', (request, response) => {
  let user = request.session.user;
  let accountType = request.session.accountType;
  let index = parseInt(request.body.TournamentID);

  con.query('DELETE FROM tournaments WHERE tournaments.TournamentID = ?', index, function(err, rows, fields) {
    response.send("<script type='text/javascript'>alert('Tournament has been removed.'); window.location.replace(\"/tournaments\");</script>");
  });
});

//DISPLAYS ANNOUNCEMENTS PAGE
app.get('/announcements', (request, response) => {
  let user = request.session.user;
  let accountType = request.session.accountType;

  if(user && accountType == 'Admin') {
    con.query('SELECT announcementID, announcementTitle, announcementMessage, DATE_FORMAT(announcementDate,"%M %d, %Y") AS aDate, DATE_FORMAT(announcementDate,"%l:%i %p") AS aTime, LENGTH(announcementPic) AS Apiclength FROM announcements', function(err, rows, fields) {
      response.render('announcements', {
        user: request.session.user,
        accountType: request.session.accountType,
        data: rows,
      });
    });
  } else {
    response.redirect('/');
  }
});

//DISPLAYS ADD TOURNAMENT PAGE
app.get('/addannouncement', (request, response) => {
  let user = request.session.user;
  let accountType = request.session.accountType;

  if(user && accountType == 'Admin') {
    response.render('addannouncement', {
      user: user,
      accountType: accountType
    });
  } else {
    response.redirect('/');
  }
});

//ADDS ANNOUNCEMENT
app.post('/addannouncement', (request, response) => {
  let user = request.session.user;
  let accountType = request.session.accountType;

  if(user && accountType == 'Admin') {
    if(request.body.announcementPic) {
      var image = fs.readFileSync(path.resolve(__dirname, "../TEAMPALAK/upload/" + request.body.announcementPic));
      var filetype = path.extname(request.body.announcementPic);
      
      if(filetype == '.jpg' || filetype == '.png' || filetype == '.jpeg') {
        var values = [
          [request.body.announcementTitle, request.body.announcementMessage, new Date(), image]
        ];

        con.query('INSERT INTO announcements (announcementTitle, announcementMessage, announcementDate, announcementPic) VALUES ?',[values], function(err, rows, fields) {
          response.redirect('/announcements');
        });
      } else {
        response.send("<script type='text/javascript'>alert('Invalid image.'); window.location.replace(\"/announcements\");</script>");
      }
    } else {
      var values = [
        [request.body.announcementTitle, request.body.announcementMessage, new Date()]
      ];

      con.query('INSERT INTO announcements (announcementTitle, announcementMessage, announcementDate) VALUES ?',[values], function(err, rows, fields) {
        response.redirect('/announcements');
      });
    }
  } else {
    response.redirect('/');
  }
});

//DISPLAYS ANNOUNCEMENT DETAILS
app.post('/viewadetails', (request, response) => {
  let user = request.session.user;
  let accountType = request.session.accountType;
  let index = parseInt(request.body.announcementID);

  con.query('SELECT announcementID, announcementTitle, announcementMessage, DATE_FORMAT(announcementDate,"%M %d, %Y") AS aDate, DATE_FORMAT(announcementDate,"%l:%i %p") AS aTime, TO_BASE64(CAST(announcementPic AS CHAR)) AS Apic FROM announcements WHERE announcementID = ?', index, function(err, rows, fields) {
    response.render('adetails', {
      user: request.session.user,
      accountType: request.session.accountType,
      data: rows,
      announcementID: index,
      edit: parseInt(0)
    });
  });
});

//UPDATES ANNOUNCEMENT DETAILS
app.post('/updateannouncement', (request, response) => {
  let user = request.session.user;
  let accountType = request.session.accountType;
  let index = parseInt(request.body.announcementID);

  var announcementTitle = request.body.announcementTitle;
  var announcementMessage = request.body.announcementMessage;

  if(request.body.announcementPic) {
    var image = fs.readFileSync(path.resolve(__dirname, "../TEAMPALAK/upload/" + request.body.announcementPic));
    var filetype = path.extname(request.body.announcementPic);

    if(filetype == '.jpg' || filetype == '.png' || filetype == '.jpeg') {
      con.query('UPDATE announcements SET announcementTitle = ?, announcementMessage = ?, announcementPic = ? WHERE announcementID = ?', [announcementTitle, announcementMessage, image, index], function(err, rows, fields) {
        response.redirect('/announcements');
      });
    } else {
      response.send("<script type='text/javascript'>alert('Invalid image.'); window.location.replace(\"/announcements\");</script>");
    }
  } else {
    con.query('UPDATE announcements SET announcementTitle = ?, announcementMessage = ? WHERE announcementID = ?', [announcementTitle, announcementMessage, index], function(err, rows, fields) {
      response.redirect('/announcements');
    });
  }
});

//REMOVES ANNOUNCEMENT PICTURE
app.post('/removeapicture', (request, response) => {
  let user = request.session.user;
  let accountType = request.session.accountType;
  let index = parseInt(request.body.announcementID);

  con.query('UPDATE announcements SET announcementPic = ? WHERE announcementID = ?', ["", index], function(err, rows, fields) {
    response.redirect('/announcements');
  });
});

//REMOVES ANNOUNCEMENT
app.post('/removeannouncement', (request, response) => {
  let user = request.session.user;
  let accountType = request.session.accountType;
  let index = parseInt(request.body.announcementID);

  con.query('DELETE FROM announcements WHERE announcementID = ?', index, function(err, rows, fields) {
    response.redirect('/announcements');
  });
});

//DISPLAYS PROFILE PAGE
app.get('/profile', (request, response) => {
  let user = request.session.user;
  let accountType = request.session.accountType;
  
  if(user && accountType == 'Admin') {
    con.query('SELECT Username, Firstname, Lastname, Email, AccountType FROM accounts WHERE AccountType = "Admin" AND Username = ?', user, function(err, rows, fields) {
      response.render('profile', {
        user: request.session.user,
        accountType: request.session.accountType,
        data: rows,
        edit: parseInt(0)
      });
    });
  } else {
    response.redirect('/');
  }
});

//DESTROYS SESSION, LOGS USER OUT, AND DISPLAYS HOME PAGE
app.get('/logout', (request, response) => {
  let user = request.session.user;
  let accountType = request.session.accountType;

  if(user && accountType == 'Admin') {
    request.session.destroy();
    response.send("<script type='text/javascript'>alert('Successfully logged out.'); window.location.replace(\"/\");</script>");
  } else {
    response.redirect('/');
  }
});


//Display change key page
app.get('/changeKey', (request, response) => {
  let user = request.session.user;
  let accountType = request.session.accountType;

  if(user && accountType == 'Admin') {
    con.query('SELECT Username, Firstname, Lastname, Email, AccountType FROM accounts WHERE AccountType = "Admin" AND Username = ?', user, function(err, row, fields) {
      con.query('SELECT * FROM api_key where apiId = (Select max(apiId) from api_key)', function(err, rows, fields) {
        response.render('changeKey', {
          user: request.session.user,
          accountType: request.session.accountType,
          data: rows
        });
      });
    });
  } else {
    response.redirect('/');
  }
});

//Display change key page
app.post('/updateChangeKey', (request, response) => {
  let user = request.session.user;
  let accountType = request.session.accountType;
  var api_key = request.body.api_key;
  con.query('INSERT INTO api_key (api_key) VALUES (?)', [api_key], function(err, rows, fields) {
    response.send("<script type='text/javascript'>alert('Successfully updated.'); window.location.replace(\"/changeKey\");</script>");
  });
});

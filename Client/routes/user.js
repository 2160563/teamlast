var array;
//==========================| LOGIN |=============================
exports.login = function(req, res) {
    var message = '';
    req.session.message = "";
    if(req.method == "POST"){
        if (req.body.user) {
            db.query('SELECT * FROM teampalak.accounts a WHERE a.username = ?', [req.body.user], function(err, rows, fields) {
				//console.log(rows);
                if (rows.length > 0) {
                    db.query('SELECT * FROM teampalak.accounts a WHERE a.username = ?', [req.body.user], function(err, rows, fields) {
                        if (bcrypt.compareSync(req.body.password, rows[0].Password)) {
                            req.session.user = req.body.user;
                            req.session.userID = rows[0].AccID;
                            //console.log(req.session.userID);
                            res.redirect('/client');
                        } else {
                            var message = 'Incorrect username/password.';
                            //console.log(message);
                            res.render('login.ejs', {message: message});
                        }
                    });
                } else {
                    var message = 'No account registered.';
                    res.render('login.ejs', {message: message});
                }
            });
        }
    }
};

//==========================| HOME |=============================
exports.home = function(req, res, next) {

	var user = req.session.user,
		userId = req.session.userID;
		req.session.message = "";
	var payload = {
		from: 'TEAMPALAK',
		to: '+639175749214',
		number: '+639176780038',
		message: 'SAMPLE',
		user:'jdmallari@weavetech.com.ph',
		account_id :4756,
		account: 'Weavetech Networks Inc'
	};
	sms.sendsms(payload, function(error, result) {
	if (!error) {
		//console.log("result"+result);
	} else{
				//console.log("error"+error);
	}
	}); 
			var sql = "SELECT * FROM tournament_details td INNER JOIN (SELECT * FROM tournaments) t  ON t.TournamentID = td.TournamentID LEFT JOIN (SELECT COUNT(registeredteamID) AS registeredteams, SUM(Seed) AS seed, tournament_details.TournamentID FROM tournament_details LEFT JOIN registered_teams ON tournament_details.TournamentID = registered_teams.TournamentID WHERE Status = \"Approved\" GROUP BY TournamentID) rt ON td.TournamentID = rt.TournamentID WHERE t.Status = 'Open' order by TSched desc";
			db.query(sql, function(err, result){
				//console.log(result);
				//console.log("Register Team result 0");
				var sql1 = "SELECT * FROM tournament_details td INNER JOIN (SELECT * FROM tournaments) t  ON t.TournamentID = td.TournamentID LEFT JOIN (SELECT COUNT(registeredteamID) AS registeredteams, SUM(Seed) AS seed, tournament_details.TournamentID FROM tournament_details LEFT JOIN registered_teams ON tournament_details.TournamentID = registered_teams.TournamentID WHERE Status = \"Approved\" GROUP BY TournamentID) rt ON td.TournamentID = rt.TournamentID where TournamentGame like \'lol%\' AND t.Status = 'Open' order by TSched desc";
				db.query(sql1, function(err, result1){
					//console.log("Register Team result 1");
					var sql2 = "SELECT * FROM tournament_details td INNER JOIN (SELECT * FROM tournaments) t  ON t.TournamentID = td.TournamentID LEFT JOIN (SELECT COUNT(registeredteamID) AS registeredteams, SUM(Seed) AS seed, tournament_details.TournamentID FROM tournament_details LEFT JOIN registered_teams ON tournament_details.TournamentID = registered_teams.TournamentID WHERE Status = \"Approved\" GROUP BY TournamentID) rt ON td.TournamentID = rt.TournamentID where TournamentGame like \'dota%\' AND t.Status = 'Open' order by TSched desc";
					db.query(sql2, function(err, result2){
						//console.log("Register Team result result 2");
						var sql3 = "SELECT * FROM tournament_details td INNER JOIN (SELECT * FROM tournaments) t  ON t.TournamentID = td.TournamentID LEFT JOIN (SELECT COUNT(registeredteamID) AS registeredteams, SUM(Seed) AS seed, tournament_details.TournamentID FROM tournament_details LEFT JOIN registered_teams ON tournament_details.TournamentID = registered_teams.TournamentID WHERE Status = \"Approved\" GROUP BY TournamentID) rt ON td.TournamentID = rt.TournamentID where TournamentGame like \'cs%\' AND t.Status = 'Open' order by TSched desc";
				    db.query(sql3, function(err, result3){
				        //console.log("HOME result2");
						var sql4 = "SELECT tournaments.TournamentID as tournaID, teampalak.TournamentGame, count(*) as Numbers FROM teampalak.registered_teams inner join teampalak.tournaments on teampalak.registered_teams.TournamentID = tournaments.TournamentID GROUP BY tournaments.TournamentID WHERE TournamentGame like \'lol%\' AND t.Status = 'Open'";
					    db.query(sql4, function(err, result4){
					        //console.log("HOME result3");
							var sql5 = "SELECT tournaments.TournamentID as tournaID, teampalak.TournamentGame, count(*) as Numbers FROM teampalak.registered_teams inner join teampalak.tournaments on teampalak.registered_teams.TournamentID = tournaments.TournamentID GROUP BY tournaments.TournamentID WHERE TournamentGame like \'dota%\' AND t.Status = 'Open'";
						    db.query(sql5, function(err, result5){
						        //console.log("HOME result4");
								var sql6 = "SELECT tournaments.TournamentID as tournaID, teampalak.TournamentGame, count(*) as Numbers FROM teampalak.registered_teams inner join teampalak.tournaments on teampalak.registered_teams.TournamentID = tournaments.TournamentID GROUP BY tournaments.TournamentID WHERE TournamentGame like \'cs%\' AND t.Status = 'Open'";
							    db.query(sql6, function(err, result6){
							        //console.log("HOME result5");
									var sql7 = "SELECT tournaments.TournamentID as tournaID, teampalak.TournamentGame, count(*) as Numbers FROM teampalak.registered_teams inner join teampalak.tournaments on teampalak.registered_teams.TournamentID = tournaments.TournamentID GROUP BY tournaments.TournamentID";
								    db.query(sql7, function(err, result7){
								        //console.log("HOME result6");
								        var sql8 = "SELECT * FROM teampalak.announcements order by announcementDate desc";
									    db.query(sql8, function(err, result8){
									        //console.log("HOME result7");
									            res.render('home.ejs', {data:result,data1:result1,data2:result2,data3:result3, user: userId, message:req.session.message, lol:result4, dota:result5, cs:result5, all:result7, announcements:result8});
									            req.session.message = "";
									    })
								    })
							    })
						    })
					    })
				    })
			    })
		        })
	    });
};


//==========================| Clinet home |=============================
exports.client = function(req, res, next) {

	var user = req.session.user,
		userId = req.session.userID;
		req.session.message = "";
	var payload = {
		from: 'TEAMPALAK',
		to: '+639175749214',
		number: '+639176780038',
		message: 'SAMPLE',
		user:'jdmallari@weavetech.com.ph',
		account_id :4756,
		account: 'Weavetech Networks Inc'
	};
	if (user == null) {
		res.redirect("/login");
		return;
	}else{
		sms.sendsms(payload, function(error, result) {
		if (!error) {
			//console.log("result"+result);
		} else{
			//console.log("error"+error);
		}

		}); 
			var sql = "SELECT * FROM tournament_details td INNER JOIN (SELECT * FROM tournaments) t  ON t.TournamentID = td.TournamentID LEFT JOIN (SELECT COUNT(registeredteamID) AS registeredteams, SUM(Seed) AS seed, tournament_details.TournamentID FROM tournament_details LEFT JOIN registered_teams ON tournament_details.TournamentID = registered_teams.TournamentID WHERE Status = \"Approved\" GROUP BY TournamentID) rt ON td.TournamentID = rt.TournamentID WHERE t.Status = 'Open' order by TSched desc";
			db.query(sql, function(err, result){
				//console.log(result);
				//console.log("Register Team result 0");
				var sql1 = "SELECT * FROM tournament_details td INNER JOIN (SELECT * FROM tournaments) t  ON t.TournamentID = td.TournamentID LEFT JOIN (SELECT COUNT(registeredteamID) AS registeredteams, SUM(Seed) AS seed, tournament_details.TournamentID FROM tournament_details LEFT JOIN registered_teams ON tournament_details.TournamentID = registered_teams.TournamentID WHERE Status = \"Approved\" GROUP BY TournamentID) rt ON td.TournamentID = rt.TournamentID where TournamentGame like \'lol%\' AND t.Status = 'Open' order by TSched desc";
				db.query(sql1, function(err, result1){
					//console.log("Register Team result 1");
					var sql2 = "SELECT * FROM tournament_details td INNER JOIN (SELECT * FROM tournaments) t  ON t.TournamentID = td.TournamentID LEFT JOIN (SELECT COUNT(registeredteamID) AS registeredteams, SUM(Seed) AS seed, tournament_details.TournamentID FROM tournament_details LEFT JOIN registered_teams ON tournament_details.TournamentID = registered_teams.TournamentID WHERE Status = \"Approved\" GROUP BY TournamentID) rt ON td.TournamentID = rt.TournamentID where TournamentGame like \'dota%\' AND t.Status = 'Open' order by TSched desc";
					db.query(sql2, function(err, result2){
						//console.log("Register Team result result 2");
						var sql3 = "SELECT * FROM tournament_details td INNER JOIN (SELECT * FROM tournaments) t  ON t.TournamentID = td.TournamentID LEFT JOIN (SELECT COUNT(registeredteamID) AS registeredteams, SUM(Seed) AS seed, tournament_details.TournamentID FROM tournament_details LEFT JOIN registered_teams ON tournament_details.TournamentID = registered_teams.TournamentID WHERE Status = \"Approved\" GROUP BY TournamentID) rt ON td.TournamentID = rt.TournamentID where TournamentGame like \'cs%\' AND t.Status = 'Open' order by TSched desc";
						db.query(sql3, function(err, result3){
							//console.log("Clinet home result 2");
							var sql4 = "SELECT tournaments.TournamentID as tournaID, TournamentGame, count(*) as Numbers FROM teampalak.registered_teams inner join teampalak.tournaments on teampalak.registered_teams.TournamentID = tournaments.TournamentID GROUP BY tournaments.TournamentID having TournamentGame like \'lol%\'";
							db.query(sql4, function(err, result4){
								//console.log("Clinet home result 3");
								var sql5 = "SELECT tournaments.TournamentID as tournaID, TournamentGame, count(*) as Numbers FROM teampalak.registered_teams inner join teampalak.tournaments on teampalak.registered_teams.TournamentID = tournaments.TournamentID GROUP BY tournaments.TournamentID having TournamentGame like \'dota%\'";
								db.query(sql5, function(err, result5){
									//console.log("Clinet home result 4");
									var sql6 = "SELECT tournaments.TournamentID as tournaID, TournamentGame, count(*) as Numbers FROM teampalak.registered_teams inner join teampalak.tournaments on teampalak.registered_teams.TournamentID = tournaments.TournamentID GROUP BY tournaments.TournamentID having TournamentGame like \'cs%\'";
									db.query(sql6, function(err, result6){
										//console.log("Clinet home result 5");
										var sql7 = "SELECT tournaments.TournamentID as tournaID, TournamentGame, count(*) as Numbers FROM teampalak.registered_teams inner join teampalak.tournaments on teampalak.registered_teams.TournamentID = tournaments.TournamentID GROUP BY tournaments.TournamentID";
										db.query(sql7, function(err, result7){
											//console.log("Clinet home result 6");
											var sql8 = "SELECT * FROM teampalak.announcements order by announcementDate desc";
											db.query(sql8, function(err, result8){
												var sql9 = "select message from teampalak.notifications where status = 'unchecked' AND accID = ?";
												db.query(sql9,userId, function(err, result9){
													var sql10 = "select message, status from teampalak.notifications where accID = ?";
													db.query(sql10,userId, function(err, result10){
														var sql11 = "UPDATE notifications SET status='Checked' WHERE accID = ?";
														db.query(sql11,userId, function(err, result11){
															res.render('client.ejs', {
																data:result,
																data1:result1,
																data2:result2,
																data3:result3, 
																user: userId, 
																message:req.session.message, 
																lol:result4, 
																dota:result5, 
																cs:result5, 
																all:result7, 
																announcements:result8,
																num:result9,
																notif:result10});
															req.session.message = "";
														});
													})
												})
											})
										})
									})
								})
							})
						})
					})
					})
			});
		}
};
//==========================| Tournaments |=============================
exports.tournaments = function(req, res, next) {
		//console.log("a");
			var user = req.session.user,
				userId = req.session.userId;
			//console.log("b");
			var dasa = req.body.dasa;
			var message = "";
			req.session.message = "";
		if(req.query.sort=="lowtohigh"){

			if(req.session.message === undefined)
				req.session.message = "";
				var sql = "SELECT td.tdetID, td.TournamentID, td.TournaRange, td.TSched, td.Max_participants, td.registration_fee, td.Tpic, td.1stPrize as first, td.2ndPrize as second, td.TVenue, t.TournamentName, t.TournamentGame, t.tournaLB, t.tournaUB, rt.registeredteams, t.Status FROM tournament_details td INNER JOIN (SELECT * FROM tournaments) t ON t.TournamentID = td.TournamentID LEFT JOIN (SELECT COUNT(registeredteamID) AS registeredteams, SUM(Seed) AS seed, tournament_details.TournamentID FROM tournament_details LEFT JOIN registered_teams ON tournament_details.TournamentID = registered_teams.TournamentID WHERE Status = \"Approved\" GROUP BY TournamentID) rt ON td.TournamentID = rt.TournamentID WHERE t.Status = 'Open' order by registration_fee";
				db.query(sql, function(err, result){
					//console.log("Login Tournaments Team result 0");
					//console.log(result);
					var sql1 = "SELECT td.tdetID, td.TournamentID, td.TournaRange, td.TSched, td.Max_participants, td.registration_fee, td.Tpic, td.1stPrize as first, td.2ndPrize as second, td.TVenue, t.TournamentName, t.TournamentGame, t.tournaLB, t.tournaUB, rt.registeredteams, t.Status FROM tournament_details td INNER JOIN (SELECT * FROM tournaments) t ON t.TournamentID = td.TournamentID LEFT JOIN (SELECT COUNT(registeredteamID) AS registeredteams, SUM(Seed) AS seed, tournament_details.TournamentID FROM tournament_details LEFT JOIN registered_teams ON tournament_details.TournamentID = registered_teams.TournamentID WHERE Status = \"Approved\" GROUP BY TournamentID) rt ON td.TournamentID = rt.TournamentID WHERE t.Status = 'Open' order by registration_fee";
					db.query(sql1, function(err, result1){
						//console.log("Login Tournaments Team result 1");
						var sql2 = "SELECT td.tdetID, td.TournamentID, td.TournaRange, td.TSched, td.Max_participants, td.registration_fee, td.Tpic, td.1stPrize as first, td.2ndPrize as second, td.TVenue, t.TournamentName, t.TournamentGame, t.tournaLB, t.tournaUB, rt.registeredteams, t.Status FROM tournament_details td INNER JOIN (SELECT * FROM tournaments) t ON t.TournamentID = td.TournamentID LEFT JOIN (SELECT COUNT(registeredteamID) AS registeredteams, SUM(Seed) AS seed, tournament_details.TournamentID FROM tournament_details LEFT JOIN registered_teams ON tournament_details.TournamentID = registered_teams.TournamentID WHERE Status = \"Approved\" GROUP BY TournamentID) rt ON td.TournamentID = rt.TournamentID where TournamentGame like \'dota%\' AND t.Status = 'Open' order by registration_fee";
						db.query(sql2, function(err, result2){
							//console.log("Login Tournaments Team result 2");
								var sql4 = "SELECT td.tdetID, td.TournamentID, td.TournaRange, td.TSched, td.Max_participants, td.registration_fee, td.Tpic, td.1stPrize as first, td.2ndPrize as second, td.TVenue, t.TournamentName, t.TournamentGame, t.tournaLB, t.tournaUB, rt.registeredteams, t.Status FROM tournament_details td INNER JOIN (SELECT * FROM tournaments) t ON t.TournamentID = td.TournamentID LEFT JOIN (SELECT COUNT(registeredteamID) AS registeredteams, SUM(Seed) AS seed, tournament_details.TournamentID FROM tournament_details LEFT JOIN registered_teams ON tournament_details.TournamentID = registered_teams.TournamentID WHERE Status = \"Approved\" GROUP BY TournamentID) rt ON td.TournamentID = rt.TournamentID where TournamentGame like \'lol%\' AND t.Status = 'Open' order by registration_fee";
								db.query(sql4, function(err, result4){
									//console.log("Login Tournaments Team result 4");
									var sql5 = "SELECT td.tdetID, td.TournamentID, td.TournaRange, td.TSched, td.Max_participants, td.registration_fee, td.Tpic, td.1stPrize as first, td.2ndPrize as second, td.TVenue, t.TournamentName, t.TournamentGame, t.tournaLB, t.tournaUB, rt.registeredteams, t.Status FROM tournament_details td INNER JOIN (SELECT * FROM tournaments) t ON t.TournamentID = td.TournamentID LEFT JOIN (SELECT COUNT(registeredteamID) AS registeredteams, SUM(Seed) AS seed, tournament_details.TournamentID FROM tournament_details LEFT JOIN registered_teams ON tournament_details.TournamentID = registered_teams.TournamentID WHERE Status = \"Approved\" GROUP BY TournamentID) rt ON td.TournamentID = rt.TournamentID where TournamentGame like \'cs%\' AND t.Status = 'Open' order by registration_fee";
									db.query(sql5, function(err, result5){
										//console.log("Login Tournaments Team result 5");
										
											var sql7 = "SELECT tournaments.TournamentID as tournaID, TournamentGame, count(*) as Numbers FROM teampalak.registered_teams inner join teampalak.tournaments on teampalak.registered_teams.TournamentID = tournaments.TournamentID GROUP BY tournaments.TournamentID";
											db.query(sql7, function(err, result7){
												//console.log("Login Tournaments Team result 7");
													res.render('tournaments.ejs',{data:result,data1:result1,data2:result2, user: userId, message:message, lol:result4, dota:result5,  all:result7});
													req.session.message = "";
											})
										
									})
								})
							
						})
						})
				});
		} else if(req.query.sort=="hightolow") {
			
			if(req.session.message === undefined)
				req.session.message = "";
				var sql = "SELECT td.tdetID, td.TournamentID, td.TournaRange, td.TSched, td.Max_participants, td.registration_fee, td.Tpic,td.1stPrize as first, td.2ndPrize as second, td.TVenue, t.TournamentName, t.TournamentGame, t.tournaLB, t.tournaUB, rt.registeredteams, t.Status FROM tournament_details td INNER JOIN (SELECT * FROM tournaments) t ON t.TournamentID = td.TournamentID LEFT JOIN (SELECT COUNT(registeredteamID) AS registeredteams, SUM(Seed) AS seed, tournament_details.TournamentID FROM tournament_details LEFT JOIN registered_teams ON tournament_details.TournamentID = registered_teams.TournamentID WHERE Status = \"Approved\" GROUP BY TournamentID) rt ON td.TournamentID = rt.TournamentID WHERE t.Status = 'Open' order by registration_fee desc";
				db.query(sql, function(err, result){
					//console.log("Login Tournaments Team result 0");
					//console.log(result);
					var sql1 = "SELECT td.tdetID, td.TournamentID, td.TournaRange, td.TSched, td.Max_participants, td.registration_fee, td.Tpic, td.1stPrize as first, td.2ndPrize as second, td.TVenue, t.TournamentName, t.TournamentGame, t.tournaLB, t.tournaUB, rt.registeredteams, t.Status FROM tournament_details td INNER JOIN (SELECT * FROM tournaments) t ON t.TournamentID = td.TournamentID LEFT JOIN (SELECT COUNT(registeredteamID) AS registeredteams, SUM(Seed) AS seed, tournament_details.TournamentID FROM tournament_details LEFT JOIN registered_teams ON tournament_details.TournamentID = registered_teams.TournamentID WHERE Status = \"Approved\" GROUP BY TournamentID) rt ON td.TournamentID = rt.TournamentID WHERE t.Status = 'Open' order by registration_fee desc";
					db.query(sql1, function(err, result1){
						//console.log("Login Tournaments Team result 1");
						var sql2 = "SELECT td.tdetID, td.TournamentID, td.TournaRange, td.TSched, td.Max_participants, td.registration_fee, td.Tpic, td.1stPrize as first, td.2ndPrize as second, td.TVenue, t.TournamentName, t.TournamentGame, t.tournaLB, t.tournaUB, rt.registeredteams, t.Status FROM tournament_details td INNER JOIN (SELECT * FROM tournaments) t ON t.TournamentID = td.TournamentID LEFT JOIN (SELECT COUNT(registeredteamID) AS registeredteams, SUM(Seed) AS seed, tournament_details.TournamentID FROM tournament_details LEFT JOIN registered_teams ON tournament_details.TournamentID = registered_teams.TournamentID WHERE Status = \"Approved\" GROUP BY TournamentID) rt ON td.TournamentID = rt.TournamentID where TournamentGame like \'dota%\' AND t.Status = 'Open' order by registration_fee desc";
						db.query(sql2, function(err, result2){
							//console.log("Login Tournaments Team result 2");
								var sql4 = "SELECT td.tdetID, td.TournamentID, td.TournaRange, td.TSched, td.Max_participants, td.registration_fee, td.Tpic, td.1stPrize as first, td.2ndPrize as second, td.TVenue, t.TournamentName, t.TournamentGame, t.tournaLB, t.tournaUB, rt.registeredteams, t.Status FROM tournament_details td INNER JOIN (SELECT * FROM tournaments) t ON t.TournamentID = td.TournamentID LEFT JOIN (SELECT COUNT(registeredteamID) AS registeredteams, SUM(Seed) AS seed, tournament_details.TournamentID FROM tournament_details LEFT JOIN registered_teams ON tournament_details.TournamentID = registered_teams.TournamentID WHERE Status = \"Approved\" GROUP BY TournamentID) rt ON td.TournamentID = rt.TournamentID where TournamentGame like \'lol%\' AND t.Status = 'Open' order by registration_fee desc";
								db.query(sql4, function(err, result4){
									//console.log("Login Tournaments Team result 4");
									var sql5 = "SELECT td.tdetID, td.TournamentID, td.TournaRange, td.TSched, td.Max_participants, td.registration_fee, td.Tpic, td.1stPrize as first, td.2ndPrize as second, t.TournamentName, t.TournamentGame, t.tournaLB, t.tournaUB, rt.registeredteams, t.Status FROM tournament_details td INNER JOIN (SELECT * FROM tournaments) t ON t.TournamentID = td.TournamentID LEFT JOIN (SELECT COUNT(registeredteamID) AS registeredteams, SUM(Seed) AS seed, tournament_details.TournamentID FROM tournament_details LEFT JOIN registered_teams ON tournament_details.TournamentID = registered_teams.TournamentID WHERE Status = \"Approved\" GROUP BY TournamentID) rt ON td.TournamentID = rt.TournamentID where TournamentGame like \'cs%\' AND t.Status = 'Open' order by registration_fee desc";
									db.query(sql5, function(err, result5){
										//console.log("Login Tournaments Team result 5");
										
											var sql7 = "SELECT tournaments.TournamentID as tournaID, TournamentGame, count(*) as Numbers FROM teampalak.registered_teams inner join teampalak.tournaments on teampalak.registered_teams.TournamentID = tournaments.TournamentID GROUP BY tournaments.TournamentID";
											db.query(sql7, function(err, result7){
												//console.log("Login Tournaments Team result 7");
													res.render('tournaments.ejs',{data:result,data1:result1,data2:result2, user: userId, message:message, lol:result4, dota:result5,  all:result7});
													req.session.message = "";
											})
										
									})
								})
							
						})
						})
				});
		} else if(req.query.search) {
			if(req.session.message === undefined)
				req.session.message = "";
				var sql = "SELECT td.tdetID, td.TournamentID, td.TournaRange, td.TSched, td.Max_participants, td.registration_fee, td.Tpic, td.1stPrize as first, td.2ndPrize as second, td.TVenue, t.TournamentName, t.TournamentGame, t.tournaLB, t.tournaUB, rt.registeredteams, t.Status FROM tournament_details td INNER JOIN (SELECT * FROM tournaments) t ON t.TournamentID = td.TournamentID LEFT JOIN (SELECT COUNT(registeredteamID) AS registeredteams, SUM(Seed) AS seed, tournament_details.TournamentID FROM tournament_details LEFT JOIN registered_teams ON tournament_details.TournamentID = registered_teams.TournamentID WHERE Status = \"Approved\" GROUP BY TournamentID) rt ON td.TournamentID = rt.TournamentID WHERE t.Status = 'Open' and t.TournamentName like '%"+req.query.search+"%' order by TSched desc";
				db.query(sql, function(err, result){
					//console.log("Login Tournaments Team result 0");
					//console.log(result);
					var sql1 = "SELECT td.tdetID, td.TournamentID, td.TournaRange, td.TSched, td.Max_participants, td.registration_fee, td.Tpic, td.1stPrize as first, td.2ndPrize as second, td.TVenue, t.TournamentName, t.TournamentGame, t.tournaLB, t.tournaUB, rt.registeredteams, t.Status FROM tournament_details td INNER JOIN (SELECT * FROM tournaments) t ON t.TournamentID = td.TournamentID LEFT JOIN (SELECT COUNT(registeredteamID) AS registeredteams, SUM(Seed) AS seed, tournament_details.TournamentID FROM tournament_details LEFT JOIN registered_teams ON tournament_details.TournamentID = registered_teams.TournamentID WHERE Status = \"Approved\" GROUP BY TournamentID) rt ON td.TournamentID = rt.TournamentID WHERE t.Status = 'Open' and t.TournamentName like '%"+req.query.search+"%' order by TSched desc";
					db.query(sql1, function(err, result1){
						//console.log("Login Tournaments Team result 1");
						var sql2 = "SELECT td.tdetID, td.TournamentID, td.TournaRange, td.TSched, td.Max_participants, td.registration_fee, td.Tpic, td.1stPrize as first, td.2ndPrize as second, td.TVenue, t.TournamentName, t.TournamentGame, t.tournaLB, t.tournaUB, rt.registeredteams, t.Status FROM tournament_details td INNER JOIN (SELECT * FROM tournaments) t ON t.TournamentID = td.TournamentID LEFT JOIN (SELECT COUNT(registeredteamID) AS registeredteams, SUM(Seed) AS seed, tournament_details.TournamentID FROM tournament_details LEFT JOIN registered_teams ON tournament_details.TournamentID = registered_teams.TournamentID WHERE Status = \"Approved\" GROUP BY TournamentID) rt ON td.TournamentID = rt.TournamentID where TournamentGame like \'dota%\' AND t.Status = 'Open' and t.TournamentName like '%"+req.query.search+"%' order by TSched desc";
						db.query(sql2, function(err, result2){
							//console.log("Login Tournaments Team result 2");
								var sql4 = "SELECT td.tdetID, td.TournamentID, td.TournaRange, td.TSched, td.Max_participants, td.registration_fee, td.Tpic, td.1stPrize as first, td.2ndPrize as second, td.TVenue, t.TournamentName, t.TournamentGame, t.tournaLB, t.tournaUB, rt.registeredteams, t.Status FROM tournament_details td INNER JOIN (SELECT * FROM tournaments) t ON t.TournamentID = td.TournamentID LEFT JOIN (SELECT COUNT(registeredteamID) AS registeredteams, SUM(Seed) AS seed, tournament_details.TournamentID FROM tournament_details LEFT JOIN registered_teams ON tournament_details.TournamentID = registered_teams.TournamentID WHERE Status = \"Approved\" GROUP BY TournamentID) rt ON td.TournamentID = rt.TournamentID where TournamentGame like \'lol%\' AND t.Status = 'Open' and t.TournamentName like '%"+req.query.search+"%' order by TSched desc";
								db.query(sql4, function(err, result4){
									//console.log("Login Tournaments Team result 4");
									var sql5 = "SELECT td.tdetID, td.TournamentID, td.TournaRange, td.TSched, td.Max_participants, td.registration_fee, td.Tpic, td.1stPrize as first, td.2ndPrize as second, td.TVenue, t.TournamentName, t.TournamentGame, t.tournaLB, t.tournaUB, rt.registeredteams, t.Status FROM tournament_details td INNER JOIN (SELECT * FROM tournaments) t ON t.TournamentID = td.TournamentID LEFT JOIN (SELECT COUNT(registeredteamID) AS registeredteams, SUM(Seed) AS seed, tournament_details.TournamentID FROM tournament_details LEFT JOIN registered_teams ON tournament_details.TournamentID = registered_teams.TournamentID WHERE Status = \"Approved\" GROUP BY TournamentID) rt ON td.TournamentID = rt.TournamentID where TournamentGame like \'cs%\' AND t.Status = 'Open' and t.TournamentName like '%"+req.query.search+"%' order by TSched desc";
									db.query(sql5, function(err, result5){
										//console.log("Login Tournaments Team result 5");
										
											var sql7 = "SELECT tournaments.TournamentID as tournaID, TournamentGame, count(*) as Numbers FROM teampalak.registered_teams inner join teampalak.tournaments on teampalak.registered_teams.TournamentID = tournaments.TournamentID GROUP BY tournaments.TournamentID";
											db.query(sql7, function(err, result7){
												//console.log("Login Tournaments Team result 7");
													res.render('tournaments.ejs',{data:result,data1:result1,data2:result2, user: userId, message:message, lol:result4, dota:result5,  all:result7});
													req.session.message = "";
											})
										
									})
								})
							
						})
						})
				});
		} else {
			if(req.session.message === undefined)
				req.session.message = "";
				var sql = "SELECT td.tdetID, td.TournamentID, td.TournaRange, td.TSched, td.Max_participants, td.registration_fee, td.Tpic, td.1stPrize as first, td.2ndPrize as second, td.TVenue, t.TournamentName, t.TournamentGame, t.tournaLB, t.tournaUB, rt.registeredteams, t.Status FROM tournament_details td INNER JOIN (SELECT * FROM tournaments) t ON t.TournamentID = td.TournamentID LEFT JOIN (SELECT COUNT(registeredteamID) AS registeredteams, SUM(Seed) AS seed, tournament_details.TournamentID FROM tournament_details LEFT JOIN registered_teams ON tournament_details.TournamentID = registered_teams.TournamentID WHERE Status = \"Approved\" GROUP BY TournamentID) rt ON td.TournamentID = rt.TournamentID WHERE t.Status = 'Open' order by TSched desc";
				db.query(sql, function(err, result){
					//console.log("Login Tournaments Team result 0");
					//console.log(result);
					var sql1 = "SELECT td.tdetID, td.TournamentID, td.TournaRange, td.TSched, td.Max_participants, td.registration_fee, td.Tpic, td.1stPrize as first, td.2ndPrize as second, td.TVenue, t.TournamentName, t.TournamentGame, t.tournaLB, t.tournaUB, rt.registeredteams, t.Status FROM tournament_details td INNER JOIN (SELECT * FROM tournaments) t ON t.TournamentID = td.TournamentID LEFT JOIN (SELECT COUNT(registeredteamID) AS registeredteams, SUM(Seed) AS seed, tournament_details.TournamentID FROM tournament_details LEFT JOIN registered_teams ON tournament_details.TournamentID = registered_teams.TournamentID WHERE Status = \"Approved\" GROUP BY TournamentID) rt ON td.TournamentID = rt.TournamentID WHERE t.Status = 'Open' order by TSched desc";
					db.query(sql1, function(err, result1){
						//console.log("Login Tournaments Team result 1");
						var sql2 = "SELECT td.tdetID, td.TournamentID, td.TournaRange, td.TSched, td.Max_participants, td.registration_fee, td.Tpic, td.1stPrize as first, td.2ndPrize as second, td.TVenue, t.TournamentName, t.TournamentGame, t.tournaLB, t.tournaUB, rt.registeredteams, t.Status FROM tournament_details td INNER JOIN (SELECT * FROM tournaments) t ON t.TournamentID = td.TournamentID LEFT JOIN (SELECT COUNT(registeredteamID) AS registeredteams, SUM(Seed) AS seed, tournament_details.TournamentID FROM tournament_details LEFT JOIN registered_teams ON tournament_details.TournamentID = registered_teams.TournamentID WHERE Status = \"Approved\" GROUP BY TournamentID) rt ON td.TournamentID = rt.TournamentID where TournamentGame like \'dota%\' AND t.Status = 'Open' order by TSched desc";
						db.query(sql2, function(err, result2){
							//console.log("Login Tournaments Team result 2");
								var sql4 = "SELECT td.tdetID, td.TournamentID, td.TournaRange, td.TSched, td.Max_participants, td.registration_fee, td.Tpic, td.1stPrize as first, td.2ndPrize as second, td.TVenue, t.TournamentName, t.TournamentGame, t.tournaLB, t.tournaUB, rt.registeredteams, t.Status FROM tournament_details td INNER JOIN (SELECT * FROM tournaments) t ON t.TournamentID = td.TournamentID LEFT JOIN (SELECT COUNT(registeredteamID) AS registeredteams, SUM(Seed) AS seed, tournament_details.TournamentID FROM tournament_details LEFT JOIN registered_teams ON tournament_details.TournamentID = registered_teams.TournamentID WHERE Status = \"Approved\" GROUP BY TournamentID) rt ON td.TournamentID = rt.TournamentID where TournamentGame like \'lol%\' AND t.Status = 'Open' order by TSched desc";
								db.query(sql4, function(err, result4){
									//console.log("Login Tournaments Team result 4");
									var sql5 = "SELECT td.tdetID, td.TournamentID, td.TournaRange, td.TSched, td.Max_participants, td.registration_fee, td.Tpic, td.1stPrize as first, td.2ndPrize as second, td.TVenue, t.TournamentName, t.TournamentGame, t.tournaLB, t.tournaUB, rt.registeredteams, t.Status FROM tournament_details td INNER JOIN (SELECT * FROM tournaments) t ON t.TournamentID = td.TournamentID LEFT JOIN (SELECT COUNT(registeredteamID) AS registeredteams, SUM(Seed) AS seed, tournament_details.TournamentID FROM tournament_details LEFT JOIN registered_teams ON tournament_details.TournamentID = registered_teams.TournamentID WHERE Status = \"Approved\" GROUP BY TournamentID) rt ON td.TournamentID = rt.TournamentID where TournamentGame like \'cs%\' AND t.Status = 'Open' order by TSched desc";
									db.query(sql5, function(err, result5){
										//console.log("Login Tournaments Team result 5");
										
											var sql7 = "SELECT tournaments.TournamentID as tournaID, TournamentGame, count(*) as Numbers FROM teampalak.registered_teams inner join teampalak.tournaments on teampalak.registered_teams.TournamentID = tournaments.TournamentID GROUP BY tournaments.TournamentID";
											db.query(sql7, function(err, result7){
												//console.log("Login Tournaments Team result 7");
													res.render('tournaments.ejs',{data:result,data1:result1,data2:result2, user: userId, message:message, lol:result4, dota:result5,  all:result7});
													req.session.message = "";
											})
										
									})
								})
							
						})
						})
				});
		}
		};
//==========================| History login|=============================
exports.history = function(req, res, next) {
	//console.log("a");
		var user = req.session.user,
			userId = req.session.userID;
		//console.log("b");
					if(req.session.message === undefined)
				req.session.message = "";
					var message = req.session.message;
			req.session.message = "";
		var dasa = req.body.dasa;
		if (user == null) {
		res.redirect("/history2");
		return;}
		if(req.query.sort=="lowtohigh"){

			if(req.session.message === undefined)
				req.session.message = "";
				var sql = "SELECT td.tdetID, td.TournamentID, td.TournaRange, td.TSched, td.Max_participants, td.registration_fee, td.Tpic, td.1stPrize as first, td.2ndPrize as second, td.TVenue, t.TournamentName, t.TournamentGame, t.tournaLB, t.tournaUB, rt.registeredteams, t.Status FROM tournament_details td INNER JOIN (SELECT * FROM tournaments) t ON t.TournamentID = td.TournamentID LEFT JOIN (SELECT COUNT(registeredteamID) AS registeredteams, SUM(Seed) AS seed, tournament_details.TournamentID FROM tournament_details LEFT JOIN registered_teams ON tournament_details.TournamentID = registered_teams.TournamentID WHERE Status = \"Approved\" GROUP BY TournamentID) rt ON td.TournamentID = rt.TournamentID WHERE t.Status = 'Closed' order by td.TSched";
				db.query(sql, function(err, result){
					//console.log("Login Tournaments Team result 0");
					//console.log(result);
					var sql1 = "SELECT td.tdetID, td.TournamentID, td.TournaRange, td.TSched, td.Max_participants, td.registration_fee, td.Tpic, td.1stPrize as first, td.2ndPrize as second, td.TVenue, t.TournamentName, t.TournamentGame, t.tournaLB, t.tournaUB, rt.registeredteams, t.Status FROM tournament_details td INNER JOIN (SELECT * FROM tournaments) t ON t.TournamentID = td.TournamentID LEFT JOIN (SELECT COUNT(registeredteamID) AS registeredteams, SUM(Seed) AS seed, tournament_details.TournamentID FROM tournament_details LEFT JOIN registered_teams ON tournament_details.TournamentID = registered_teams.TournamentID WHERE Status = \"Approved\" GROUP BY TournamentID) rt ON td.TournamentID = rt.TournamentID WHERE t.Status = 'Closed' order by td.TSched";
					db.query(sql1, function(err, result1){
						//console.log("Login Tournaments Team result 1");
						var sql2 = "SELECT td.tdetID, td.TournamentID, td.TournaRange, td.TSched, td.Max_participants, td.registration_fee, td.Tpic, td.1stPrize as first, td.2ndPrize as second, td.TVenue, t.TournamentName, t.TournamentGame, t.tournaLB, t.tournaUB, rt.registeredteams, t.Status FROM tournament_details td INNER JOIN (SELECT * FROM tournaments) t ON t.TournamentID = td.TournamentID LEFT JOIN (SELECT COUNT(registeredteamID) AS registeredteams, SUM(Seed) AS seed, tournament_details.TournamentID FROM tournament_details LEFT JOIN registered_teams ON tournament_details.TournamentID = registered_teams.TournamentID WHERE Status = \"Approved\" GROUP BY TournamentID) rt ON td.TournamentID = rt.TournamentID where TournamentGame like \'dota%\' AND t.Status = 'Closed' order by td.TSched";
						db.query(sql2, function(err, result2){
							//console.log("Login Tournaments Team result 2");
								var sql4 = "SELECT td.tdetID, td.TournamentID, td.TournaRange, td.TSched, td.Max_participants, td.registration_fee, td.Tpic, td.1stPrize as first, td.2ndPrize as second, td.TVenue, t.TournamentName, t.TournamentGame, t.tournaLB, t.tournaUB, rt.registeredteams, t.Status FROM tournament_details td INNER JOIN (SELECT * FROM tournaments) t ON t.TournamentID = td.TournamentID LEFT JOIN (SELECT COUNT(registeredteamID) AS registeredteams, SUM(Seed) AS seed, tournament_details.TournamentID FROM tournament_details LEFT JOIN registered_teams ON tournament_details.TournamentID = registered_teams.TournamentID WHERE Status = \"Approved\" GROUP BY TournamentID) rt ON td.TournamentID = rt.TournamentID where TournamentGame like \'lol%\' AND t.Status = 'Closed' order by td.TSched";
								db.query(sql4, function(err, result4){
									//console.log("Login Tournaments Team result 4");
									var sql5 = "SELECT td.tdetID, td.TournamentID, td.TournaRange, td.TSched, td.Max_participants, td.registration_fee, td.Tpic, td.1stPrize as first, td.2ndPrize as second, td.TVenue, t.TournamentName, t.TournamentGame, t.tournaLB, t.tournaUB, rt.registeredteams, t.Status FROM tournament_details td INNER JOIN (SELECT * FROM tournaments) t ON t.TournamentID = td.TournamentID LEFT JOIN (SELECT COUNT(registeredteamID) AS registeredteams, SUM(Seed) AS seed, tournament_details.TournamentID FROM tournament_details LEFT JOIN registered_teams ON tournament_details.TournamentID = registered_teams.TournamentID WHERE Status = \"Approved\" GROUP BY TournamentID) rt ON td.TournamentID = rt.TournamentID where TournamentGame like \'cs%\' AND t.Status = 'Closed' order by td.TSched";
									db.query(sql5, function(err, result5){
										//console.log("Login Tournaments Team result 5");
										
											var sql7 = "SELECT tournaments.TournamentID as tournaID, TournamentGame, count(*) as Numbers FROM teampalak.registered_teams inner join teampalak.tournaments on teampalak.registered_teams.TournamentID = tournaments.TournamentID GROUP BY tournaments.TournamentID";
											db.query(sql7, function(err, result7){
                                                var sql8 = "SELECT game.GameID, game.tournamentID, game.Rounds, game.Team1ID, teama.TeamName AS Team1Name, game.Winner, game.Team2ID, teamb.TeamName AS Team2Name FROM game as game INNER JOIN teams as teama on teama.TeamID = game.Team1ID INNER JOIN teams as teamb on teamb.TeamID = game.Team2ID";
                                                db.query(sql8, function(err, result8){
                                                	var sql9 = "select message from teampalak.notifications where status = 'unchecked' AND accID = ?";
												db.query(sql9,userId, function(err, result9){
													var sql10 = "select message, status from teampalak.notifications where accID = ?";
													db.query(sql10,userId, function(err, result10){
														var sql11 = "UPDATE notifications SET status='Checked' WHERE accID = ?";
														db.query(sql11,userId, function(err, result11){
                                                    //console.log("Login Tournaments Team result 7");
                                                        res.render('history.ejs',{data:result,data1:result1,data2:result2, user: userId, message:message, lol:result4, dota:result5,  all:result7, data4:result8,num:result9,
																notif:result10});
                                                		})
													})
												})
												})
											})
										
									})
								})
							
						})
						})
				});
		} else if(req.query.sort=="hightolow") {
			
			if(req.session.message === undefined)
				req.session.message = "";
				var sql = "SELECT td.tdetID, td.TournamentID, td.TournaRange, td.TSched, td.Max_participants, td.registration_fee, td.Tpic, td.1stPrize as first, td.2ndPrize as second, td.TVenue, t.TournamentName, t.TournamentGame, t.tournaLB, t.tournaUB, rt.registeredteams, t.Status FROM tournament_details td INNER JOIN (SELECT * FROM tournaments) t ON t.TournamentID = td.TournamentID LEFT JOIN (SELECT COUNT(registeredteamID) AS registeredteams, SUM(Seed) AS seed, tournament_details.TournamentID FROM tournament_details LEFT JOIN registered_teams ON tournament_details.TournamentID = registered_teams.TournamentID WHERE Status = \"Approved\" GROUP BY TournamentID) rt ON td.TournamentID = rt.TournamentID WHERE t.Status = 'Closed' order by td.TSched desc";
				db.query(sql, function(err, result){
					//console.log("Login Tournaments Team result 0");
					//console.log(result);
					var sql1 = "SELECT td.tdetID, td.TournamentID, td.TournaRange, td.TSched, td.Max_participants, td.registration_fee, td.Tpic, td.1stPrize as first, td.2ndPrize as second, td.TVenue, t.TournamentName, t.TournamentGame, t.tournaLB, t.tournaUB, rt.registeredteams, t.Status FROM tournament_details td INNER JOIN (SELECT * FROM tournaments) t ON t.TournamentID = td.TournamentID LEFT JOIN (SELECT COUNT(registeredteamID) AS registeredteams, SUM(Seed) AS seed, tournament_details.TournamentID FROM tournament_details LEFT JOIN registered_teams ON tournament_details.TournamentID = registered_teams.TournamentID WHERE Status = \"Approved\" GROUP BY TournamentID) rt ON td.TournamentID = rt.TournamentID WHERE t.Status = 'Closed' order by td.TSched desc";
					db.query(sql1, function(err, result1){
						//console.log("Login Tournaments Team result 1");
						var sql2 = "SELECT td.tdetID, td.TournamentID, td.TournaRange, td.TSched, td.Max_participants, td.registration_fee, td.Tpic, td.1stPrize as first, td.2ndPrize as second, td.TVenue, t.TournamentName, t.TournamentGame, t.tournaLB, t.tournaUB, rt.registeredteams, t.Status FROM tournament_details td INNER JOIN (SELECT * FROM tournaments) t ON t.TournamentID = td.TournamentID LEFT JOIN (SELECT COUNT(registeredteamID) AS registeredteams, SUM(Seed) AS seed, tournament_details.TournamentID FROM tournament_details LEFT JOIN registered_teams ON tournament_details.TournamentID = registered_teams.TournamentID WHERE Status = \"Approved\" GROUP BY TournamentID) rt ON td.TournamentID = rt.TournamentID where TournamentGame like \'dota%\' AND t.Status = 'Closed' order by td.TSched desc";
						db.query(sql2, function(err, result2){
							//console.log("Login Tournaments Team result 2");
								var sql4 = "SELECT td.tdetID, td.TournamentID, td.TournaRange, td.TSched, td.Max_participants, td.registration_fee, td.Tpic, td.1stPrize as first, td.2ndPrize as second, td.TVenue, t.TournamentName, t.TournamentGame, t.tournaLB, t.tournaUB, rt.registeredteams, t.Status FROM tournament_details td INNER JOIN (SELECT * FROM tournaments) t ON t.TournamentID = td.TournamentID LEFT JOIN (SELECT COUNT(registeredteamID) AS registeredteams, SUM(Seed) AS seed, tournament_details.TournamentID FROM tournament_details LEFT JOIN registered_teams ON tournament_details.TournamentID = registered_teams.TournamentID WHERE Status = \"Approved\" GROUP BY TournamentID) rt ON td.TournamentID = rt.TournamentID where TournamentGame like \'lol%\' AND t.Status = 'Closed' order by td.TSched desc";
								db.query(sql4, function(err, result4){
									//console.log("Login Tournaments Team result 4");
									var sql5 = "SELECT td.tdetID, td.TournamentID, td.TournaRange, td.TSched, td.Max_participants, td.registration_fee, td.Tpic, td.1stPrize as first, td.2ndPrize as second, td.TVenue, t.TournamentName, t.TournamentGame, t.tournaLB, t.tournaUB, rt.registeredteams, t.Status FROM tournament_details td INNER JOIN (SELECT * FROM tournaments) t ON t.TournamentID = td.TournamentID LEFT JOIN (SELECT COUNT(registeredteamID) AS registeredteams, SUM(Seed) AS seed, tournament_details.TournamentID FROM tournament_details LEFT JOIN registered_teams ON tournament_details.TournamentID = registered_teams.TournamentID WHERE Status = \"Approved\" GROUP BY TournamentID) rt ON td.TournamentID = rt.TournamentID where TournamentGame like \'cs%\' AND t.Status = 'Closed' order by td.TSched desc";
									db.query(sql5, function(err, result5){
										//console.log("Login Tournaments Team result 5");
										
											var sql7 = "SELECT tournaments.TournamentID as tournaID, TournamentGame, count(*) as Numbers FROM teampalak.registered_teams inner join teampalak.tournaments on teampalak.registered_teams.TournamentID = tournaments.TournamentID GROUP BY tournaments.TournamentID";
											db.query(sql7, function(err, result7){
                                                var sql8 = "SELECT game.GameID, game.tournamentID, game.Rounds, game.Team1ID, teama.TeamName AS Team1Name, game.Team2ID, game.Winner, teamb.TeamName AS Team2Name FROM game as game INNER JOIN teams as teama on teama.TeamID = game.Team1ID INNER JOIN teams as teamb on teamb.TeamID = game.Team2ID";
                                                db.query(sql8, function(err, result8){
                                                    //console.log("Login Tournaments Team result 7");
                                                        var sql9 = "select message from teampalak.notifications where status = 'unchecked' AND accID = ?";
												db.query(sql9,userId, function(err, result9){
													var sql10 = "select message, status from teampalak.notifications where accID = ?";
													db.query(sql10,userId, function(err, result10){
														var sql11 = "UPDATE notifications SET status='Checked' WHERE accID = ?";
														db.query(sql11,userId, function(err, result11){
                                                    //console.log("Login Tournaments Team result 7");
                                                        res.render('history.ejs',{data:result,data1:result1,data2:result2, user: userId, message:message, lol:result4, dota:result5,  all:result7, data4:result8,num:result9,
																notif:result10});
                                                		})
													})
												})
                                                })
											})
										
									})
								})
							
						})
						})
				});
		} else if(req.query.search) {
			if(req.session.message === undefined)
				req.session.message = "";
				var sql = "SELECT td.tdetID, td.TournamentID, td.TournaRange, td.TSched, td.Max_participants, td.registration_fee, td.Tpic, td.1stPrize as first, td.2ndPrize as second, td.TVenue, t.TournamentName, t.TournamentGame, t.tournaLB, t.tournaUB, rt.registeredteams, t.Status FROM tournament_details td INNER JOIN (SELECT * FROM tournaments) t ON t.TournamentID = td.TournamentID LEFT JOIN (SELECT COUNT(registeredteamID) AS registeredteams, SUM(Seed) AS seed, tournament_details.TournamentID FROM tournament_details LEFT JOIN registered_teams ON tournament_details.TournamentID = registered_teams.TournamentID WHERE Status = \"Approved\" GROUP BY TournamentID) rt ON td.TournamentID = rt.TournamentID WHERE t.Status = 'Closed' and t.TournamentName like '%"+req.query.search+"%' order by TSched desc";
				db.query(sql, function(err, result){
					//console.log("Login Tournaments Team result 0");
					//console.log(result);
					var sql1 = "SELECT td.tdetID, td.TournamentID, td.TournaRange, td.TSched, td.Max_participants, td.registration_fee, td.Tpic, td.1stPrize as first, td.2ndPrize as second, td.TVenue, t.TournamentName, t.TournamentGame, t.tournaLB, t.tournaUB, rt.registeredteams, t.Status FROM tournament_details td INNER JOIN (SELECT * FROM tournaments) t ON t.TournamentID = td.TournamentID LEFT JOIN (SELECT COUNT(registeredteamID) AS registeredteams, SUM(Seed) AS seed, tournament_details.TournamentID FROM tournament_details LEFT JOIN registered_teams ON tournament_details.TournamentID = registered_teams.TournamentID WHERE Status = \"Approved\" GROUP BY TournamentID) rt ON td.TournamentID = rt.TournamentID WHERE t.Status = 'Closed' and t.TournamentName like '%"+req.query.search+"%' order by TSched desc";
					db.query(sql1, function(err, result1){
						//console.log("Login Tournaments Team result 1");
						var sql2 = "SELECT td.tdetID, td.TournamentID, td.TournaRange, td.TSched, td.Max_participants, td.registration_fee, td.Tpic, td.1stPrize as first, td.2ndPrize as second td.TVenue, t.TournamentName, t.TournamentGame, t.tournaLB, t.tournaUB, rt.registeredteams, t.Status FROM tournament_details td INNER JOIN (SELECT * FROM tournaments) t ON t.TournamentID = td.TournamentID LEFT JOIN (SELECT COUNT(registeredteamID) AS registeredteams, SUM(Seed) AS seed, tournament_details.TournamentID FROM tournament_details LEFT JOIN registered_teams ON tournament_details.TournamentID = registered_teams.TournamentID WHERE Status = \"Approved\" GROUP BY TournamentID) rt ON td.TournamentID = rt.TournamentID where TournamentGame like \'dota%\' AND t.Status = 'Closed' and t.TournamentName like '%"+req.query.search+"%' order by TSched desc";
						db.query(sql2, function(err, result2){
							//console.log("Login Tournaments Team result 2");
								var sql4 = "SELECT td.tdetID, td.TournamentID, td.TournaRange, td.TSched, td.Max_participants, td.registration_fee, td.Tpic,td.1stPrize as first, td.2ndPrize as second, td.TVenue, t.TournamentName, t.TournamentGame, t.tournaLB, t.tournaUB, rt.registeredteams, t.Status FROM tournament_details td INNER JOIN (SELECT * FROM tournaments) t ON t.TournamentID = td.TournamentID LEFT JOIN (SELECT COUNT(registeredteamID) AS registeredteams, SUM(Seed) AS seed, tournament_details.TournamentID FROM tournament_details LEFT JOIN registered_teams ON tournament_details.TournamentID = registered_teams.TournamentID WHERE Status = \"Approved\" GROUP BY TournamentID) rt ON td.TournamentID = rt.TournamentID where TournamentGame like \'lol%\' AND t.Status = 'Closed' and t.TournamentName like '%"+req.query.search+"%' order by TSched desc";
								db.query(sql4, function(err, result4){
									//console.log("Login Tournaments Team result 4");
									var sql5 = "SELECT td.tdetID, td.TournamentID, td.TournaRange, td.TSched, td.Max_participants, td.registration_fee, td.Tpic, td.1stPrize as first, td.2ndPrize as second, td.TVenue, t.TournamentName, t.TournamentGame, t.tournaLB, t.tournaUB, rt.registeredteams, t.Status FROM tournament_details td INNER JOIN (SELECT * FROM tournaments) t ON t.TournamentID = td.TournamentID LEFT JOIN (SELECT COUNT(registeredteamID) AS registeredteams, SUM(Seed) AS seed, tournament_details.TournamentID FROM tournament_details LEFT JOIN registered_teams ON tournament_details.TournamentID = registered_teams.TournamentID WHERE Status = \"Approved\" GROUP BY TournamentID) rt ON td.TournamentID = rt.TournamentID where TournamentGame like \'cs%\' AND t.Status = 'Closed' and t.TournamentName like '%"+req.query.search+"%' order by TSched desc";
									db.query(sql5, function(err, result5){
										//console.log("Login Tournaments Team result 5");
										
											var sql7 = "SELECT tournaments.TournamentID as tournaID, TournamentGame, count(*) as Numbers FROM teampalak.registered_teams inner join teampalak.tournaments on teampalak.registered_teams.TournamentID = tournaments.TournamentID GROUP BY tournaments.TournamentID";
											db.query(sql7, function(err, result7){
                                                var sql8 = "SELECT game.GameID, game.tournamentID, game.Rounds, game.Team1ID, teama.TeamName AS Team1Name, game.Team2ID, game.Winner, teamb.TeamName AS Team2Name FROM game as game INNER JOIN teams as teama on teama.TeamID = game.Team1ID INNER JOIN teams as teamb on teamb.TeamID = game.Team2ID";
                                                db.query(sql8, function(err, result8){
                                                    var sql9 = "select message from teampalak.notifications where status = 'unchecked' AND accID = ?";
												db.query(sql9,userId, function(err, result9){
													var sql10 = "select message, status from teampalak.notifications where accID = ?";
													db.query(sql10,userId, function(err, result10){
														var sql11 = "UPDATE notifications SET status='Checked' WHERE accID = ?";
														db.query(sql11,userId, function(err, result11){
                                                    //console.log("Login Tournaments Team result 7");
                                                        res.render('history.ejs',{data:result,data1:result1,data2:result2, user: userId, message:message, lol:result4, dota:result5,  all:result7, data4:result8,num:result9,
																notif:result10});
                                                		})
													})
												})
                                                })
											})
										
									})
								})
							
						})
						})
				});
		} else {
			if(req.session.message === undefined)
				req.session.message = "";
				var sql = "SELECT td.tdetID, td.TournamentID, td.TournaRange, td.TSched, td.Max_participants, td.registration_fee, td.Tpic, td.1stPrize as first, td.2ndPrize as second, td.TVenue, t.TournamentName, t.TournamentGame, t.tournaLB, t.tournaUB, rt.registeredteams, t.Status FROM tournament_details td INNER JOIN (SELECT * FROM tournaments) t ON t.TournamentID = td.TournamentID LEFT JOIN (SELECT COUNT(registeredteamID) AS registeredteams, SUM(Seed) AS seed, tournament_details.TournamentID FROM tournament_details LEFT JOIN registered_teams ON tournament_details.TournamentID = registered_teams.TournamentID WHERE Status = \"Approved\" GROUP BY TournamentID) rt ON td.TournamentID = rt.TournamentID WHERE t.Status = 'Closed' order by TSched desc";
				db.query(sql, function(err, result){
					//console.log("Login Tournaments Team result 0");
					//console.log(result);
					var sql1 = "SELECT td.tdetID, td.TournamentID, td.TournaRange, td.TSched, td.Max_participants, td.registration_fee, td.Tpic, td.1stPrize as first, td.2ndPrize as second, td.TVenue, t.TournamentName, t.TournamentGame, t.tournaLB, t.tournaUB, rt.registeredteams, t.Status FROM tournament_details td INNER JOIN (SELECT * FROM tournaments) t ON t.TournamentID = td.TournamentID LEFT JOIN (SELECT COUNT(registeredteamID) AS registeredteams, SUM(Seed) AS seed, tournament_details.TournamentID FROM tournament_details LEFT JOIN registered_teams ON tournament_details.TournamentID = registered_teams.TournamentID WHERE Status = \"Approved\" GROUP BY TournamentID) rt ON td.TournamentID = rt.TournamentID WHERE t.Status = 'Closed' order by TSched desc";
					db.query(sql1, function(err, result1){
						//console.log("Login Tournaments Team result 1");
						var sql2 = "SELECT td.tdetID, td.TournamentID, td.TournaRange, td.TSched, td.Max_participants, td.registration_fee, td.Tpic, td.1stPrize as first, td.2ndPrize as second, td.TVenue, t.TournamentName, t.TournamentGame, t.tournaLB, t.tournaUB, rt.registeredteams, t.Status FROM tournament_details td INNER JOIN (SELECT * FROM tournaments) t ON t.TournamentID = td.TournamentID LEFT JOIN (SELECT COUNT(registeredteamID) AS registeredteams, SUM(Seed) AS seed, tournament_details.TournamentID FROM tournament_details LEFT JOIN registered_teams ON tournament_details.TournamentID = registered_teams.TournamentID WHERE Status = \"Approved\" GROUP BY TournamentID) rt ON td.TournamentID = rt.TournamentID where TournamentGame like \'dota%\' AND t.Status = 'Closed' order by TSched desc";
						db.query(sql2, function(err, result2){
							//console.log("Login Tournaments Team result 2");
								var sql4 = "SELECT td.tdetID, td.TournamentID, td.TournaRange, td.TSched, td.Max_participants, td.registration_fee, td.Tpic, td.1stPrize as first, td.2ndPrize as second, td.TVenue, t.TournamentName, t.TournamentGame, t.tournaLB, t.tournaUB, rt.registeredteams, t.Status FROM tournament_details td INNER JOIN (SELECT * FROM tournaments) t ON t.TournamentID = td.TournamentID LEFT JOIN (SELECT COUNT(registeredteamID) AS registeredteams, SUM(Seed) AS seed, tournament_details.TournamentID FROM tournament_details LEFT JOIN registered_teams ON tournament_details.TournamentID = registered_teams.TournamentID WHERE Status = \"Approved\" GROUP BY TournamentID) rt ON td.TournamentID = rt.TournamentID where TournamentGame like \'lol%\' AND t.Status = 'Closed' order by TSched desc";
								db.query(sql4, function(err, result4){
									//console.log("Login Tournaments Team result 4");
									var sql5 = "SELECT td.tdetID, td.TournamentID, td.TournaRange, td.TSched, td.Max_participants, td.registration_fee, td.Tpic, td.1stPrize as first, td.2ndPrize as second, td.TVenue, t.TournamentName, t.TournamentGame, t.tournaLB, t.tournaUB, rt.registeredteams, t.Status FROM tournament_details td INNER JOIN (SELECT * FROM tournaments) t ON t.TournamentID = td.TournamentID LEFT JOIN (SELECT COUNT(registeredteamID) AS registeredteams, SUM(Seed) AS seed, tournament_details.TournamentID FROM tournament_details LEFT JOIN registered_teams ON tournament_details.TournamentID = registered_teams.TournamentID WHERE Status = \"Approved\" GROUP BY TournamentID) rt ON td.TournamentID = rt.TournamentID where TournamentGame like \'cs%\' AND t.Status = 'Closed' order by TSched desc";
									db.query(sql5, function(err, result5){
										//console.log("Login Tournaments Team result 5");
										
											var sql7 = "SELECT tournaments.TournamentID as tournaID, TournamentGame, count(*) as Numbers FROM teampalak.registered_teams inner join teampalak.tournaments on teampalak.registered_teams.TournamentID = tournaments.TournamentID GROUP BY tournaments.TournamentID";
											db.query(sql7, function(err, result7){
                                                var sql8 = "SELECT game.GameID, game.tournamentID, game.Rounds, game.Team1ID, teama.TeamName AS Team1Name, game.Winner, game.Team2ID, teamb.TeamName AS Team2Name FROM game as game INNER JOIN teams as teama on teama.TeamID = game.Team1ID INNER JOIN teams as teamb on teamb.TeamID = game.Team2ID";
                                                db.query(sql8, function(err, result8){
                                                    var sql9 = "select message from teampalak.notifications where status = 'unchecked' AND accID = ?";
												db.query(sql9,userId, function(err, result9){
													var sql10 = "select message, status from teampalak.notifications where accID = ?";
													db.query(sql10,userId, function(err, result10){
														var sql11 = "UPDATE notifications SET status='Checked' WHERE accID = ?";
														db.query(sql11,userId, function(err, result11){
                                                    //console.log("Login Tournaments Team result 7");
                                                        res.render('history.ejs',{data:result,data1:result1,data2:result2, user: userId, message:message, lol:result4, dota:result5,  all:result7, data4:result8,num:result9,
																notif:result10});
                                                		})
													})
												})
                                                })
											})
										
									})
								})
							
						})
						})
				});
		}
	};

//==========================| History not login|=============================
exports.history2 = function(req, res, next) {
	//console.log("a");
		var user = req.session.user,
			userId = req.session.userId;
		//console.log("b");
					if(req.session.message === undefined)
				req.session.message = "";
					var message = req.session.message;
			req.session.message = "";
		var dasa = req.body.dasa;
		if(req.query.sort=="lowtohigh"){

			if(req.session.message === undefined)
				req.session.message = "";
				var sql = "SELECT td.tdetID, td.TournamentID, td.TournaRange, td.TSched, td.Max_participants, td.registration_fee, td.Tpic, td.1stPrize as first, td.2ndPrize as second, td.TVenue, t.TournamentName, t.TournamentGame, t.tournaLB, t.tournaUB, rt.registeredteams, t.Status FROM tournament_details td INNER JOIN (SELECT * FROM tournaments) t ON t.TournamentID = td.TournamentID LEFT JOIN (SELECT COUNT(registeredteamID) AS registeredteams, SUM(Seed) AS seed, tournament_details.TournamentID FROM tournament_details LEFT JOIN registered_teams ON tournament_details.TournamentID = registered_teams.TournamentID WHERE Status = \"Approved\" GROUP BY TournamentID) rt ON td.TournamentID = rt.TournamentID WHERE t.Status = 'Closed' order by td.TSched";
				db.query(sql, function(err, result){
					//console.log("Login Tournaments Team result 0");
					//console.log(result);
					var sql1 = "SELECT td.tdetID, td.TournamentID, td.TournaRange, td.TSched, td.Max_participants, td.registration_fee, td.Tpic, td.1stPrize as first, td.2ndPrize as second, td.TVenue, t.TournamentName, t.TournamentGame, t.tournaLB, t.tournaUB, rt.registeredteams, t.Status FROM tournament_details td INNER JOIN (SELECT * FROM tournaments) t ON t.TournamentID = td.TournamentID LEFT JOIN (SELECT COUNT(registeredteamID) AS registeredteams, SUM(Seed) AS seed, tournament_details.TournamentID FROM tournament_details LEFT JOIN registered_teams ON tournament_details.TournamentID = registered_teams.TournamentID WHERE Status = \"Approved\" GROUP BY TournamentID) rt ON td.TournamentID = rt.TournamentID WHERE t.Status = 'Closed' order by td.TSched";
					db.query(sql1, function(err, result1){
						//console.log("Login Tournaments Team result 1");
						var sql2 = "SELECT td.tdetID, td.TournamentID, td.TournaRange, td.TSched, td.Max_participants, td.registration_fee, td.Tpic, td.1stPrize as first, td.2ndPrize as second, td.TVenue, t.TournamentName, t.TournamentGame, t.tournaLB, t.tournaUB, rt.registeredteams, t.Status FROM tournament_details td INNER JOIN (SELECT * FROM tournaments) t ON t.TournamentID = td.TournamentID LEFT JOIN (SELECT COUNT(registeredteamID) AS registeredteams, SUM(Seed) AS seed, tournament_details.TournamentID FROM tournament_details LEFT JOIN registered_teams ON tournament_details.TournamentID = registered_teams.TournamentID WHERE Status = \"Approved\" GROUP BY TournamentID) rt ON td.TournamentID = rt.TournamentID where TournamentGame like \'dota%\' AND t.Status = 'Closed' order by td.TSched";
						db.query(sql2, function(err, result2){
							//console.log("Login Tournaments Team result 2");
								var sql4 = "SELECT td.tdetID, td.TournamentID, td.TournaRange, td.TSched, td.Max_participants, td.registration_fee, td.Tpic, td.1stPrize as first, td.2ndPrize as second, td.TVenue, t.TournamentName, t.TournamentGame, t.tournaLB, t.tournaUB, rt.registeredteams, t.Status FROM tournament_details td INNER JOIN (SELECT * FROM tournaments) t ON t.TournamentID = td.TournamentID LEFT JOIN (SELECT COUNT(registeredteamID) AS registeredteams, SUM(Seed) AS seed, tournament_details.TournamentID FROM tournament_details LEFT JOIN registered_teams ON tournament_details.TournamentID = registered_teams.TournamentID WHERE Status = \"Approved\" GROUP BY TournamentID) rt ON td.TournamentID = rt.TournamentID where TournamentGame like \'lol%\' AND t.Status = 'Closed' order by td.TSched";
								db.query(sql4, function(err, result4){
									//console.log("Login Tournaments Team result 4");
									var sql5 = "SELECT td.tdetID, td.TournamentID, td.TournaRange, td.TSched, td.Max_participants, td.registration_fee, td.Tpic, td.1stPrize as first, td.2ndPrize as second, td.TVenue, t.TournamentName, t.TournamentGame, t.tournaLB, t.tournaUB, rt.registeredteams, t.Status FROM tournament_details td INNER JOIN (SELECT * FROM tournaments) t ON t.TournamentID = td.TournamentID LEFT JOIN (SELECT COUNT(registeredteamID) AS registeredteams, SUM(Seed) AS seed, tournament_details.TournamentID FROM tournament_details LEFT JOIN registered_teams ON tournament_details.TournamentID = registered_teams.TournamentID WHERE Status = \"Approved\" GROUP BY TournamentID) rt ON td.TournamentID = rt.TournamentID where TournamentGame like \'cs%\' AND t.Status = 'Closed' order by td.TSched";
									db.query(sql5, function(err, result5){
										//console.log("Login Tournaments Team result 5");
										
											var sql7 = "SELECT tournaments.TournamentID as tournaID, TournamentGame, count(*) as Numbers FROM teampalak.registered_teams inner join teampalak.tournaments on teampalak.registered_teams.TournamentID = tournaments.TournamentID GROUP BY tournaments.TournamentID";
											db.query(sql7, function(err, result7){
                                                var sql8 = "SELECT game.GameID, game.tournamentID, game.Rounds, game.Team1ID, teama.TeamName AS Team1Name, game.Winner, game.Team2ID, teamb.TeamName AS Team2Name FROM game as game INNER JOIN teams as teama on teama.TeamID = game.Team1ID INNER JOIN teams as teamb on teamb.TeamID = game.Team2ID";
                                                db.query(sql8, function(err, result8){
                                                    //console.log("Login Tournaments Team result 7");
                                                        res.render('history2.ejs',{data:result,data1:result1,data2:result2, user: userId, message:message, lol:result4, dota:result5,  all:result7, data4:result8});
                                                })
											})
										
									})
								})
							
						})
						})
				});
		} else if(req.query.sort=="hightolow") {
			
			if(req.session.message === undefined)
				req.session.message = "";
				var sql = "SELECT td.tdetID, td.TournamentID, td.TournaRange, td.TSched, td.Max_participants, td.registration_fee, td.Tpic, td.1stPrize as first, td.2ndPrize as second, td.TVenue, t.TournamentName, t.TournamentGame, t.tournaLB, t.tournaUB, rt.registeredteams, t.Status FROM tournament_details td INNER JOIN (SELECT * FROM tournaments) t ON t.TournamentID = td.TournamentID LEFT JOIN (SELECT COUNT(registeredteamID) AS registeredteams, SUM(Seed) AS seed, tournament_details.TournamentID FROM tournament_details LEFT JOIN registered_teams ON tournament_details.TournamentID = registered_teams.TournamentID WHERE Status = \"Approved\" GROUP BY TournamentID) rt ON td.TournamentID = rt.TournamentID WHERE t.Status = 'Closed' order by td.TSched desc";
				db.query(sql, function(err, result){
					//console.log("Login Tournaments Team result 0");
					//console.log(result);
					var sql1 = "SELECT td.tdetID, td.TournamentID, td.TournaRange, td.TSched, td.Max_participants, td.registration_fee, td.Tpic, td.1stPrize as first, td.2ndPrize as second, td.TVenue, t.TournamentName, t.TournamentGame, t.tournaLB, t.tournaUB, rt.registeredteams, t.Status FROM tournament_details td INNER JOIN (SELECT * FROM tournaments) t ON t.TournamentID = td.TournamentID LEFT JOIN (SELECT COUNT(registeredteamID) AS registeredteams, SUM(Seed) AS seed, tournament_details.TournamentID FROM tournament_details LEFT JOIN registered_teams ON tournament_details.TournamentID = registered_teams.TournamentID WHERE Status = \"Approved\" GROUP BY TournamentID) rt ON td.TournamentID = rt.TournamentID WHERE t.Status = 'Closed' order by td.TSched desc";
					db.query(sql1, function(err, result1){
						//console.log("Login Tournaments Team result 1");
						var sql2 = "SELECT td.tdetID, td.TournamentID, td.TournaRange, td.TSched, td.Max_participants, td.registration_fee, td.Tpic, td.1stPrize as first, td.2ndPrize as second, td.TVenue, t.TournamentName, t.TournamentGame, t.tournaLB, t.tournaUB, rt.registeredteams, t.Status FROM tournament_details td INNER JOIN (SELECT * FROM tournaments) t ON t.TournamentID = td.TournamentID LEFT JOIN (SELECT COUNT(registeredteamID) AS registeredteams, SUM(Seed) AS seed, tournament_details.TournamentID FROM tournament_details LEFT JOIN registered_teams ON tournament_details.TournamentID = registered_teams.TournamentID WHERE Status = \"Approved\" GROUP BY TournamentID) rt ON td.TournamentID = rt.TournamentID where TournamentGame like \'dota%\' AND t.Status = 'Closed' order by td.TSched desc";
						db.query(sql2, function(err, result2){
							//console.log("Login Tournaments Team result 2");
								var sql4 = "SELECT td.tdetID, td.TournamentID, td.TournaRange, td.TSched, td.Max_participants, td.registration_fee, td.Tpic, td.1stPrize as first, td.2ndPrize as second, td.TVenue, t.TournamentName, t.TournamentGame, t.tournaLB, t.tournaUB, rt.registeredteams, t.Status FROM tournament_details td INNER JOIN (SELECT * FROM tournaments) t ON t.TournamentID = td.TournamentID LEFT JOIN (SELECT COUNT(registeredteamID) AS registeredteams, SUM(Seed) AS seed, tournament_details.TournamentID FROM tournament_details LEFT JOIN registered_teams ON tournament_details.TournamentID = registered_teams.TournamentID WHERE Status = \"Approved\" GROUP BY TournamentID) rt ON td.TournamentID = rt.TournamentID where TournamentGame like \'lol%\' AND t.Status = 'Closed' order by td.TSched desc";
								db.query(sql4, function(err, result4){
									//console.log("Login Tournaments Team result 4");
									var sql5 = "SELECT td.tdetID, td.TournamentID, td.TournaRange, td.TSched, td.Max_participants, td.registration_fee, td.Tpic, td.1stPrize as first, td.2ndPrize as second, td.TVenue, t.TournamentName, t.TournamentGame, t.tournaLB, t.tournaUB, rt.registeredteams, t.Status FROM tournament_details td INNER JOIN (SELECT * FROM tournaments) t ON t.TournamentID = td.TournamentID LEFT JOIN (SELECT COUNT(registeredteamID) AS registeredteams, SUM(Seed) AS seed, tournament_details.TournamentID FROM tournament_details LEFT JOIN registered_teams ON tournament_details.TournamentID = registered_teams.TournamentID WHERE Status = \"Approved\" GROUP BY TournamentID) rt ON td.TournamentID = rt.TournamentID where TournamentGame like \'cs%\' AND t.Status = 'Closed' order by td.TSched desc";
									db.query(sql5, function(err, result5){
										//console.log("Login Tournaments Team result 5");
										
											var sql7 = "SELECT tournaments.TournamentID as tournaID, TournamentGame, count(*) as Numbers FROM teampalak.registered_teams inner join teampalak.tournaments on teampalak.registered_teams.TournamentID = tournaments.TournamentID GROUP BY tournaments.TournamentID";
											db.query(sql7, function(err, result7){
                                                var sql8 = "SELECT game.GameID, game.tournamentID, game.Rounds, game.Team1ID, teama.TeamName AS Team1Name, game.Team2ID, game.Winner, teamb.TeamName AS Team2Name FROM game as game INNER JOIN teams as teama on teama.TeamID = game.Team1ID INNER JOIN teams as teamb on teamb.TeamID = game.Team2ID";
                                                db.query(sql8, function(err, result8){
                                                    //console.log("Login Tournaments Team result 7");
                                                        res.render('history2.ejs',{data:result,data1:result1,data2:result2, user: userId, message:message, lol:result4, dota:result5,  all:result7, data4:result8});
                                                })
											})
										
									})
								})
							
						})
						})
				});
		} else if(req.query.search) {
			if(req.session.message === undefined)
				req.session.message = "";
				var sql = "SELECT td.tdetID, td.TournamentID, td.TournaRange, td.TSched, td.Max_participants, td.registration_fee, td.Tpic, td.1stPrize as first, td.2ndPrize as second, td.TVenue, t.TournamentName, t.TournamentGame, t.tournaLB, t.tournaUB, rt.registeredteams, t.Status FROM tournament_details td INNER JOIN (SELECT * FROM tournaments) t ON t.TournamentID = td.TournamentID LEFT JOIN (SELECT COUNT(registeredteamID) AS registeredteams, SUM(Seed) AS seed, tournament_details.TournamentID FROM tournament_details LEFT JOIN registered_teams ON tournament_details.TournamentID = registered_teams.TournamentID WHERE Status = \"Approved\" GROUP BY TournamentID) rt ON td.TournamentID = rt.TournamentID WHERE t.Status = 'Closed' and t.TournamentName like '%"+req.query.search+"%' order by TSched desc";
				db.query(sql, function(err, result){
					//console.log("Login Tournaments Team result 0");
					//console.log(result);
					var sql1 = "SELECT td.tdetID, td.TournamentID, td.TournaRange, td.TSched, td.Max_participants, td.registration_fee, td.Tpic, td.1stPrize as first, td.2ndPrize as second, td.TVenue, t.TournamentName, t.TournamentGame, t.tournaLB, t.tournaUB, rt.registeredteams, t.Status FROM tournament_details td INNER JOIN (SELECT * FROM tournaments) t ON t.TournamentID = td.TournamentID LEFT JOIN (SELECT COUNT(registeredteamID) AS registeredteams, SUM(Seed) AS seed, tournament_details.TournamentID FROM tournament_details LEFT JOIN registered_teams ON tournament_details.TournamentID = registered_teams.TournamentID WHERE Status = \"Approved\" GROUP BY TournamentID) rt ON td.TournamentID = rt.TournamentID WHERE t.Status = 'Closed' and t.TournamentName like '%"+req.query.search+"%' order by TSched desc";
					db.query(sql1, function(err, result1){
						//console.log("Login Tournaments Team result 1");
						var sql2 = "SELECT td.tdetID, td.TournamentID, td.TournaRange, td.TSched, td.Max_participants, td.registration_fee, td.Tpic, td.1stPrize as first, td.2ndPrize as second td.TVenue, t.TournamentName, t.TournamentGame, t.tournaLB, t.tournaUB, rt.registeredteams, t.Status FROM tournament_details td INNER JOIN (SELECT * FROM tournaments) t ON t.TournamentID = td.TournamentID LEFT JOIN (SELECT COUNT(registeredteamID) AS registeredteams, SUM(Seed) AS seed, tournament_details.TournamentID FROM tournament_details LEFT JOIN registered_teams ON tournament_details.TournamentID = registered_teams.TournamentID WHERE Status = \"Approved\" GROUP BY TournamentID) rt ON td.TournamentID = rt.TournamentID where TournamentGame like \'dota%\' AND t.Status = 'Closed' and t.TournamentName like '%"+req.query.search+"%' order by TSched desc";
						db.query(sql2, function(err, result2){
							//console.log("Login Tournaments Team result 2");
								var sql4 = "SELECT td.tdetID, td.TournamentID, td.TournaRange, td.TSched, td.Max_participants, td.registration_fee, td.Tpic,td.1stPrize as first, td.2ndPrize as second, td.TVenue, t.TournamentName, t.TournamentGame, t.tournaLB, t.tournaUB, rt.registeredteams, t.Status FROM tournament_details td INNER JOIN (SELECT * FROM tournaments) t ON t.TournamentID = td.TournamentID LEFT JOIN (SELECT COUNT(registeredteamID) AS registeredteams, SUM(Seed) AS seed, tournament_details.TournamentID FROM tournament_details LEFT JOIN registered_teams ON tournament_details.TournamentID = registered_teams.TournamentID WHERE Status = \"Approved\" GROUP BY TournamentID) rt ON td.TournamentID = rt.TournamentID where TournamentGame like \'lol%\' AND t.Status = 'Closed' and t.TournamentName like '%"+req.query.search+"%' order by TSched desc";
								db.query(sql4, function(err, result4){
									//console.log("Login Tournaments Team result 4");
									var sql5 = "SELECT td.tdetID, td.TournamentID, td.TournaRange, td.TSched, td.Max_participants, td.registration_fee, td.Tpic, td.1stPrize as first, td.2ndPrize as second, td.TVenue, t.TournamentName, t.TournamentGame, t.tournaLB, t.tournaUB, rt.registeredteams, t.Status FROM tournament_details td INNER JOIN (SELECT * FROM tournaments) t ON t.TournamentID = td.TournamentID LEFT JOIN (SELECT COUNT(registeredteamID) AS registeredteams, SUM(Seed) AS seed, tournament_details.TournamentID FROM tournament_details LEFT JOIN registered_teams ON tournament_details.TournamentID = registered_teams.TournamentID WHERE Status = \"Approved\" GROUP BY TournamentID) rt ON td.TournamentID = rt.TournamentID where TournamentGame like \'cs%\' AND t.Status = 'Closed' and t.TournamentName like '%"+req.query.search+"%' order by TSched desc";
									db.query(sql5, function(err, result5){
										//console.log("Login Tournaments Team result 5");
										
											var sql7 = "SELECT tournaments.TournamentID as tournaID, TournamentGame, count(*) as Numbers FROM teampalak.registered_teams inner join teampalak.tournaments on teampalak.registered_teams.TournamentID = tournaments.TournamentID GROUP BY tournaments.TournamentID";
											db.query(sql7, function(err, result7){
                                                var sql8 = "SELECT game.GameID, game.tournamentID, game.Rounds, game.Team1ID, teama.TeamName AS Team1Name, game.Team2ID, game.Winner, teamb.TeamName AS Team2Name FROM game as game INNER JOIN teams as teama on teama.TeamID = game.Team1ID INNER JOIN teams as teamb on teamb.TeamID = game.Team2ID";
                                                db.query(sql8, function(err, result8){
                                                    //console.log("Login Tournaments Team result 7");
                                                        res.render('history2.ejs',{data:result,data1:result1,data2:result2, user: userId, message:message, lol:result4, dota:result5,  all:result7, data4:result8});
                                                })
											})
										
									})
								})
							
						})
						})
				});
		} else {
			if(req.session.message === undefined)
				req.session.message = "";
				var sql = "SELECT td.tdetID, td.TournamentID, td.TournaRange, td.TSched, td.Max_participants, td.registration_fee, td.Tpic, td.1stPrize as first, td.2ndPrize as second, td.TVenue, t.TournamentName, t.TournamentGame, t.tournaLB, t.tournaUB, rt.registeredteams, t.Status FROM tournament_details td INNER JOIN (SELECT * FROM tournaments) t ON t.TournamentID = td.TournamentID LEFT JOIN (SELECT COUNT(registeredteamID) AS registeredteams, SUM(Seed) AS seed, tournament_details.TournamentID FROM tournament_details LEFT JOIN registered_teams ON tournament_details.TournamentID = registered_teams.TournamentID WHERE Status = \"Approved\" GROUP BY TournamentID) rt ON td.TournamentID = rt.TournamentID WHERE t.Status = 'Closed' order by TSched desc";
				db.query(sql, function(err, result){
					//console.log("Login Tournaments Team result 0");
					//console.log(result);
					var sql1 = "SELECT td.tdetID, td.TournamentID, td.TournaRange, td.TSched, td.Max_participants, td.registration_fee, td.Tpic, td.1stPrize as first, td.2ndPrize as second, td.TVenue, t.TournamentName, t.TournamentGame, t.tournaLB, t.tournaUB, rt.registeredteams, t.Status FROM tournament_details td INNER JOIN (SELECT * FROM tournaments) t ON t.TournamentID = td.TournamentID LEFT JOIN (SELECT COUNT(registeredteamID) AS registeredteams, SUM(Seed) AS seed, tournament_details.TournamentID FROM tournament_details LEFT JOIN registered_teams ON tournament_details.TournamentID = registered_teams.TournamentID WHERE Status = \"Approved\" GROUP BY TournamentID) rt ON td.TournamentID = rt.TournamentID WHERE t.Status = 'Closed' order by TSched desc";
					db.query(sql1, function(err, result1){
						//console.log("Login Tournaments Team result 1");
						var sql2 = "SELECT td.tdetID, td.TournamentID, td.TournaRange, td.TSched, td.Max_participants, td.registration_fee, td.Tpic, td.1stPrize as first, td.2ndPrize as second, td.TVenue, t.TournamentName, t.TournamentGame, t.tournaLB, t.tournaUB, rt.registeredteams, t.Status FROM tournament_details td INNER JOIN (SELECT * FROM tournaments) t ON t.TournamentID = td.TournamentID LEFT JOIN (SELECT COUNT(registeredteamID) AS registeredteams, SUM(Seed) AS seed, tournament_details.TournamentID FROM tournament_details LEFT JOIN registered_teams ON tournament_details.TournamentID = registered_teams.TournamentID WHERE Status = \"Approved\" GROUP BY TournamentID) rt ON td.TournamentID = rt.TournamentID where TournamentGame like \'dota%\' AND t.Status = 'Closed' order by TSched desc";
						db.query(sql2, function(err, result2){
							//console.log("Login Tournaments Team result 2");
								var sql4 = "SELECT td.tdetID, td.TournamentID, td.TournaRange, td.TSched, td.Max_participants, td.registration_fee, td.Tpic, td.1stPrize as first, td.2ndPrize as second, td.TVenue, t.TournamentName, t.TournamentGame, t.tournaLB, t.tournaUB, rt.registeredteams, t.Status FROM tournament_details td INNER JOIN (SELECT * FROM tournaments) t ON t.TournamentID = td.TournamentID LEFT JOIN (SELECT COUNT(registeredteamID) AS registeredteams, SUM(Seed) AS seed, tournament_details.TournamentID FROM tournament_details LEFT JOIN registered_teams ON tournament_details.TournamentID = registered_teams.TournamentID WHERE Status = \"Approved\" GROUP BY TournamentID) rt ON td.TournamentID = rt.TournamentID where TournamentGame like \'lol%\' AND t.Status = 'Closed' order by TSched desc";
								db.query(sql4, function(err, result4){
									//console.log("Login Tournaments Team result 4");
									var sql5 = "SELECT td.tdetID, td.TournamentID, td.TournaRange, td.TSched, td.Max_participants, td.registration_fee, td.Tpic, td.1stPrize as first, td.2ndPrize as second, td.TVenue, t.TournamentName, t.TournamentGame, t.tournaLB, t.tournaUB, rt.registeredteams, t.Status FROM tournament_details td INNER JOIN (SELECT * FROM tournaments) t ON t.TournamentID = td.TournamentID LEFT JOIN (SELECT COUNT(registeredteamID) AS registeredteams, SUM(Seed) AS seed, tournament_details.TournamentID FROM tournament_details LEFT JOIN registered_teams ON tournament_details.TournamentID = registered_teams.TournamentID WHERE Status = \"Approved\" GROUP BY TournamentID) rt ON td.TournamentID = rt.TournamentID where TournamentGame like \'cs%\' AND t.Status = 'Closed' order by TSched desc";
									db.query(sql5, function(err, result5){
										//console.log("Login Tournaments Team result 5");
										
											var sql7 = "SELECT tournaments.TournamentID as tournaID, TournamentGame, count(*) as Numbers FROM teampalak.registered_teams inner join teampalak.tournaments on teampalak.registered_teams.TournamentID = tournaments.TournamentID GROUP BY tournaments.TournamentID";
											db.query(sql7, function(err, result7){
                                                var sql8 = "SELECT game.GameID, game.tournamentID, game.Rounds, game.Team1ID, teama.TeamName AS Team1Name, game.Winner, game.Team2ID, teamb.TeamName AS Team2Name FROM game as game INNER JOIN teams as teama on teama.TeamID = game.Team1ID INNER JOIN teams as teamb on teamb.TeamID = game.Team2ID";
                                                db.query(sql8, function(err, result8){
                                                    //console.log("Login Tournaments Team result 7");
                                                        res.render('history2.ejs',{data:result,data1:result1,data2:result2, user: userId, message:message, lol:result4, dota:result5,  all:result7 ,data4:result8});
                                                })
											})
										
									})
								})
							
						})
						})
				});
		}
	};
//==========================| Login Tournaments Team |=============================
exports.login_tournaments = function(req, res, next) {
		//console.log("a");
			var user = req.session.user,
				userId = req.session.userID;
			//console.log("b");
			var dasa = req.body.dasa;
			var message = req.session.message;
			req.session.message = "";
				if (user == null) {
		res.redirect("/tournaments");
		return;}
		if(req.query.sort=="lowtohigh"){

			if(req.session.message === undefined)
				req.session.message = "";
				var sql = "SELECT td.tdetID, td.TournamentID, td.TournaRange, td.TSched, td.Max_participants, td.registration_fee, td.Tpic, td.1stPrize as first, td.2ndPrize as second, td.TVenue, t.TournamentName, t.TournamentGame, t.tournaLB, t.tournaUB, rt.registeredteams, t.Status FROM tournament_details td INNER JOIN (SELECT * FROM tournaments) t ON t.TournamentID = td.TournamentID LEFT JOIN (SELECT COUNT(registeredteamID) AS registeredteams, SUM(Seed) AS seed, tournament_details.TournamentID FROM tournament_details LEFT JOIN registered_teams ON tournament_details.TournamentID = registered_teams.TournamentID WHERE Status = \"Approved\" GROUP BY TournamentID) rt ON td.TournamentID = rt.TournamentID WHERE t.Status = 'Open' AND td.TournamentID not in (SELECT rts.tournamentID FROM teampalak.registered_teams rts inner join teampalak.members mem on rts.registeredteamID = mem.teamID where MemID ="+userId+") order by registration_fee";
				db.query(sql, function(err, result){
					//console.log("Login Tournaments Team result 0");
					//console.log(result);
					var sql1 = "SELECT td.tdetID, td.TournamentID, td.TournaRange, td.TSched, td.Max_participants, td.registration_fee, td.Tpic, td.1stPrize as first, td.2ndPrize as second, td.TVenue, t.TournamentName, t.TournamentGame, t.tournaLB, t.tournaUB, rt.registeredteams, t.Status FROM tournament_details td INNER JOIN (SELECT * FROM tournaments) t ON t.TournamentID = td.TournamentID LEFT JOIN (SELECT COUNT(registeredteamID) AS registeredteams, SUM(Seed) AS seed, tournament_details.TournamentID FROM tournament_details LEFT JOIN registered_teams ON tournament_details.TournamentID = registered_teams.TournamentID WHERE Status = \"Approved\" GROUP BY TournamentID) rt ON td.TournamentID = rt.TournamentID WHERE t.Status = 'Open' AND td.TournamentID not in (SELECT rts.tournamentID FROM teampalak.registered_teams rts inner join teampalak.members mem on rts.registeredteamID = mem.teamID where MemID ="+userId+") order by registration_fee";
					db.query(sql1, function(err, result1){
						//console.log("Login Tournaments Team result 1");
						var sql2 = "SELECT td.tdetID, td.TournamentID, td.TournaRange, td.TSched, td.Max_participants, td.registration_fee, td.Tpic, td.1stPrize as first, td.2ndPrize as second, td.TVenue, t.TournamentName, t.TournamentGame, t.tournaLB, t.tournaUB, rt.registeredteams, t.Status FROM tournament_details td INNER JOIN (SELECT * FROM tournaments) t ON t.TournamentID = td.TournamentID LEFT JOIN (SELECT COUNT(registeredteamID) AS registeredteams, SUM(Seed) AS seed, tournament_details.TournamentID FROM tournament_details LEFT JOIN registered_teams ON tournament_details.TournamentID = registered_teams.TournamentID WHERE Status = \"Approved\" GROUP BY TournamentID) rt ON td.TournamentID = rt.TournamentID where TournamentGame like 'dota%' AND t.Status = 'Open' AND td.TournamentID not in (SELECT rts.tournamentID FROM teampalak.registered_teams rts inner join teampalak.members mem on rts.registeredteamID = mem.teamID where MemID ="+userId+") order by registration_fee";
						db.query(sql2, function(err, result2){
							//console.log("Login Tournaments Team result 2");
								var sql4 = "SELECT td.tdetID, td.TournamentID, td.TournaRange, td.TSched, td.Max_participants, td.registration_fee, td.Tpic, td.1stPrize as first, td.2ndPrize as second, td.TVenue, t.TournamentName, t.TournamentGame, t.tournaLB, t.tournaUB, rt.registeredteams, t.Status FROM tournament_details td INNER JOIN (SELECT * FROM tournaments) t ON t.TournamentID = td.TournamentID LEFT JOIN (SELECT COUNT(registeredteamID) AS registeredteams, SUM(Seed) AS seed, tournament_details.TournamentID FROM tournament_details LEFT JOIN registered_teams ON tournament_details.TournamentID = registered_teams.TournamentID WHERE Status = \"Approved\" GROUP BY TournamentID) rt ON td.TournamentID = rt.TournamentID where TournamentGame like \'lol%\' AND t.Status = 'Open' AND td.TournamentID not in (SELECT rts.tournamentID FROM teampalak.registered_teams rts inner join teampalak.members mem on rts.registeredteamID = mem.teamID where MemID ="+userId+") order by registration_fee";
								db.query(sql4, function(err, result4){
									//console.log("Login Tournaments Team result 4");
									var sql5 = "SELECT td.tdetID, td.TournamentID, td.TournaRange, td.TSched, td.Max_participants, td.registration_fee, td.Tpic, td.1stPrize as first, td.2ndPrize as second, td.TVenue, t.TournamentName, t.TournamentGame, t.tournaLB, t.tournaUB, rt.registeredteams, t.Status FROM tournament_details td INNER JOIN (SELECT * FROM tournaments) t ON t.TournamentID = td.TournamentID LEFT JOIN (SELECT COUNT(registeredteamID) AS registeredteams, SUM(Seed) AS seed, tournament_details.TournamentID FROM tournament_details LEFT JOIN registered_teams ON tournament_details.TournamentID = registered_teams.TournamentID WHERE Status = \"Approved\" GROUP BY TournamentID) rt ON td.TournamentID = rt.TournamentID where TournamentGame like \'cs%\' AND t.Status = 'Open' AND td.TournamentID not in (SELECT rts.tournamentID FROM teampalak.registered_teams rts inner join teampalak.members mem on rts.registeredteamID = mem.teamID where MemID ="+userId+") order by registration_fee";
									db.query(sql5, function(err, result5){
										//console.log("Login Tournaments Team result 5");
										
											var sql7 = "SELECT tournaments.TournamentID as tournaID, TournamentGame, count(*) as Numbers FROM teampalak.registered_teams inner join teampalak.tournaments on teampalak.registered_teams.TournamentID = tournaments.TournamentID GROUP BY tournaments.TournamentID";
											db.query(sql7, function(err, result7){
												var sql9 = "select message from teampalak.notifications where status = 'unchecked' AND accID = ?";
												db.query(sql9,userId, function(err, result9){
													var sql10 = "select message, status from teampalak.notifications where accID = ?";
													db.query(sql10,userId, function(err, result10){
														var sql11 = "UPDATE notifications SET status='Checked' WHERE accID = ?";
														db.query(sql11,userId, function(err, result11){
															res.render('login_tournaments.ejs',{data:result,data1:result1,data2:result2, user: userId, message:message, lol:result4, dota:result5,  all:result7,num:result9,
																notif:result10});
														})
													})
												})
											})
										
									})
								})
							
						})
						})
				});
		} else if(req.query.sort=="hightolow") {
			
			if(req.session.message === undefined)
				req.session.message = "";
				var sql = "SELECT td.tdetID, td.TournamentID, td.TournaRange, td.TSched, td.Max_participants, td.registration_fee, td.Tpic,td.1stPrize as first, td.2ndPrize as second, td.TVenue, t.TournamentName, t.TournamentGame, t.tournaLB, t.tournaUB, rt.registeredteams, t.Status FROM tournament_details td INNER JOIN (SELECT * FROM tournaments) t ON t.TournamentID = td.TournamentID LEFT JOIN (SELECT COUNT(registeredteamID) AS registeredteams, SUM(Seed) AS seed, tournament_details.TournamentID FROM tournament_details LEFT JOIN registered_teams ON tournament_details.TournamentID = registered_teams.TournamentID WHERE Status = \"Approved\" GROUP BY TournamentID) rt ON td.TournamentID = rt.TournamentID WHERE t.Status = 'Open' AND td.TournamentID not in (SELECT rts.tournamentID FROM teampalak.registered_teams rts inner join teampalak.members mem on rts.registeredteamID = mem.teamID where MemID ="+userId+") order by registration_fee desc";
				db.query(sql, function(err, result){
					//console.log("Login Tournaments Team result 0");
					//console.log(result);
					var sql1 = "SELECT td.tdetID, td.TournamentID, td.TournaRange, td.TSched, td.Max_participants, td.registration_fee, td.Tpic, td.1stPrize as first, td.2ndPrize as second, td.TVenue, t.TournamentName, t.TournamentGame, t.tournaLB, t.tournaUB, rt.registeredteams, t.Status FROM tournament_details td INNER JOIN (SELECT * FROM tournaments) t ON t.TournamentID = td.TournamentID LEFT JOIN (SELECT COUNT(registeredteamID) AS registeredteams, SUM(Seed) AS seed, tournament_details.TournamentID FROM tournament_details LEFT JOIN registered_teams ON tournament_details.TournamentID = registered_teams.TournamentID WHERE Status = \"Approved\" GROUP BY TournamentID) rt ON td.TournamentID = rt.TournamentID WHERE t.Status = 'Open' AND td.TournamentID not in (SELECT rts.tournamentID FROM teampalak.registered_teams rts inner join teampalak.members mem on rts.registeredteamID = mem.teamID where MemID ="+userId+") order by registration_fee desc";
					db.query(sql1, function(err, result1){
						//console.log("Login Tournaments Team result 1");
						var sql2 = "SELECT td.tdetID, td.TournamentID, td.TournaRange, td.TSched, td.Max_participants, td.registration_fee, td.Tpic, td.1stPrize as first, td.2ndPrize as second, td.TVenue, t.TournamentName, t.TournamentGame, t.tournaLB, t.tournaUB, rt.registeredteams, t.Status FROM tournament_details td INNER JOIN (SELECT * FROM tournaments) t ON t.TournamentID = td.TournamentID LEFT JOIN (SELECT COUNT(registeredteamID) AS registeredteams, SUM(Seed) AS seed, tournament_details.TournamentID FROM tournament_details LEFT JOIN registered_teams ON tournament_details.TournamentID = registered_teams.TournamentID WHERE Status = \"Approved\" GROUP BY TournamentID) rt ON td.TournamentID = rt.TournamentID where TournamentGame like 'dota%' AND t.Status = 'Open' AND td.TournamentID not in (SELECT rts.tournamentID FROM teampalak.registered_teams rts inner join teampalak.members mem on rts.registeredteamID = mem.teamID where MemID ="+userId+") order by registration_fee desc";
						db.query(sql2, function(err, result2){
							//console.log("Login Tournaments Team result 2");
								var sql4 = "SELECT td.tdetID, td.TournamentID, td.TournaRange, td.TSched, td.Max_participants, td.registration_fee, td.Tpic, td.1stPrize as first, td.2ndPrize as second, td.TVenue, t.TournamentName, t.TournamentGame, t.tournaLB, t.tournaUB, rt.registeredteams, t.Status FROM tournament_details td INNER JOIN (SELECT * FROM tournaments) t ON t.TournamentID = td.TournamentID LEFT JOIN (SELECT COUNT(registeredteamID) AS registeredteams, SUM(Seed) AS seed, tournament_details.TournamentID FROM tournament_details LEFT JOIN registered_teams ON tournament_details.TournamentID = registered_teams.TournamentID WHERE Status = \"Approved\" GROUP BY TournamentID) rt ON td.TournamentID = rt.TournamentID where TournamentGame like \'lol%\' AND t.Status = 'Open' AND td.TournamentID not in (SELECT rts.tournamentID FROM teampalak.registered_teams rts inner join teampalak.members mem on rts.registeredteamID = mem.teamID where MemID ="+userId+") order by registration_fee desc";
								db.query(sql4, function(err, result4){
									//console.log("Login Tournaments Team result 4");
									var sql5 = "SELECT td.tdetID, td.TournamentID, td.TournaRange, td.TSched, td.Max_participants, td.registration_fee, td.Tpic, td.1stPrize as first, td.2ndPrize as second, t.TournamentName, t.TournamentGame, t.tournaLB, t.tournaUB, rt.registeredteams, t.Status FROM tournament_details td INNER JOIN (SELECT * FROM tournaments) t ON t.TournamentID = td.TournamentID LEFT JOIN (SELECT COUNT(registeredteamID) AS registeredteams, SUM(Seed) AS seed, tournament_details.TournamentID FROM tournament_details LEFT JOIN registered_teams ON tournament_details.TournamentID = registered_teams.TournamentID WHERE Status = \"Approved\" GROUP BY TournamentID) rt ON td.TournamentID = rt.TournamentID where TournamentGame like \'cs%\' AND t.Status = 'Open' AND td.TournamentID not in (SELECT rts.tournamentID FROM teampalak.registered_teams rts inner join teampalak.members mem on rts.registeredteamID = mem.teamID where MemID ="+userId+") order by registration_fee desc";
									db.query(sql5, function(err, result5){
										//console.log("Login Tournaments Team result 5");
										
											var sql7 = "SELECT tournaments.TournamentID as tournaID, TournamentGame, count(*) as Numbers FROM teampalak.registered_teams inner join teampalak.tournaments on teampalak.registered_teams.TournamentID = tournaments.TournamentID GROUP BY tournaments.TournamentID";
											db.query(sql7, function(err, result7){
												var sql9 = "select message from teampalak.notifications where status = 'unchecked' AND accID = ?";
												db.query(sql9,userId, function(err, result9){
													var sql10 = "select message, status from teampalak.notifications where accID = ?";
													db.query(sql10,userId, function(err, result10){
														var sql11 = "UPDATE notifications SET status='Checked' WHERE accID = ?";
														db.query(sql11,userId, function(err, result11){
															res.render('login_tournaments.ejs',{data:result,data1:result1,data2:result2, user: userId, message:message, lol:result4, dota:result5,  all:result7,num:result9,
																notif:result10});
														})
													})
												})
											})
										
									})
								})
							
						})
						})
				});
		} else if(req.query.search) {
			if(req.session.message === undefined)
				req.session.message = "";
				var sql = "SELECT td.tdetID, td.TournamentID, td.TournaRange, td.TSched, td.Max_participants, td.registration_fee, td.Tpic, td.1stPrize as first, td.2ndPrize as second, td.TVenue, t.TournamentName, t.TournamentGame, t.tournaLB, t.tournaUB, rt.registeredteams, t.Status FROM tournament_details td INNER JOIN (SELECT * FROM tournaments) t ON t.TournamentID = td.TournamentID LEFT JOIN (SELECT COUNT(registeredteamID) AS registeredteams, SUM(Seed) AS seed, tournament_details.TournamentID FROM tournament_details LEFT JOIN registered_teams ON tournament_details.TournamentID = registered_teams.TournamentID WHERE Status = \"Approved\" GROUP BY TournamentID) rt ON td.TournamentID = rt.TournamentID WHERE t.Status = 'Open' and t.TournamentName like '%"+req.query.search+"%' AND td.TournamentID not in (SELECT rts.tournamentID FROM teampalak.registered_teams rts inner join teampalak.members mem on rts.registeredteamID = mem.teamID where MemID ="+userId+") order by TSched desc";
				db.query(sql, function(err, result){
					//console.log("Login Tournaments Team result 0");
					//console.log(result);
					var sql1 = "SELECT td.tdetID, td.TournamentID, td.TournaRange, td.TSched, td.Max_participants, td.registration_fee, td.Tpic, td.1stPrize as first, td.2ndPrize as second, td.TVenue, t.TournamentName, t.TournamentGame, t.tournaLB, t.tournaUB, rt.registeredteams, t.Status FROM tournament_details td INNER JOIN (SELECT * FROM tournaments) t ON t.TournamentID = td.TournamentID LEFT JOIN (SELECT COUNT(registeredteamID) AS registeredteams, SUM(Seed) AS seed, tournament_details.TournamentID FROM tournament_details LEFT JOIN registered_teams ON tournament_details.TournamentID = registered_teams.TournamentID WHERE Status = \"Approved\" GROUP BY TournamentID) rt ON td.TournamentID = rt.TournamentID WHERE t.Status = 'Open' and t.TournamentName like '%"+req.query.search+"%' AND td.TournamentID not in (SELECT rts.tournamentID FROM teampalak.registered_teams rts inner join teampalak.members mem on rts.registeredteamID = mem.teamID where MemID ="+userId+") order by TSched desc";
					db.query(sql1, function(err, result1){
						//console.log("Login Tournaments Team result 1");
						var sql2 = "SELECT td.tdetID, td.TournamentID, td.TournaRange, td.TSched, td.Max_participants, td.registration_fee, td.Tpic, td.1stPrize as first, td.2ndPrize as second, td.TVenue, t.TournamentName, t.TournamentGame, t.tournaLB, t.tournaUB, rt.registeredteams, t.Status FROM tournament_details td INNER JOIN (SELECT * FROM tournaments) t ON t.TournamentID = td.TournamentID LEFT JOIN (SELECT COUNT(registeredteamID) AS registeredteams, SUM(Seed) AS seed, tournament_details.TournamentID FROM tournament_details LEFT JOIN registered_teams ON tournament_details.TournamentID = registered_teams.TournamentID WHERE Status = \"Approved\" GROUP BY TournamentID) rt ON td.TournamentID = rt.TournamentID where TournamentGame like 'dota%' AND t.Status = 'Open' and t.TournamentName like '%"+req.query.search+"%' AND td.TournamentID not in (SELECT rts.tournamentID FROM teampalak.registered_teams rts inner join teampalak.members mem on rts.registeredteamID = mem.teamID where MemID ="+userId+") order by TSched desc";
						db.query(sql2, function(err, result2){
							//console.log("Login Tournaments Team result 2");
								var sql4 = "SELECT td.tdetID, td.TournamentID, td.TournaRange, td.TSched, td.Max_participants, td.registration_fee, td.Tpic, td.1stPrize as first, td.2ndPrize as second, td.TVenue, t.TournamentName, t.TournamentGame, t.tournaLB, t.tournaUB, rt.registeredteams, t.Status FROM tournament_details td INNER JOIN (SELECT * FROM tournaments) t ON t.TournamentID = td.TournamentID LEFT JOIN (SELECT COUNT(registeredteamID) AS registeredteams, SUM(Seed) AS seed, tournament_details.TournamentID FROM tournament_details LEFT JOIN registered_teams ON tournament_details.TournamentID = registered_teams.TournamentID WHERE Status = \"Approved\" GROUP BY TournamentID) rt ON td.TournamentID = rt.TournamentID where TournamentGame like \'lol%\' AND t.Status = 'Open' and t.TournamentName like '%"+req.query.search+"%' AND td.TournamentID not in (SELECT rts.tournamentID FROM teampalak.registered_teams rts inner join teampalak.members mem on rts.registeredteamID = mem.teamID where MemID ="+userId+") order by TSched desc";
								db.query(sql4, function(err, result4){
									//console.log("Login Tournaments Team result 4");
									var sql5 = "SELECT td.tdetID, td.TournamentID, td.TournaRange, td.TSched, td.Max_participants, td.registration_fee, td.Tpic, td.1stPrize as first, td.2ndPrize as second, td.TVenue, t.TournamentName, t.TournamentGame, t.tournaLB, t.tournaUB, rt.registeredteams, t.Status FROM tournament_details td INNER JOIN (SELECT * FROM tournaments) t ON t.TournamentID = td.TournamentID LEFT JOIN (SELECT COUNT(registeredteamID) AS registeredteams, SUM(Seed) AS seed, tournament_details.TournamentID FROM tournament_details LEFT JOIN registered_teams ON tournament_details.TournamentID = registered_teams.TournamentID WHERE Status = \"Approved\" GROUP BY TournamentID) rt ON td.TournamentID = rt.TournamentID where TournamentGame like \'cs%\' AND t.Status = 'Open' and t.TournamentName like '%"+req.query.search+"%' AND td.TournamentID not in (SELECT rts.tournamentID FROM teampalak.registered_teams rts inner join teampalak.members mem on rts.registeredteamID = mem.teamID where MemID ="+userId+") order by TSched desc";
									db.query(sql5, function(err, result5){
										//console.log("Login Tournaments Team result 5");
										
											var sql7 = "SELECT tournaments.TournamentID as tournaID, TournamentGame, count(*) as Numbers FROM teampalak.registered_teams inner join teampalak.tournaments on teampalak.registered_teams.TournamentID = tournaments.TournamentID GROUP BY tournaments.TournamentID";
											db.query(sql7, function(err, result7){
												var sql9 = "select message from teampalak.notifications where status = 'unchecked' AND accID = ?";
												db.query(sql9,userId, function(err, result9){
													var sql10 = "select message, status from teampalak.notifications where accID = ?";
													db.query(sql10,userId, function(err, result10){
														var sql11 = "UPDATE notifications SET status='Checked' WHERE accID = ?";
														db.query(sql11,userId, function(err, result11){
															res.render('login_tournaments.ejs',{data:result,data1:result1,data2:result2, user: userId, message:message, lol:result4, dota:result5,  all:result7,num:result9,
																notif:result10});
														})
													})
												})
											})
										
									})
								})
							
						})
						})
				});
		} else {
			if(req.session.message === undefined)
				req.session.message = "";
				var sql = "SELECT td.tdetID, td.TournamentID, td.TournaRange, td.TSched, td.Max_participants, td.registration_fee, td.Tpic, td.1stPrize as first, td.2ndPrize as second, td.TVenue, t.TournamentName, t.TournamentGame, t.tournaLB, t.tournaUB, rt.registeredteams, t.Status FROM tournament_details td INNER JOIN (SELECT * FROM tournaments) t ON t.TournamentID = td.TournamentID LEFT JOIN (SELECT COUNT(registeredteamID) AS registeredteams, SUM(Seed) AS seed, tournament_details.TournamentID FROM tournament_details LEFT JOIN registered_teams ON tournament_details.TournamentID = registered_teams.TournamentID WHERE Status = \"Approved\" GROUP BY TournamentID) rt ON td.TournamentID = rt.TournamentID WHERE t.Status = 'Open' AND td.TournamentID not in (SELECT rts.tournamentID FROM teampalak.registered_teams rts inner join teampalak.members mem on rts.registeredteamID = mem.teamID where MemID ="+userId+") order by TSched desc";
				db.query(sql, function(err, result){
					var sql1 = "SELECT td.tdetID, td.TournamentID, td.TournaRange, td.TSched, td.Max_participants, td.registration_fee, td.Tpic, td.1stPrize as first, td.2ndPrize as second, td.TVenue, t.TournamentName, t.TournamentGame, t.tournaLB, t.tournaUB, rt.registeredteams, t.Status FROM tournament_details td INNER JOIN (SELECT * FROM tournaments) t ON t.TournamentID = td.TournamentID LEFT JOIN (SELECT COUNT(registeredteamID) AS registeredteams, SUM(Seed) AS seed, tournament_details.TournamentID FROM tournament_details LEFT JOIN registered_teams ON tournament_details.TournamentID = registered_teams.TournamentID WHERE Status = \"Approved\" GROUP BY TournamentID) rt ON td.TournamentID = rt.TournamentID WHERE t.Status = 'Open' AND td.TournamentID not in (SELECT rts.tournamentID FROM teampalak.registered_teams rts inner join teampalak.members mem on rts.registeredteamID = mem.teamID where MemID ="+userId+") order by TSched desc";
					db.query(sql1, function(err, result1){
						var sql2 = "SELECT td.tdetID, td.TournamentID, td.TournaRange, td.TSched, td.Max_participants, td.registration_fee, td.Tpic, td.1stPrize as first, td.2ndPrize as second, td.TVenue, t.TournamentName, t.TournamentGame, t.tournaLB, t.tournaUB, rt.registeredteams, t.Status FROM tournament_details td INNER JOIN (SELECT * FROM tournaments) t ON t.TournamentID = td.TournamentID LEFT JOIN (SELECT COUNT(registeredteamID) AS registeredteams, SUM(Seed) AS seed, tournament_details.TournamentID FROM tournament_details LEFT JOIN registered_teams ON tournament_details.TournamentID = registered_teams.TournamentID WHERE Status = \"Approved\" GROUP BY TournamentID) rt ON td.TournamentID = rt.TournamentID where TournamentGame like 'dota%' AND t.Status = 'Open' AND td.TournamentID not in (SELECT rts.tournamentID FROM teampalak.registered_teams rts inner join teampalak.members mem on rts.registeredteamID = mem.teamID where MemID ="+userId+") order by TSched desc";
						db.query(sql2, function(err, result2){
								var sql4 = "SELECT td.tdetID, td.TournamentID, td.TournaRange, td.TSched, td.Max_participants, td.registration_fee, td.Tpic, td.1stPrize as first, td.2ndPrize as second, td.TVenue, t.TournamentName, t.TournamentGame, t.tournaLB, t.tournaUB, rt.registeredteams, t.Status FROM tournament_details td INNER JOIN (SELECT * FROM tournaments) t ON t.TournamentID = td.TournamentID LEFT JOIN (SELECT COUNT(registeredteamID) AS registeredteams, SUM(Seed) AS seed, tournament_details.TournamentID FROM tournament_details LEFT JOIN registered_teams ON tournament_details.TournamentID = registered_teams.TournamentID WHERE Status = \"Approved\" GROUP BY TournamentID) rt ON td.TournamentID = rt.TournamentID where TournamentGame like \'lol%\' AND t.Status = 'Open' AND td.TournamentID not in (SELECT rts.tournamentID FROM teampalak.registered_teams rts inner join teampalak.members mem on rts.registeredteamID = mem.teamID where MemID ="+userId+") order by TSched desc";
								db.query(sql4, function(err, result4){
									var sql5 = "SELECT td.tdetID, td.TournamentID, td.TournaRange, td.TSched, td.Max_participants, td.registration_fee, td.Tpic, td.1stPrize as first, td.2ndPrize as second, td.TVenue, t.TournamentName, t.TournamentGame, t.tournaLB, t.tournaUB, rt.registeredteams, t.Status FROM tournament_details td INNER JOIN (SELECT * FROM tournaments) t ON t.TournamentID = td.TournamentID LEFT JOIN (SELECT COUNT(registeredteamID) AS registeredteams, SUM(Seed) AS seed, tournament_details.TournamentID FROM tournament_details LEFT JOIN registered_teams ON tournament_details.TournamentID = registered_teams.TournamentID WHERE Status = \"Approved\" GROUP BY TournamentID) rt ON td.TournamentID = rt.TournamentID where TournamentGame like \'cs%\' AND t.Status = 'Open' AND td.TournamentID not in (SELECT rts.tournamentID FROM teampalak.registered_teams rts inner join teampalak.members mem on rts.registeredteamID = mem.teamID where MemID ="+userId+") order by TSched desc";
									db.query(sql5, function(err, result5){
											var sql7 = "SELECT tournaments.TournamentID as tournaID, TournamentGame, count(*) as Numbers FROM teampalak.registered_teams inner join teampalak.tournaments on teampalak.registered_teams.TournamentID = tournaments.TournamentID GROUP BY tournaments.TournamentID";
											db.query(sql7, function(err, result7){
													var sql9 = "select message from teampalak.notifications where status = 'unchecked' AND accID = ?";
												db.query(sql9,userId, function(err, result9){
													var sql10 = "select message, status from teampalak.notifications where accID = ?";
													db.query(sql10,userId, function(err, result10){
														var sql11 = "UPDATE notifications SET status='Checked' WHERE accID = ?";
														db.query(sql11,userId, function(err, result11){
															res.render('login_tournaments.ejs',{data:result,data1:result1,data2:result2, user: userId, message:message, lol:result4, dota:result5,  all:result7,num:result9,notif:result10});
														})
													})
												})
											})
										
									})
								})
							
						})
						})
				});
		}
		};
//==========================| User Profile |=============================
exports.userProfile = function(req, res, next) {
	var user = req.session.user,
		userId = req.session.userID;
	var name = "";
	var team = "";
	var imageProfile = "";

	if (user == null) {
		res.redirect("/login");
		return;
	} else {
		//Change database personal_info ID to auto incremtent
		db.query('SELECT * FROM teampalak.accounts acc where acc.username = ?', user, function(err, result, fields) {
			var s = `SELECT * FROM teampalak.members m 
			inner join teampalak.teams t ON t.TeamID = m.TeamID 
			Inner join teampalak.accounts a ON a.AccID = m.MemID where a.username = ?`;
			db.query(s, user, function(err, rows1, fields) {
				name = result[0].Firstname +" "+ result[0].Lastname;
				let sql = `SELECT * FROM teampalak.registered_teams r
				INNER JOIN teampalak.tournaments t ON r.TournamentID = t.TournamentID 
				INNER JOIN teampalak.tournament_details tou ON  tou.TournamentID = t.TournamentID 
				INNER JOIN teampalak.accounts a INNER JOIN teampalak.teams te ON te.TeamID = a.AccID where a.username = ? AND t.Status = "closed" `;
				let data = [user];
					db.query(sql, data, function(err, rows, fields){
						var sql1 = "SELECT InGameName, Game FROM `gameaccounts` WHERE Username = ?";
      					db.query(sql1, user, function(err, row2, fields){ 
      						var regTour = `select DISTINCT td.tdetID, td.TournamentID, td.TournaRange, td.TSched, td.Max_participants, td.registration_fee, 
      						td.Tpic, td.1stPrize as first, td.2ndPrize as second, td.TVenue, t.TournamentName, t.TournamentGame, t.tournaLB, t.tournaUB, 
      						rt.registeredteams, t.Status from teampalak.registered_teams r inner join teampalak.members m on r.registeredteamid = m.teamid 
      						inner join teampalak.teams te on r.registeredteamid = te.teamid inner join teampalak.accounts acc on m.memid = acc.accid 
      						left join teampalak.gameaccounts gacc on gacc.username = acc.username  left join teampalak.tournaments t on r.tournamentID = t.tournamentID 
      						inner join teampalak.tournament_details td on r.tournamentID = td.tournamentID left join (SELECT COUNT(registeredteamID) AS registeredteams, 
      						SUM(Seed) AS seed, tournament_details.TournamentID FROM tournament_details left JOIN registered_teams 
      						ON tournament_details.TournamentID = registered_teams.TournamentID WHERE Status = 'Approved' GROUP BY TournamentID) rt 
      						ON td.TournamentID = rt.TournamentID  where td.TournamentID  in (SELECT rts.tournamentID FROM teampalak.registered_teams 
      						rts inner join teampalak.members mem on rts.registeredteamID = mem.teamID where MemID =`+userId+`) And t.Status = 'Open' order by TSched desc `;
						db.query(regTour,user, function(err, rows2, fields){
							var sql2=`SELECT tournaments.TournamentID as tournaID, TournamentGame, count(*) as Numbers FROM teampalak.registered_teams inner join teampalak.tournaments on teampalak.registered_teams.TournamentID = tournaments.TournamentID GROUP BY tournaments.TournamentID`;
							db.query(sql2,user, function(err, rows3, fields){
								var sql3 = `SELECT t.TournamentID AS TournamentID, t.TournamentName AS TournamentName, 
								t.TournamentGame AS TournamentGame, td.TournaRange AS TournaRange, t.Status AS Status, 
								DATE_FORMAT(td.TSched,"%M %d, %Y") AS tDate, DATE_FORMAT(td.TSched,"%l:%i %p") AS tTime, 
								td.Max_participants AS Max_participants, td.TVenue AS TVenue, REPLACE(FORMAT(td.registration_fee, 2), ",", "") 
								AS registration_fee, LENGTH(td.Tpic) AS Tpiclength, rt.registeredteams AS registeredteamID FROM tournament_details 
								td INNER JOIN (SELECT TournamentID, TournamentName, TournamentGame, Status FROM tournaments) t  
								ON t.TournamentID = td.TournamentID LEFT JOIN (SELECT COUNT(registeredteamID) AS registeredteams, 
								tournament_details.TournamentID FROM tournament_details LEFT JOIN registered_teams ON 
								tournament_details.TournamentID = registered_teams.TournamentID WHERE Status = "Approved" GROUP BY TournamentID) 
								rt ON td.TournamentID = rt.TournamentID`;
								db.query(sql3,user, function(err, rows4, fields){
									var sql9 = "select message from teampalak.notifications where status = 'unchecked' AND accID = ?";
									db.query(sql9,userId, function(err, result9){
										var sql10 = "select message, status from teampalak.notifications where accID = ?";
										db.query(sql10,userId, function(err, result10){
											var sql11 = "UPDATE notifications SET status='Checked' WHERE accID = ?";
											db.query(sql11,userId, function(err, result11){
												res.render('userProfile.ejs', {
																user: user,
																name: name,
																data: result,
																data1: rows1,
																ctr: rows,
																data2: row2,
																ctr1: rows2,
																ctr2: rows3,
																ctr3: rows4,
																num:result9,
																notif:result10
													});
												});
											});
										});
									});
								});
							});
						});
					});
			});
		});
	}
};

//==========================| Edit profile |=============================

exports.editProfile = function(req, res) {
	var user = req.session.user,
		userId = req.session.userID;
	var message = "";
  	var message1 = '';
  	var message2 = '';
	var message3 = '';
	
	if (user == null) {
		res.redirect("/login");
		return;
	} else {
		var query = "SELECT * FROM accounts WHERE username = ?";
		db.query(query, user, function(err, rows, fields) {
			var sql = "SELECT InGameName, Game FROM `gameaccounts` WHERE Username = ?";
      		db.query(sql, user, function(err, row, fields){ 
      			var sql9 = "select message from teampalak.notifications where status = 'unchecked' AND accID = ?";
				db.query(sql9,userId, function(err, result9){
					var sql10 = "select message, status from teampalak.notifications where accID = ?";
					db.query(sql10,userId, function(err, result10){
						var sql11 = "UPDATE notifications SET status='Checked' WHERE accID = ?";
						db.query(sql11,userId, function(err, result11){
			if (rows.length > 0) {
				if ((req.body.newPwd && req.body.conPwd) !== "") {
					//console.log("pasok");
					
					if (req.body.newPwd != req.body.conPwd) {
						var message = "Passwords do not match.";
						res.render('editProfile',{user: user, message: message,message1: message1,message2: message2,message3: message3, data: row,num:result9,notif:result10});
					} else {
						let sql = 'UPDATE accounts SET Password = ? WHERE Username = ?';
						let hash = bcrypt.hashSync(req.body.conPwd, 10);
						let data = [hash, user];
						db.query(sql, data, function(err, result){
							//console.log(result);
							var message = "Successfully Changed"
							res.render('editProfile',{user: user, message: message,message1: message1,message2: message2,message3: message3, data: row,num:result9,notif:result10});
						});
					}
				}else{
					//console.log("NUll siya");
					if ((req.body.newPwd && req.body.conPwd) == "") {
						if ((req.body.newPwd == "") && (req.body.conPwd !== "")) {
						var message = "New Passwords is empty.";
						res.render('editProfile',{user: user, message: message,message1: message1,message2: message2,message3: message3, data: row,num:result9,notif:result10});
						}else if ((req.body.newPwd !== "") && (req.body.conPwd == "")){
							var message = "Confirm Passwords is empty.";
							res.render('editProfile',{user: user, message: message,message1: message1,message2: message2,message3: message3, data: row,num:result9,notif:result10});
						}else{
							var message = "";
							res.render('editProfile',{user: user, message: message,message1: message1,message2: message2,message3: message3, data: row,num:result9,notif:result10});
						}
					}
				}
			} 
				});
				});
			});
			});
		});
		
	}
};


//==========================| Upload profile picture|=============================

exports.uploadProfile = function(req, res) {
	var user = req.session.user,
		userId = req.session.userId;
	var message = "";
  	var message1 = '';
  	var message2 = '';
	var message3 = '';  
	var fs = require('fs');
	var FileReader = require('filereader');
	var path = require('path');

	if (user == null) {
		res.redirect("/login");
		return;
	} else {
		var query = "SELECT * FROM accounts WHERE username = ?";
		db.query(query, user, function(err, rows, fields) {
			var sql = "SELECT InGameName, Game FROM `gameaccounts` WHERE Username = ?";
      		db.query(sql, user, function(err, row, fields){
      			var sql9 = "select message from teampalak.notifications where status = 'unchecked' AND accID = ?";
				db.query(sql9,userId, function(err, result9){
					var sql10 = "select message, status from teampalak.notifications where accID = ?";
					db.query(sql10,userId, function(err, result10){
						var sql11 = "UPDATE notifications SET status='Checked' WHERE accID = ?";
						db.query(sql11,userId, function(err, result11){

			if (rows.length > 0) {
				if (req.body.fileToUpload) {
					var image = fs.readFileSync(path.resolve(__dirname, "../upload/" + req.body.fileToUpload));
					var filetype = path.extname(req.body.fileToUpload);

				    if(filetype == '.jpg' || filetype == '.png' || filetype == '.jpeg') {
					  var sql = "UPDATE accounts SET Image = ? WHERE username = ?";
				      db.query(sql,[image, user], function(err, rows, fields){
						  var message3 = "Successfully Updated Profile Picture";
						  res.render('editProfile',
							{
								user: user, 
								message: message,
								message1: message1,
								message2: message2,
								message3: message3, 
								data: row,
								num:result9,
								notif:result10
							});
				      });
				    } else {
				      response.send("<script type='text/javascript'>alert('Invalid image.'); window.location.replace(\"/editProfile\");</script>");
				    }
				  } else {
				    db.query("UPDATE accounts SET Image = ? WHERE username = ?", [image, user], function(err, rows, fields){
				      	res.redirect('/editProfile');
				      });
				  }
			} 
			
						});
					});
				});
			});
		});
		
	}
};

//==========================| Change In Game Name lol |=============================
exports.changeInGameNameLol = function(req, res) {
	var user = req.session.user,
		userId = req.session.userId;
	var message = '';
  	var message1 = '';
	var message2 = '';
	var message3 = '';

	if (user == null) {
		res.redirect("/login");
		return;
	} else {
		var query = "SELECT * FROM accounts WHERE username = ?";
		db.query(query, user, function(err, rows, fields) {
			var sql = "SELECT InGameName, Game FROM `gameaccounts` WHERE Username = ?";
      		db.query(sql, user, function(err, row, fields){ 
      			var sql9 = "select message from teampalak.notifications where status = 'unchecked' AND accID = ?";
				db.query(sql9,userId, function(err, result9){
					var sql10 = "select message, status from teampalak.notifications where accID = ?";
					db.query(sql10,userId, function(err, result10){
						var sql11 = "UPDATE notifications SET status='Checked' WHERE accID = ?";
						db.query(sql11,userId, function(err, result11){
			if (rows.length > 0) {
				if (req.body.lol !== "") {
					//console.log("pasok");
					var sql1 = "SELECT InGameName, Game FROM `gameaccounts` WHERE Username = ? AND Game = 'LoL'";
					db.query(sql1, user, function(err, result1, fields){
						if (result1 == 0) {
							var query = "SELECT * FROM teampalak.gameaccounts WHERE inGameName = ?";
						db.query(query, [req.body.lol], function(err, rows, fields) {
							//console.log(rows[0]);
							if (rows.length > 0) {
								var message1 = "League of Legends game account is already taken.";
									res.render('editProfile',
							          {
							            user: user, 
							            message: message,
							            message1: message1,
										message2: message2,
										message3: message3, 
							            data: rows
							          });
							} else {
								var apikey = "select mapi.api_key from teampalak.api_key mapi where apiId = (SELECT max(m.apiId) FROM teampalak.api_key m)";
								db.query(apikey, function(err, maxapi){
									//console.log(err);
									//console.log(maxapi);
									//console.log("max api = "+maxapi[0].api_key);
									var key = maxapi[0].api_key;
									//console.log("api key = "+key);
									var RiotRequest = require('riot-lol-api');
									var riotRequest = new RiotRequest(key);
									var sName = req.body.lol; //ingame name of summoner
									var version = "4";
									//var matchID = "3007889758";
									riotRequest.request('na1', 'summoner', '/lol/summoner/v'+version+'/summoners/by-name/'+sName,
										function(err, data) {
											if(err=== null){
												var sID = data.id;
												var aID = data.accountId;
												riotRequest.request('na1', 'league','/lol/league/v'+version+'/entries/by-summoner/'+sID,
												function(err, data) {
													var rank = data[0].tier +" "+ data[0].rank;
													var rankTier = data[0].tier;
													var rankDiv = data[0].rank;
													var rankLP = data[0].leaguePoints;
													var mmr = convertRank(rankTier,rankDiv,rankLP);
													
														var sql = "INSERT INTO teampalak.gameaccounts (username,game,inGameName,summonerOrDotaID,steamOrAccountID,rank,mmr) VALUES ('"+user+"','lol','"+sName+"','"+sID+"','"+aID+"','"+rank+"','"+mmr+"')";
														db.query(sql, function (err, result) {
														if (err) throw err;
															//console.log(sName+","+sID+","+aID+","+rank+","+mmr+" has been logged");
															var sql2 = "SELECT InGameName, Game FROM `gameaccounts` WHERE Username = ?";
															db.query(sql2, user, function(err, row, fields){ 
							      								var message1 = "Successfully added account";
																res.render('editProfile',{user: user, message: message,message1: message1,message2: message2,message3: message3, data: row});
															});
														});
												});
							
											}else if (err){
												//console.log(err.status);
												var message1 = "Please contact the admin.";
												res.render('editProfile',{user: user, message: message,message1: message1,message2: message2,message3: message3, data: row});
											}
									})
									
									function convertRank(rankTier,rankDiv,rankLP){
										var tierNum=0,divNum=0;
									
										switch(rankDiv){
											case 'I':
												divNum = 4;
												break;
											case 'II':
												divNum = 3;
												break;
											case 'III':
												divNum = 2;
												break;
											case 'IV':
												divNum = 1;
												break;
										}
	
										switch(rankTier){
											case "IRON":
												tierNum = 1;
												break;
											case "BRONZE":
												tierNum = 2;
												break;
											case "SILVER":
												tierNum = 3;
												break;
											case "GOLD":
												tierNum = 4;
												break;
											case "PLATINUM":
												tierNum = 5;
												break;
											case "DIAMOND":
												tierNum = 6;
												break;
											case "MASTER":
												tierNum = 7;
												break;
											case "GRANDMASTER":
												tierNum = 8;
												divNum = '';
												break;
											case "CHALLENGER":
												if(rankLP>999){
													tierNum = 1;
													divNum = '';
												}else{
													tierNum = 9;
													divNum = '';
												}
												break;
											default:
												tierNum = 0;
												break;
										}
	
										if(rankLP<10){
											rankLP = "0"+rankLP;
										}
	
										var matchmakingRank = tierNum+''+divNum+''+rankLP;
										return matchmakingRank;
									}
								})
							}
						});	
						}else{
							var update = "UPDATE gameaccounts SET InGameName = ? WHERE Username = ?";
							db.query(update,[req.body.lol,user],function(err,update,fields){
								var sql = "SELECT InGameName, Game FROM `gameaccounts` WHERE Username = ?";
      							db.query(sql, user, function(err, row, fields){ 
      								var message1 = "Successfully Updated In Game Name";
									res.render('editProfile',{user: user, message: message,message1: message1,message2: message2,message3: message3, data: row});
								});
							});
						}
					});
				}else{
					//console.log("NUll siya");
					if (req.body.lol == "") {
						if (req.body.lol == "") {
						var message1 = "League of Legend In Game Name is empty.";
						res.render('editProfile',{user: user, message: message,message1: message1,message2: message2,message3: message3, data: row});
						}else{
							var message1 = "";
							res.render('editProfile',{user: user, message: message,message1: message1,message2: message2,message3: message3, data: row});
						}
					}
				}
			} 
						});
					});
				});
			});
		});
	}
};

//==========================| Change In Game Name dota 2 |=============================
exports.changeInGameNameDota2 = function(req, res) {
	var user = req.session.user,
		userId = req.session.userId;
	var message = '';
  	var message1 = '';
  	var message2 = '';
	var message3 = '';

	if (user == null) {
		res.redirect("/login");
		return;
	} else {
		var query = "SELECT * FROM accounts WHERE username = ?";
		db.query(query, user, function(err, rows, fields) {
			var sql = "SELECT InGameName, Game FROM `gameaccounts` WHERE Username = ?";
      		db.query(sql, user, function(err, row, fields){ 
      			var sql9 = "select message from teampalak.notifications where status = 'unchecked' AND accID = ?";
				db.query(sql9,userId, function(err, result9){
					var sql10 = "select message, status from teampalak.notifications where accID = ?";
					db.query(sql10,userId, function(err, result10){
						var sql11 = "UPDATE notifications SET status='Checked' WHERE accID = ?";
						db.query(sql11,userId, function(err, result11){
			if (rows.length > 0) {
				if (req.body.dota2 !== "") {
					//console.log("pasok");
					var message2 = "pasok";
					var sql1 = "SELECT InGameName, Game FROM `gameaccounts` WHERE Username = ? AND Game = 'Dota 2'";
					db.query(sql1, user, function(err, result1, fields){
						if (result1 == 0) {
							//console.log(result1);
							//console.log("result1");
							var query = "SELECT * FROM teampalak.gameaccounts WHERE summonerOrDotaID = ?";
							db.query(query, [req.body.dota2], function(err, rowse, fields) {
								if (rowse.length > 0) {
									var message2 = "Dota 2 account is already taken.";
									res.render('editProfile',
							          {
							            user: user, 
							            message: message,
							            message1: message1,
										message2: message2,
										message3: message3,
							            data: rows
							          });
								} else {
									const request = require('request');
									const dota2APi = require('dota2-api');
									
									var dotaID = req.body.dota2;
									var api_key = "425f6993-d600-4f13-8fd3-5647f095dbc0";
									var rank;					
									
									request('https://api.opendota.com/api/players/'+dotaID+'?api_key='+api_key, { json: true }, (err, ress, body) => {
										if (err) { return console.log(err); }
										var mmr_estimate = body.mmr_estimate.estimate;
										if(mmr_estimate===undefined){
											var message2 = "Please enter a different account as the mmr of this account is undefined";
											res.render('editProfile',
									          {
									            user: user, 
									            message: message,
									            message1: message1,
												message2: message2,
												message3: message3, 
									            data: rows
									          });
										}else{
											rank = body.rank_tier;
									
											var steamID = body.profile.steamid;
											var ign = body.profile.personaname;
										
											var ranks = convertRank();
											db.connect(function(err) {
											if (err) throw err;
												var sql = "INSERT INTO teampalak.gameaccounts (username,game,inGameName,summonerOrDotaID,steamOrAccountID,rank,mmr) VALUES ('"+user+"','dota 2','"+ign+"','"+dotaID+"','"+steamID+"','"+ranks+"','"+mmr_estimate+"')";
												db.query(sql, function (err, result) {
												if (err) throw err;
													//console.log(ign+","+dotaID+","+steamID+","+ranks+","+mmr_estimate+" has been logged");
												var message2 = "Successfully added account"
												var sql2 = "SELECT InGameName, Game FROM `gameaccounts` WHERE Username = ?";
													db.query(sql2, user, function(err, row, fields){ 
					      								var message2 = "Successfully added account";
														res.render('editProfile',{user: user, message: message,message1: message1,message2: message2,message3: message3, data: row});
													});
												});
											});
										}
									});
									
									function convertRank(){
										var rankTier = Math.trunc(rank/10);
										var rankDiv = rank%10;
									
										switch(rankTier) {
											case 1:
												rankTier = "Herald";
											break;
											case 2:
												rankTier = "Guardian";
											break;
											case 3:
												rankTier = "Crusader";
											break;
											case 4:
												rankTier = "Archon";
											break;
											case 5:
												rankTier = "Legend";
											break;
											case 6:
												rankTier = "Ancient";
											break;
											case 7:
												rankTier = "Divine";
											break;
											case 8:
												rankTier = "Immortal";
											break;
											default:
												rankTier = "Uncalibrated";
												break;
									}
									
										var rankTD = rankTier +" "+ rankDiv.toString()+" ";
										return rankTD;
									
									}
								}
							});	//end of code ni rey
						}else{
							var update = "UPDATE gameaccounts SET InGameName = ? WHERE Username = ?";
							db.query(update,[req.body.dota2,user],function(err,update,fields){
								var sql = "SELECT InGameName, Game FROM `gameaccounts` WHERE Username = ?";
      							db.query(sql, user, function(err, row, fields){ 
      								var message2 = "Successfully Updated In Game Name";
									res.render('editProfile',{user: user, message: message,message1: message1,message2: message2,message3: message3, data: row});
								});
							});
						}
					});
		
				}else{
					//console.log("NUll siya");
					if (req.body.dota2 == "") {
						if (req.body.dota2 == "") {
						var message2 = "Dota 2 In Game Name is empty.";
						res.render('editProfile',{user: user, message: message,message1: message1,message2: message2,message3: message3, data: row});
						}else{
							var message2 = "";
							res.render('editProfile',{user: user, message: message,message1: message1,message2: message2,message3: message3, data: row});
						}
					}
				}
			} 
						});
					});
				});
			});
		});
	}
};

//==========================| Team Registration |=============================
exports.registrations = async function(req, res) {
	var user = req.session.user,
		userId = req.session.userID;
        var get = req.query;
        var tname = get.tname;
		var tID = get.tid;
        var capname = get.capname;
        var memb1 = get.memb1;
        var memb2 = get.memb2;
        var memb3 = get.memb3;
		var memb4 = get.memb4;
		var messaageArray = [];
		var message = "";	
		var getcapt = `SELECT ga.ingamename,ga.rank,ga.mmr,t.tournalb,t.tournaub,td.tournarange FROM teampalak.gameaccounts ga 
		join teampalak.tournaments t inner join teampalak.tournament_details td on t.tournamentID = td.tournamentID 
		where (ga.username ="`+user+`" and ga.game = (SELECT t.tournamentgame FROM teampalak.tournaments t where t.tournamentid = `+tID+`)) and t.tournamentid = `+tID;
		var avgmmr = 0;
		db.query(getcapt, function(err, resultc){
			if(resultc.length==0){
				message = "Team Captain doesn't have a registered account for the game of the tournament.";
				messaageArray.push(message);
			}else if (resultc[0].mmr < resultc[0].tournalb){
				message = "Team Captain's rank("+resultc[0].rank+") is lower than the minimum rank required for the tournament ("+resultc[0].tournarange+").";
				messaageArray.push(message);
			}else if (resultc[0].mmr > resultc[0].tournaub){
				message = "Team Captain's rank("+resultc[0].rank+") is higher than the maximum rank required for the tournament ("+resultc[0].tournarange+").";
				messaageArray.push(message);
			}
			var sql1 = `SELECT acc.AccID,ga.rank,ga.mmr,t.tournalb,t.tournaub,td.tournarange FROM teampalak.gameaccounts ga 
			join teampalak.tournaments t 
			inner join teampalak.tournament_details td on t.tournamentID = td.tournamentID 
			inner join teampalak.accounts acc on ga.username = acc.username
			where (ga.ingamename ="`+memb1+`" and ga.game = (SELECT t.tournamentgame FROM teampalak.tournaments t where t.tournamentid = `+tID+`)) and t.tournamentid = `+tID;
			db.query(sql1, function(err, result){
				if(result.length==0){
					console.log("puta");
					message = "Member 1 is either unregistered or doesn't have a registered account for the game of the tournament.";
					messaageArray.push(message);
				}else if (result[0].mmr < result[0].tournalb){
					message = "Member 1's rank("+result[0].rank+") is lower than the minimum rank required for the tournament ("+result[0].tournarange+").";
					messaageArray.push(message);
				}else if (result[0].mmr > result[0].tournaub){
					message = "Member 1's rank("+result[0].rank+") is higher than the maximum rank required for the tournament ("+result[0].tournarange+").";
					messaageArray.push(message);
				}
				var sql111 = `SELECT acc.AccID,ga.rank,ga.mmr,t.tournalb,t.tournaub,td.tournarange FROM teampalak.gameaccounts ga 
				join teampalak.tournaments t 
				inner join teampalak.tournament_details td on t.tournamentID = td.tournamentID 
				inner join teampalak.accounts acc on ga.username = acc.username
				where (ga.ingamename ="`+memb2+`" and ga.game = (SELECT t.tournamentgame FROM teampalak.tournaments t where t.tournamentid = `+tID+`)) and t.tournamentid = `+tID;
				db.query(sql111, function(err, result1){
					if(result1.length==0){
						console.log("puta");
						message = "Member 2 is either unregistered or doesn't have a registered account for the game of the tournament.";
						messaageArray.push(message);
					}else if (result1[0].mmr < result1[0].tournalb){
						message = "Member 2's rank("+result1[0].rank+") is lower than the minimum rank required for the tournament ("+result1[0].tournarange+").";
						messaageArray.push(message);
					}else if (result1[0].mmr > result1[0].tournaub){
						message = "Member 2's rank("+result1[0].rank+") is higher than the maximum rank required for the tournament ("+result1[0].tournarange+").";
						messaageArray.push(message);
					}
					var sql2 = `SELECT acc.AccID,ga.rank,ga.mmr,t.tournalb,t.tournaub,td.tournarange FROM teampalak.gameaccounts ga 
					join teampalak.tournaments t 
					inner join teampalak.tournament_details td on t.tournamentID = td.tournamentID 
					inner join teampalak.accounts acc on ga.username = acc.username
					where (ga.ingamename ="`+memb3+`" and ga.game = (SELECT t.tournamentgame FROM teampalak.tournaments t where t.tournamentid = `+tID+`)) and t.tournamentid = `+tID;
					db.query(sql2, function(err, result2){
						if(result2.length==0){
							console.log("puta");
							message = "Member 3 is either unregistered or doesn't have a registered account for the game of the tournament.";
							messaageArray.push(message);
						}else if (result2[0].mmr < result2[0].tournalb){
							message = "Member 3's rank("+result2[0].rank+") is lower than the minimum rank required for the tournament ("+result2[0].tournarange+").";
							messaageArray.push(message);
						}else if (result2[0].mmr > result2[0].tournaub){
							message = "Member 3's rank("+result2[0].rank+") is higher than the maximum rank required for the tournament ("+result2[0].tournarange+").";
							messaageArray.push(message);
						}
						var sql3 = `SELECT acc.AccID,ga.rank,ga.mmr,t.tournalb,t.tournaub,td.tournarange FROM teampalak.gameaccounts ga 
						join teampalak.tournaments t 
						inner join teampalak.tournament_details td on t.tournamentID = td.tournamentID 
						inner join teampalak.accounts acc on ga.username = acc.username
						where (ga.ingamename ="`+memb4+`" and ga.game = (SELECT t.tournamentgame FROM teampalak.tournaments t where t.tournamentid = `+tID+`)) and t.tournamentid = `+tID;
						db.query(sql3, function(err, result3){
							if(result3.length==0){
								console.log("puta");
								message = "Member 4 is either unregistered or doesn't have a registered account for the game of the tournament.";
								messaageArray.push(message);
							}else if (result3[0].mmr < result3[0].tournalb){
								message = "Member 4's rank("+result3[0].rank+") is lower than the minimum rank required for the tournament ("+result3[0].tournarange+").";
								messaageArray.push(message);
							}else if (result3[0].mmr > result3[0].tournaub){
								message = "Member 4's rank("+result3[0].rank+") is higher than the maximum rank required for the tournament ("+result3[0].tournarange+").";
								messaageArray.push(message);
							}
							if(resultc[0].ingamename == memb1 || resultc[0].ingamename == memb2 || resultc[0].ingamename == memb3 || resultc[0].ingamename == memb4
								|| memb1 == memb2 || memb1 == memb2 || memb1 == memb3 || memb1 == memb4
								|| memb2 == memb3 || memb2 == memb4
								|| memb3 == memb4 ){
								console.log("puta");
								message = "Member In Game Name/Dota 2 ID should be unique";
								messaageArray.push(message);
							}

							
							var sql0 = `SELECT round(AVG(ga.mmr),0) as mmr
							FROM teampalak.gameaccounts ga
							WHERE ga.ingamename IN ("`+user+`","`+memb1+`","`+memb2+`","`+memb3+`","`+memb4+`") and ga.game = (SELECT t.tournamentgame FROM teampalak.tournaments t where t.tournamentid =`+tID+`)`;
							db.query(sql0, function(err, result0){
								avgmmr = result0[0].mmr;
							
							var sqlchecker = `select r.registeredteamid from teampalak.registered_teams r 
							inner join teampalak.members m on r.registeredteamid = m.teamid 
							inner join teampalak.accounts acc on m.memid = acc.accid
							inner join teampalak.gameaccounts gacc on gacc.username = acc.username 
							where gacc.ingamename in (select gacc.ingamename from teampalak.gameaccounts gacc where gacc.ingamename in ("`+resultc[0].ingamename+`","`+memb1+`","`+memb2+`","`+memb3+`","`+memb4+`"))
							and r.tournamentid = `+tID+`
							`;
							db.query(sqlchecker, function(err, result20){
								console.log("putapete");
								var teamname = `select t.teamid from teampalak.teams t inner join teampalak.registered_teams rt on rt.registeredteamid where t.teamname = "`+tname+`" and rt.tournamentid = `+tID;
								db.query(teamname,function(err,namecheck){
									if(namecheck.length>0){
										console.log("putangina");
										message = "The team name is already taken in this tournament. please choose another.";
									messaageArray.push(message);
									}
								if(result20.length>0){
									console.log("putangina talaga");
									message = "A member of this team is already registered in another team for this tournament.";
									messaageArray.push(message);
								}
								if (messaageArray.length>0){
									var messages = "";
									console.log("putangina ulet");
									for(var me = 0; me<messaageArray.length;me++){
										messages += messaageArray[me] + "\n";
									}
									req.session.message = messages;
									res.redirect("/login_tournaments");
									return;
								}
							sql = "INSERT INTO `teampalak`.`teams` (`CaptainID`, `TeamName`,teamavg) VALUES ('"+userId+"', '"+tname+"','"+result0[0].mmr+"')";
							db.query(sql, function(err, result56){
							var sql4 = "SELECT max(TeamID) as teamID FROM teampalak.teams where CaptainID = "+userId;
							db.query(sql4, function(err, result4){
								var inscap = "INSERT INTO `teampalak`.`members` (`TeamID`, `MemID`) VALUES (\'"+result4[0].teamID+"\', \'"+userId+"\')";
								db.query(inscap, function(err, inscap){
								var sql5 = "INSERT INTO `teampalak`.`members` (`TeamID`, `MemID`) VALUES (\'"+result4[0].teamID+"\', \'"+result[0].AccID+"\')";
								db.query(sql5, function(err, result5){
									var sql6 = "INSERT INTO `teampalak`.`members` (`TeamID`, `MemID`) VALUES (\'"+result4[0].teamID+"\', \'"+result1[0].AccID+"\')";
									db.query(sql6, function(err, result6){
										var sql7 = "INSERT INTO `teampalak`.`members` (`TeamID`, `MemID`) VALUES (\'"+result4[0].teamID+"\', \'"+result2[0].AccID+"\')";
										db.query(sql7, function(err, result7){
											console.log("result7");
											var sql8 = "INSERT INTO `teampalak`.`members` (`TeamID`, `MemID`) VALUES (\'"+result4[0].teamID+"\', \'"+result3[0].AccID+"\')";
											db.query(sql8, function(err, result8){
												console.log("result8");
												var sql9 = "INSERT INTO `teampalak`.`registered_teams` (`registeredteamID`, `TournamentID`) VALUES (\'"+result4[0].teamID+"\', \'"+tID+"\')";
												db.query(sql9, function(err, result9){
													console.log(err);
													message = "";
													message = `Team successfully registered! Please contact the admin via Phone: (074) 620-3935 or email us at TeamPalak.ph@gmail.com. For more information please see the bottom of the page.`;
													req.session.message = message;
													res.redirect("/login_tournaments");
													})	
												})								    	
											})
										})
									})
								})
								})
							})
						})
					})
					});
						})
					})
					})
			});
	})
};




//==========================| REGISTER Teampalak Account |=============================
exports.register = function(req, res) {
	if (req.body.user) {
		var query = "SELECT * FROM teampalak.accounts acc WHERE acc.username = ?";
		db.query(query, [req.body.user], function(err, rows, fields) {
			if (rows.length > 0) {
				console.log("reg 1 "+rows.length);
				res.send("<script type='text/javascript'>alert('Username is already taken.'); window.location.replace(\"/register\");</script>");
			} else {
				if (req.body.password != req.body.repassword) {
					res.send("<script type='text/javascript'>alert('Passwords do not match.'); window.location.replace(\"/register\");</script>");
				} else {
					var mysql = require('mysql');

					if(req.body.lol){
						var query = "SELECT * FROM teampalak.gameaccounts acc WHERE acc.inGameName = ?";
						db.query(query, [req.body.lol], function(err, rows, fields) {
							console.log(rows[0]);
							if (rows.length > 0) {
								res.send("<script type='text/javascript'>alert('League of Legends game account is already taken.'); window.location.replace(\"/register\");</script>");
							} else {
								var apikey = "select mapi.api_key from teampalak.api_key mapi where mapi.apiId = (SELECT max(m.apiId) FROM teampalak.api_key m)";
								db.query(apikey, function(err, maxapi){
									console.log(err);
									console.log(maxapi);
									console.log("max api = "+maxapi[0].api_key);
									var key = maxapi[0].api_key;
									console.log("api key = "+key);
									var RiotRequest = require('riot-lol-api');
									var riotRequest = new RiotRequest(key);
									var sName = req.body.lol; //ingame name of summoner
									var version = "4";
									//var matchID = "3007889758";
									riotRequest.request('na1', 'summoner', '/lol/summoner/v'+version+'/summoners/by-name/'+sName,
										function(err, data) {
											if(err=== null){
												var sID = data.id;
												var aID = data.accountId;
												riotRequest.request('na1', 'league','/lol/league/v'+version+'/entries/by-summoner/'+sID,
												function(err, data) {
													var rank = data[0].tier +" "+ data[0].rank;
													var rankTier = data[0].tier;
													var rankDiv = data[0].rank;
													var rankLP = data[0].leaguePoints;
													var mmr = convertRank(rankTier,rankDiv,rankLP);
													var insert = "INSERT INTO teampalak.accounts (username, password, firstname, lastname, email) VALUES ?";
													let hash = bcrypt.hashSync(req.body.password, 10);
													var values = [
														[req.body.user, hash, req.body.firstName, req.body.lastName, req.body.email]
													];
													db.query(insert, [values], function(err, rows, fields) {
														res.send("<script type='text/javascript'>alert('Account successfully registered.'); window.location.replace(\"/register\");</script>");
													});
														var sql = "INSERT INTO teampalak.gameaccounts (username,game,inGameName,summonerOrDotaID,steamOrAccountID,rank,mmr) VALUES ('"+req.body.user+"','lol','"+sName+"','"+sID+"','"+aID+"','"+rank+"','"+mmr+"')";
														db.query(sql, function (err, result) {
														if (err) throw err;
															console.log(sName+","+sID+","+aID+","+rank+","+mmr+" has been logged");
														});
												});
							
											}else if (err){
												console.log(err.status);
												res.send("<script type='text/javascript'>alert('"+err+" Please contact the admin.'); window.location.replace(\"/register\");</script>");
											}
									})
									
									function convertRank(rankTier,rankDiv,rankLP){
										var tierNum=0,divNum=0;
									
										switch(rankDiv){
											case 'I':
												divNum = 4;
												break;
											case 'II':
												divNum = 3;
												break;
											case 'III':
												divNum = 2;
												break;
											case 'IV':
												divNum = 1;
												break;
										}
	
										switch(rankTier){
											case "IRON":
												tierNum = 1;
												break;
											case "BRONZE":
												tierNum = 2;
												break;
											case "SILVER":
												tierNum = 3;
												break;
											case "GOLD":
												tierNum = 4;
												break;
											case "PLATINUM":
												tierNum = 5;
												break;
											case "DIAMOND":
												tierNum = 6;
												break;
											case "MASTER":
												tierNum = 7;
												break;
											case "GRANDMASTER":
												tierNum = 8;
												divNum = '';
												break;
											case "CHALLENGER":
												if(rankLP>999){
													tierNum = 1;
													divNum = '';
												}else{
													tierNum = 9;
													divNum = '';
												}
												break;
											default:
												tierNum = 0;
												break;
										}
	
										if(rankLP<10){
											rankLP = "0"+rankLP;
										}
	
										var matchmakingRank = tierNum+''+divNum+''+rankLP;
										return matchmakingRank;
									}
								})
							}
						});						
					}else if (req.body.dota2){
						if(isNaN(req.body.dota2)){
							res.send("<script type='text/javascript'>alert('Please input your Dota 2 ID.'); window.location.replace(\"/register\");</script>");
						}else{
							var query = "SELECT * FROM teampalak.gameaccounts WHERE summonerOrDotaID = ?";
							db.query(query, [req.body.dota2], function(err, rowse, fields) {
								if (rowse.length > 0) {
									res.send("<script type='text/javascript'>alert('Dota 2 account is already taken.'); window.location.replace(\"/register\");</script>");
								} else {
									const request = require('request');
									const dota2APi = require('dota2-api');
									
									var dotaID = req.body.dota2;
									var api_key = "425f6993-d600-4f13-8fd3-5647f095dbc0";
									var rank;

									request('https://api.opendota.com/api/players/'+dotaID+'?api_key='+api_key, { json: true }, (err, ress, body) => {
										if (err) { return console.log(err); }
										var mmr_estimate = body.mmr_estimate.estimate;
										if(mmr_estimate===undefined){
											res.send("<script type='text/javascript'>alert('Please enter a different account as the mmr of this account is undefined'); window.location.replace(\"/register\");</script>");
										}else{
											rank = body.rank_tier;
									
											var steamID = body.profile.steamid;
											var ign = body.profile.personaname;
										
											var ranks = convertRank();
											var insert = "INSERT INTO teampalak.accounts (username, password, firstname, lastname, email) VALUES ?";
											let hash = bcrypt.hashSync(req.body.password, 10);
											var values = [
												[req.body.user, hash, req.body.firstName, req.body.lastName, req.body.email]
											];
											db.query(insert, [values], function(err, rows, fields) {
												res.send("<script type='text/javascript'>alert('Account successfully registered.'); window.location.replace(\"/register\");</script>");
											})

												var sql = "INSERT INTO teampalak.gameaccounts (username,game,inGameName,summonerOrDotaID,steamOrAccountID,rank,mmr) VALUES ('"+req.body.user+"','dota 2','"+ign+"','"+dotaID+"','"+steamID+"','"+ranks+"','"+mmr_estimate+"')";
												db.query(sql, function (err, result) {
												if (err) throw err;
													console.log(ign+","+dotaID+","+steamID+","+ranks+","+mmr_estimate+" has been logged");
												});
										}
									});
									
									function convertRank(){
										var rankTier = Math.trunc(rank/10);
										var rankDiv = rank%10;
									
										switch(rankTier) {
											case 1:
												rankTier = "Herald";
											break;
											case 2:
												rankTier = "Guardian";
											break;
											case 3:
												rankTier = "Crusader";
											break;
											case 4:
												rankTier = "Archon";
											break;
											case 5:
												rankTier = "Legend";
											break;
											case 6:
												rankTier = "Ancient";
											break;
											case 7:
												rankTier = "Divine";
											break;
											case 8:
												rankTier = "Immortal";
											break;
											default:
												rankTier = "Uncalibrated";
												break;
									}
									
										var rankTD = rankTier +" "+ rankDiv.toString()+" ";
										return rankTD;
									
									}
								}
							});	
						}
					}else if (req.body.csgo){}
				}
			}
		});
	}

};

//==========================| LOGOUT |=============================
exports.logout = function(req, res) {
	req.session.destroy(function(err) {
		res.redirect("/home");
	})
};


//==========================| Results Page |=============================
exports.resultsPage = function(req, res) {
	var user = req.session.user,
		userId = req.session.userID;
	// console.log("results page a");
	// 	console.log("results page b");
	
	if (user == null) {
		res.redirect("/login");
		return;
	}else{
			// var sql =
			// 	`SELECT 
			// 	lol.gid,lol.MemID,lol.gameID,lol.pID,lol.pName,gacc.rank,lol.teamId,lol.win,lol.championId,
			// 	lol.lane,lol.spell1id,lol.spell2id,lol.KDA,lol.Damage,lol.WardScore,lol.CreepScore,
			// 	lol.goldearned,
			// 	lol.item0,lol.item1,lol.item2,lol.item3,lol.item4,lol.item5,lol.item6,
			// 	q.itemIcon as "itemIconQ",w.itemIcon as "itemIconW",e.itemIcon as "itemIconE",r.itemIcon as "itemIconR",t.itemIcon as "itemIconT",y.itemIcon as "itemIconY",u.itemIcon as "itemIconU",
			// 	lc.champIconId,lc.champIcon,lc.champName,
			// 	a.spellid as "spell1IdA",a.spellIcon as "spellIconA",a.spellName as "spellNameA",
			// 	b.spellid as "spell1IdB",b.spellIcon as "spellIconB",b.spellName as "spellNameB"
			// 	FROM teampalak.league_of_legends lol
			// 	inner join teampalak.league_champs lc on lol.championId = lc.ChampIconID 
			// 	inner JOIN teampalak.league_spells a ON lol.spell1id = a.spellID 
			// 	inner join teampalak.league_spells b on lol.spell2id = b.spellID
			// 	inner join teampalak.league_items q on lol.item0 = q.itemId
			// 	inner join teampalak.league_items w on lol.item1 = w.itemId
			// 	inner join teampalak.league_items e on lol.item2 = e.itemId
			// 	inner join teampalak.league_items r on lol.item3 = r.itemId
			// 	inner join teampalak.league_items t on lol.item4 = t.itemId
			// 	inner join teampalak.league_items y on lol.item5 = y.itemId
			// 	inner join teampalak.league_items u on lol.item6 = u.itemId
            //     inner join teampalak.gameaccounts gacc on lol.pname = gacc.ingamename
            //     inner join teampalak.accounts acc on acc.username = gacc.username
			// 	where lol.gameID in (select league.gameID from teampalak.league_of_legends league where league.pName = 
			// 		(SELECT gameacc.InGameName from teampalak.gameaccounts gameacc 
			// 		inner join teampalak.accounts acc on gameacc.username = acc.username where acc.username ="`+req.session.user+`")) order by lol.gID,lol.win desc`;

				var sql =
				`SELECT 
				lol.gameID,lol.pID,lol.pName,lol.teamId,lol.win,lol.championId,
				lol.lane,lol.spell1id,lol.spell2id,lol.KDA,lol.Damage,lol.WardScore,lol.CreepScore,
				lol.goldearned,
				lol.item0,lol.item1,lol.item2,lol.item3,lol.item4,lol.item5,lol.item6,
				q.itemIcon as "itemIconQ",w.itemIcon as "itemIconW",e.itemIcon as "itemIconE",r.itemIcon as "itemIconR",t.itemIcon as "itemIconT",y.itemIcon as "itemIconY",u.itemIcon as "itemIconU",
				lc.champIconId,lc.champIcon,lc.champName,
				a.spellid as "spell1IdA",a.spellIcon as "spellIconA",a.spellName as "spellNameA",
				b.spellid as "spell1IdB",b.spellIcon as "spellIconB",b.spellName as "spellNameB"
				FROM teampalak.league_of_legends lol
				inner join teampalak.league_champs lc on lol.championId = lc.ChampIconID 
				inner JOIN teampalak.league_spells a ON lol.spell1id = a.spellID 
				inner join teampalak.league_spells b on lol.spell2id = b.spellID
				inner join teampalak.league_items q on lol.item0 = q.itemId
				inner join teampalak.league_items w on lol.item1 = w.itemId
				inner join teampalak.league_items e on lol.item2 = e.itemId
				inner join teampalak.league_items r on lol.item3 = r.itemId
				inner join teampalak.league_items t on lol.item4 = t.itemId
				inner join teampalak.league_items y on lol.item5 = y.itemId
				inner join teampalak.league_items u on lol.item6 = u.itemId
				where lol.gameID in (select league.gameID from teampalak.league_of_legends league where league.pName = 
					(SELECT gameacc.InGameName from teampalak.gameaccounts gameacc 
					inner join teampalak.accounts acc on gameacc.username = acc.username where acc.username ="`+req.session.user+`" AND game = "LoL")) order by lol.gID,lol.win desc`;
			db.query(sql, function(err, result){
				var game1 = [];
				var game2 = [];
				var game3 = [];
				var game4 = [];
				var game5 = [];
				var game6 = [];
				var game7 = [];
				var game8 = [];
				var game9 = [];
				var game10 = [];
				var games =[];

				for(var c = 0; c<result.length; c++){
					if(c<10){
						game1.push(result[c]);
						// console.log(result[c]);
					}else if (c<20){
						game2.push(result[c]);
					}else if (c<30){
						game3.push(result[c]);
					}else if (c<40){
						game4.push(result[c]);
					}else if (c<50){
						game5.push(result[c]);
					}else if (c<60){
						game6.push(result[c]);
					}else if (c<70){
						game7.push(result[c]);
					}else if (c<80){
						game8.push(result[c]);
					}else if (c<90){
						game9.push(result[c]);
					}else if (c<100){
						game10.push(result[c]);
					}
				}
				games.push(game1,game2,game3,game4,game5,game6,game7,game8,game9,game10);

				var sql111 = 'SELECT gameacc.InGameName from teampalak.gameaccounts gameacc inner join teampalak.accounts acc on gameacc.username = acc.username where acc.username ="'+req.session.user+'"';
				db.query(sql111, function(err, result111){
					var sql9 = "select message from teampalak.notifications where status = 'unchecked' AND accID = ?";
					db.query(sql9,userId, function(err, result9){
						var sql10 = "select message, status from teampalak.notifications where accID = ?";
						db.query(sql10,userId, function(err, result10){
							var sql11 = "UPDATE notifications SET status='Checked' WHERE accID = ?";
							db.query(sql11,userId, function(err, result11){
								res.render('results.ejs',{data:games,data1:result111,num:result9,notif:result10});
							});
						});
					});
				});
			});
		}
	};

//==========================| Display Brackets |=============================
exports.bracket = async function (req, res, next) {
	var sql1 = "SELECT MAX(Rounds) AS max FROM game";
	var sql2 = "SELECT MAX(GameID) AS max FROM game";
	var first = [];
	var second = [];
	var third = [];
	var fourth = [];
	var order = [];
	var bracketArray = [];
	var roundsMax = 0; //4
	var gamesMax = 0; //15
	var message = "";

	//Get Total Rounds
	getRounds(function(result){
		roundsMax = result;
		
		//Get Total Games
		getGames(function(result){
			gamesMax = result;
			
			//Get Brackets - Pass Total Rounds and Games
			getBrackets(roundsMax, gamesMax, function(result){

				//Divide Total Games by 2
				var y = result.length/2;

				var arr = new Array();

				//Push data with same gameID to ordered array
				for(var x = 0; x <= y - 1; x++){
					if(result[x]['gameID'] == result[x + y]['gameID']){

						//Group per same game id
						var arr1 = new Array();
						arr1.push(result[x], result[x + y]);

						arr.push(arr1);
					}
				}

				for(var j = 1; j<= gamesMax; j++){

					//Push game 1
					if(j <= 8){
						first.push(arr[j-1]);
					} 
					
					//Push game 2
					if(j > 8 && j <= 12){
						second.push(arr[j-1]);
					}

					//Push game 3
					if(j > 12 && j <= 14){
						third.push(arr[j-1]);
					}

					//Push game 4
					if(j > 14 && j <= 15){
						fourth.push(arr[j-1]);
					}
				}

				//Push all rounds into 1 array
				bracketArray.push(first, second, third, fourth);

				//console.log("TEST DATA: " + JSON.stringify(bracketArray));
				
				//Render Result to Bracket.ejs
				res.render('bracket.ejs', {message:message,
					bracketing : JSON.stringify(bracketArray)
				});
			});
		});
	});

	function getRounds(rounds){
		db.query(sql1, function (err, result) {
			return rounds(getMax(result));
		});
	}

	function getGames(games){
		db.query(sql2, async function (err, result) {
			return games(getMax(result));
		});
	}

	function getBrackets(rounds, games, bracket1){
		console.log(req.query.tid);
		var sql3 =
					`(SELECT te1.teamName as name, g1.team1id as id, r.seed, g1.gameID as gameID FROM tournaments t1
					INNER JOIN game g1 ON  t1.TournamentID =  g1.TournamentID
					INNER JOIN teams te1 on g1.Team1ID = te1.TeamID
					INNER JOIN registered_teams r on r.registeredteamid = te1.teamid
					Where t1.TournamentID = `+req.query.tid+` ORDER BY g1.GameID,g1.Rounds
					) UNION
					(SELECT te2.teamName as name, g2.team2id as id, r.seed, g2.gameID as gameID FROM tournaments t2
					INNER JOIN game g2 ON  t2.TournamentID =  g2.TournamentID
					INNER JOIN teams te2 on g2.Team2ID = te2.TeamID
					INNER JOIN registered_teams r on r.registeredteamid = te2.teamid
					Where t2.TournamentID = `+req.query.tid+` ORDER BY g2.GameID,g2.Rounds
					)`;

					db.query(sql3, function (err, results) {
						if (results.length > 0) {
							return bracket1(results);
						}
					});
	}

	function getMax(result) {
		return result[0].max;
	};
};

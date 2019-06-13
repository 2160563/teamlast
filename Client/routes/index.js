exports.index = function(req, res) {
  let user = req.session.user;
  let accountType = req.session.accountType;
  db.query('SELECT * FROM accounts WHERE username = ?', [user], function(err, rows, fields) {
    res.redirect('/home');
  });
};

exports.login = function(req, res){
    var message = '';
  res.render('login',{message: message});
};

exports.register = function(req, res) {
  let user = req.session.user;
  let accountType = req.session.accountType;

  if (user) {
    res.redirect('/');
  } else {
    res.render('register', {
      user: user,
      accountType: accountType
    });
  }
};

exports.editProfile = function(req, res){
  let user = req.session.user;
  var message = '';
  var message1 = '';
  var message2 = '';
  var message3 = '';

  if (user == null) {
    res.redirect("/login");
    return;
  } else {
    if(req.method == "POST"){
      var sql = "SELECT InGameName, Game FROM `gameaccounts` WHERE Username = ?";
      db.query(sql, user, function(err, rows, fields){ 
        res.render('editProfile',
          {
            user: user, 
            message: message,
            message1: message1,
            message2: message2,
            message3: message3,
            data: rows
          });
      });
    }else{
      var sql = "SELECT InGameName, Game FROM `gameaccounts` WHERE Username = ?";
      db.query(sql, user, function(err, rows, fields){ 
        console.log(rows);
        res.render('editProfile',
          {
            user: user, 
            message: message,
            message1: message1,
            message2: message2, 
            message3: message3, 
            data: rows
          });
      });
    }
  }
};
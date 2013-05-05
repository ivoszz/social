var express = require('express');
var app = express();

var mongoose = require('mongoose');
var nodemailer = require('nodemailer');

var config = {
  db: require('./config/db'),
  mail: require('./config/mail')
};

var models = {
  Account: require('./models/Account')(config, mongoose, nodemailer)
};

app.set('view engine', 'jade');
app.use(express.logger('dev'));
app.use(express.static(__dirname + '/public'));
app.use(express.limit('1mb'));
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session({secret: 'myApp secret key'}));

mongoose.connect(config.db.dbPath, function onMongooseError(err) {
  if (err) {
    throw err;
  }
});

app.get('/', function(req, res) {
  res.render('index.jade');
});

app.post('/login', function(req, res) {
  console.log('login request');
  var email = req.param('email', null);
  var password = req.param('password', null);

  if (!email || email.length < 1 || !password || password.length < 1) {
    res.send(400);
    return;
  }

  models.Account.login(email, password, function(account) {
    if (!account) {
      res.send(401);
      return;
    }
    console.log('login was successful');
    req.session.loggedIn = true;
    req.session.accountId = account.id;
    res.send(200);
  });
});

app.post('/register', function(req, res) {
  var firstName = req.param('firstName', '');
  var lastName = req.param('lastName', '');
  var email = req.param('email', null);
  var password = req.param('password', null);

  if (!email || email.length < 1 || !password || password.length < 1) {
    res.send(400);
    return;
  }

  models.Account.register(email, password, firstName, lastName);
  res.send(200);
});

app.get('/account/authenticated', function(req, res) {
  if (req.session.loggedIn) {
    res.send(200);
  } else {
    res.send(401);
  }
});

app.get('/account/:id/activity', function(req, res) {
  var accountId = req.params.id === 'me'
    ? req.session.accountId
    : req.params.id;
  models.Account.findById(accountId, function(account) {
    res.send(account.activity);
  });
});

app.get('/account/:id/status', function(req, res) {
  var accountId = req.params.id === 'me'
    ? req.session.accountId
    : req.params.id;
  models.Account.findById(accountId, function(account) {
    res.send(account.status);
  });
});

app.post('/account/:id/status', function(req, res) {
  var accountId = req.params.id === 'me'
    ? req.session.accountId
    : req.params.id;
  models.Account.findById(accountId, function(account) {
    var status = {
      name: account.name,
      status: req.param('status', '')
    };
    account.status.push(status);

    account.activity.push(status);
    account.save(function(err) {
      if (err) {
        console.log('Error saving account: ' + err);
      }
    });
    res.send(200);
  });
});

app.get('/account/:id', function(req, res) {
  var accountId = req.params.id === 'me'
    ? req.session.accountId
    : req.params.id;
  models.Account.findById(accountId, function(account) {
    res.send(account);
  });
});

app.post('/forgotPassword', function(req, res) {
  var hostname = req.headers.host;
  var resetPasswordUrl = 'http://' + hostname + '/resetPassword';
  var email = req.param('email', null);

  if (!email || email.length < 1) {
    res.send(400);
    return;
  }

  models.Account.forgotPassword(email, resetPasswordUrl, function(success) {
    if (success) {
      res.send(200);
    } else {
      res.send(404);
    }
  });
});

app.get('/resetPassword', function(req, res) {
  var accountId = req.param('account', null);
  res.render('resetPassword.jade', {locals: {accountId: accountId}});
});

app.post('/resetPassword', function(req, res) {
  var accountId = req.param('accountId', null);
  var password = req.param('password', null);
  if (accountId && password) {
    models.Account.changePassword(accountId, password);
  }
  res.render('resetPasswordSuccess.jade');
});

app.listen(8000);
console.log('SocialNet started on port 8000 ...');

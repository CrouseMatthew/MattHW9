// dependencies
var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var config = require('./config.js');
var consolidate = require('consolidate');
var Handlebars = require('handlebars');

var db = require('orchestrate')(config.dbKey);

var app = express();

var megaCounter =0;

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.engine('html', consolidate.handlebars);
app.set('view engine', 'html');
app.set('views', __dirname + '/templates');

// express routes

app.get('/', function (req, res) {
  res.render('./index.html');
});

//db.deleteCollection('MTG cards');

app.get('/api/list', function (req, res) {
  var list = [];
  db.list('MTG cards')
  .then(function (result) {
  result.body.results.forEach(function (item){
  //    console.log('\n' + item.value.title +'\n');
     list.push(item.value);
    });
    console.log(list,'<<<<<<<<<<< app.GET');
    res.json(results);
  })
  .fail(function (err) {
    console.error(err);
  });
});

app.post('/api/list', function (req, res){
  req.accepts('application/json');
  db.put('MTG cards', ('card' + megaCounter++), req.body)
  .then(function (){
    console.log(req.body, '^^^^^^^^^^^^^^^^ APP.POST');
    res.send(200, 'ok, we added your card, here is what you added');
  })
  .fail(function (err) {
    console.error(err);
  });
});


app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'), function() {
  console.log('Express server listening on port # ' + app.get('port'));
});

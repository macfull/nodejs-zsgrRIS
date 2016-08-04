var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var multer = require('multer');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

global.dbHandel = require('./database/dbHandel');
global.db = mongoose.connect("mongodb://root:maifeng@ds019054.mlab.com:19054/mongo");

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

//app.set('port', process.env.PORT || 3000);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine("html",require("ejs").__express); // or   app.engine("html",require("ejs").renderFile);
//app.set('view engine', 'ejs');
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true,
  cookie:{
    maxAge: 1000*60*60*24//30分钟 1000*60*30
  },
/*  store: new MongoStore({
    //db: settings.db,
    //host: settings.host,
    //port: settings.port
    url:'mongodb://root:maifeng@ds019054.mlab.com:19054/mongo',
    ttl: 8*60 *60 // = 14 days. Default 14 * 24 * 60 * 60
  })*/
}));
app.use(function(req,res,next){
  res.locals.user = req.session.user;   // 从session 获取 user对象
  var err = req.session.error;   //获取错误信息
  delete req.session.error;
  res.locals.message = "";   // 展示的信息 message
  if(err){
    res.locals.message = err;
  }
  next();  //中间件传递
});

app.use('/', routes);
app.use('/users', users);
app.use('/login',routes); // 即为路径 /login 设置路由
app.use('/register',routes); // 即为路径 /register 设置路由
app.use('/home',routes); // 即为路径 /home 设置路由
app.use("/logout",routes); // 即为路径 /logout 设置路由
app.use("/appointment",routes);
app.use("/queue",routes);
app.use("/graphicreport",routes);
app.use("/patientlist",routes);
app.use("/reporttemplate",routes);
app.use("/stats",routes);
app.use("/dptset",routes);
app.use("/dptstats",routes);
app.use("/settings",routes);
app.use("/dptnotice",routes);
app.use("/reportdetail",routes);
app.use("/profile",routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

/*app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port')+' '+ Date());
});*/

module.exports = app;

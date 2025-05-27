var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const cors = require('cors');


const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger_output.json')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
//Nuevo
var registroRouter = require('./routes/registro');
var iniciosesionRouter = require('./routes/iniciosesion');
var rutasRouter = require('./routes/lasrutas');
var frecuentesRouter = require('./routes/frecuentes');
var comentariosRouter = require('./routes/comentarios');


var flash = require('connect-flash'); //p
const passport = require("./passport/setup"); //p
const session = require("express-session");  //p
const MongoStore = require("connect-mongo")(session); //p

const app = express();

app.use(cors());

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/Guadaway')
    .then(() => console.log('Connected to MongoDB.'))
    .catch(err => console.error('Could not connect to MongoDB.', err))



// Express Session
app.use(   
  session({
      secret: "very secret this is",
      resave: false,
      saveUninitialized: true,
      store: new MongoStore({ mongooseConnection: mongoose.connection })
  })
);

// Passport middleware
app.use(passport.initialize()); 
app.use(passport.session()); 
app.use(flash()); 


app.use((req, res, next) => {
  if (req.user) {
    req.session.user = req.user;
    res.locals.user = req.user; // Para usar en EJS
  }
  next();
});

app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
//Nuevo
app.use('/registro', registroRouter);
app.use('/iniciosesion', iniciosesionRouter);
app.use('/', rutasRouter);
app.use('/frecuentes', frecuentesRouter);
app.use('/comentarios', comentariosRouter);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;




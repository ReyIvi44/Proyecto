const bcrypt = require("bcryptjs");
const User = require("../models/Users");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

  // required for persistent login sessions
  // passport needs ability to serialize and unserialize users out of session
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  // used to deserialize user
  passport.deserializeUser(function (id, done) {
    User.findById(id).then(user => {
      done(null, user);
    }).catch((err) => {
      return done(err);
    });
  });

  //REGISTRO
  passport.use('local-registro', new LocalStrategy({
    // by default, local strategy uses username and password, we will override with email
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback : true // allows us to pass back the entire request to the callback, permite recuperar el resto de atributos como Nombre y Apellidos
  },
  function (req, email, password, done) {
    User.findOne({email: email})
    .then(user => {     
      if (user) {
        return done(null, false, req.flash('signupMessage', 'the email is already taken'));
      } else {
        var newUser = new User();
        newUser.name = req.body.nombre;
        newUser.surname = req.body.apellidos;
        newUser.telefono = req.body.telefono; 
        newUser.email = email;
        newUser.password = newUser.generateHash(password);
        newUser.save().then(() => {         
          return done(null, newUser);
        }).catch((err) => {
          return done(err);
        });
      }
    }).catch((err) => {
      return done(err);
    });
    console.log("Datos recibidos en registro:", req.body);
  }));



  //INICIO DE SESION
  passport.use('local-iniciosesion', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  function (req, email, password, done) {
    User.findOne({email: email}).then(user => {     
      if (!user) {
        return done(null, false, req.flash('loginMessage', 'No User found'))
      }
      if (!user.validPassword(password)) {
        return done(null, false, req.flash('loginMessage', 'Wrong. password'));
      }
      return done(null, user);
    }).catch((err) => {
      return done(err);
    });
  }));
  
module.exports = passport;
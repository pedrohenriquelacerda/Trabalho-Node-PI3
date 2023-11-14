"use strict";

var bcrypt = require("bcryptjs");

var LocalStrategy = require("passport-local").Strategy;

var Usuario = require("./models/usuarios");

var GoogleStrategy = require("passport-google-oauth20").Strategy;

var GOOGLE_CLIENT_ID = "888513062489-5t4f7cuf3sefqg6cng0n9p597jtc3pfl.apps.googleusercontent.com";
var GOOGLE_CLIENT_SECRET = "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";

module.exports = function (passport) {
  function findUser(email) {
    var dadosBanco;
    return regeneratorRuntime.async(function findUser$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return regeneratorRuntime.awrap(Usuario.findAll({
              raw: true,
              where: {
                email: email
              }
            }));

          case 2:
            dadosBanco = _context.sent;

            if (!(dadosBanco.length > 0)) {
              _context.next = 7;
              break;
            }

            return _context.abrupt("return", dadosBanco[0]);

          case 7:
            return _context.abrupt("return", null);

          case 8:
          case "end":
            return _context.stop();
        }
      }
    });
  }

  passport.serializeUser(function (user, done) {
    done(null, {
      nome: user.nome,
      id: user.id,
      imagem: user.imagem
    });
  });
  passport.deserializeUser(function _callee(id, done) {
    var user;
    return regeneratorRuntime.async(function _callee$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return regeneratorRuntime.awrap(Usuario.findAll({
              where: {
                id: id
              }
            }));

          case 3:
            user = _context2.sent;
            done(null, user);
            _context2.next = 10;
            break;

          case 7:
            _context2.prev = 7;
            _context2.t0 = _context2["catch"](0);
            done(_context2.t0, null);

          case 10:
          case "end":
            return _context2.stop();
        }
      }
    }, null, null, [[0, 7]]);
  });
  passport.use(new LocalStrategy({
    usernameField: "email",
    passwordField: "senha"
  }, function _callee2(email, senha, done) {
    var user, isValid;
    return regeneratorRuntime.async(function _callee2$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            _context3.next = 3;
            return regeneratorRuntime.awrap(findUser(email));

          case 3:
            user = _context3.sent;

            if (user) {
              _context3.next = 6;
              break;
            }

            return _context3.abrupt("return", done(null, false));

          case 6:
            // comparando as senhas
            isValid = bcrypt.compareSync(senha, user.senha);

            if (isValid) {
              _context3.next = 9;
              break;
            }

            return _context3.abrupt("return", done(null, false));

          case 9:
            return _context3.abrupt("return", done(null, user));

          case 12:
            _context3.prev = 12;
            _context3.t0 = _context3["catch"](0);
            done(_context3.t0, false);

          case 15:
          case "end":
            return _context3.stop();
        }
      }
    }, null, null, [[0, 12]]);
  }));
  passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/google/callback"
  }, function _callee3(accessToken, refreshToken, profile, done) {
    var existingUser, newUser;
    return regeneratorRuntime.async(function _callee3$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.prev = 0;
            _context4.next = 3;
            return regeneratorRuntime.awrap(findUser(profile.emails[0].value));

          case 3:
            existingUser = _context4.sent;

            if (!existingUser) {
              _context4.next = 8;
              break;
            }

            return _context4.abrupt("return", done(null, existingUser));

          case 8:
            // Crie um novo usuário com base no perfil do Google e senha temporária
            newUser = {
              nome: profile.displayName,
              email: profile.emails[0].value,
              imagem: profile.photos[0].value,
              google: true // Outros campos do usuário, se necessário

            };
            Usuario.create(newUser); // Retorne o novo usuário

            return _context4.abrupt("return", done(null, newUser));

          case 11:
            _context4.next = 16;
            break;

          case 13:
            _context4.prev = 13;
            _context4.t0 = _context4["catch"](0);
            return _context4.abrupt("return", done(_context4.t0, null));

          case 16:
          case "end":
            return _context4.stop();
        }
      }
    }, null, null, [[0, 13]]);
  }));
};
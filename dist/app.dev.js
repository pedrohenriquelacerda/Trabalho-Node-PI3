"use strict";

var express = require("express");

var path = require("path");

var formidable = require("formidable");

var cookieParser = require("cookie-parser");

var logger = require("morgan");

var expressLayouts = require("express-ejs-layouts");

var session = require("express-session");

var MySQLStore = require("express-mysql-session")(session);

var createError = require("http-errors");

var passport = require("passport");

var LocalStrategy = require("passport-local").Strategy;

var indexRouter = require("./routes/index");

var usersRouter = require("./routes/users");

var loginRouter = require("./routes/login");

var cadastroRouter = require("./routes/cadastro");

var googleRouter = require("./routes/google");

var logoutRouter = require("./routes/logout");

var capivaraRouter = require("./routes/capivara");

var chatRouter = require("./routes/chat");

var app = express(); // Middleware para configurar variável global

app.use(function (req, res, next) {
  res.locals.title = "Erro"; //res.locals.imagem = "default.png";

  res.locals.logged = false; //res.locals.nome = "a";

  next();
}); // Configurando o formidable

formidable.defaultOptions.allowEmptyFiles = true;
formidable.defaultOptions.minFileSize = 0; // Middleware de autenticação

function authenticationMiddleware(req, res, next) {
  if (req.isAuthenticated()) {
    res.locals.logged = true;
    res.locals.id = req.session.passport.user.id;
    res.locals.imagem = req.session.passport.user.imagem;
    res.locals.nome = req.session.passport.user.nome;
    return next();
  }

  if (req.path == "/google/callback") return next();
  if (req.path === "/login") return next(); // Evita redirecionamento se já estiver na página de login

  res.redirect("/login?erro=1");
} // Configuração de views e layout


app.use(express["static"](path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(expressLayouts); // Configuração de sessão

app.use(session({
  store: new MySQLStore({
    host: "localhost",
    port: "3306",
    user: "root",
    password: "",
    database: "node"
  }),
  secret: "2C44-4D44-WppQ38S",
  //configure um segredo seu aqui,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 30 * 60 * 1000
  } //30min

})); // Inicialização do Passport

require("./auth")(passport);

app.use(passport.initialize());
app.use(passport.session()); // Configuração de logs e parsers

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser()); // Rotas públicas (sem autenticação)

app.use("/google", googleRouter);
app.use("/login", loginRouter);
app.use("/cadastro", cadastroRouter);
app.use("/logout", logoutRouter); // Rotas protegidas (requerem autenticação)

app.use("/", authenticationMiddleware, indexRouter);
app.use("/user", authenticationMiddleware, usersRouter);
app.use("/capivara", authenticationMiddleware, capivaraRouter);
app.use("/chat", authenticationMiddleware, chatRouter); // Aplicação de middleware de autenticação após as rotas públicas

app.use(authenticationMiddleware); // Tratamento de erros 404

app.use(function (req, res, next) {
  next(createError(404));
}); // Tratamento de erros

app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {}; // render the error page

  res.status(err.status || 500);
  res.render("error");
});
module.exports = app;
const bcrypt = require("bcryptjs");
const LocalStrategy = require("passport-local").Strategy;
const Usuario = require("./models/usuarios");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const GOOGLE_CLIENT_ID =
  "888513062489-5t4f7cuf3sefqg6cng0n9p597jtc3pfl.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "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";

module.exports = function (passport) {
  async function findUser(email) {
    let dadosBanco = await Usuario.findAll({
      raw: true,
      where: {
        email: email,
      },
    });
    if (dadosBanco.length > 0) return dadosBanco[0];
    else return null;
  }

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await Usuario.findByPk(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });

  passport.use(
    new LocalStrategy(
      { usernameField: "email", passwordField: "senha" },
      async (email, senha, done) => {
        try {
          const user = await findUser(email);
          // usuário inexistente
          if (!user) {
            return done(null, false);
          }
          // comparando as senhas
          const isValid = bcrypt.compareSync(senha, user.senha);
          if (!isValid) return done(null, false);
          return done(null, user);
        } catch (err) {
          done(err, false);
        }
      }
    )
  );

  passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:3000/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Verifique se o usuário do Google já existe no banco de dados
          const existingUser = await findUser(profile.emails[0].value);

          if (existingUser) {
            // Se o usuário já existe, retorne o usuário existente
            return done(null, existingUser);
          } else {
            // Gere uma senha temporária aleatória
            const temporaryPassword = Math.random().toString(36).slice(-8);

            // Crie um novo usuário com base no perfil do Google e senha temporária
            const newUser = await Usuario.create({
              nome: profile.displayName,
              email: profile.emails[0].value,
              senha: temporaryPassword, // Use a senha temporária aqui
              // Outros campos do usuário, se necessário
            });

            // Retorne o novo usuário
            return done(null, newUser);
          }
        } catch (err) {
          return done(err, null);
        }
      }
    )
  );
};

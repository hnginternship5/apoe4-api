import passport from 'passport';
import passportJWT from 'passport-jwt';
import passportLocalStrategy from 'passport-local';
import { Strategy } from 'passport-google-oauth2';
import User from '../components/user/userModel';
import config from '.';

const ExtractJWT = passportJWT.ExtractJwt;
const JWTStrategy = passportJWT.Strategy;
const LocalStrategy = passportLocalStrategy.Strategy;

passport.use(
  new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password',
      session: false,
    },
    (email, password, done) => {
      return User.findOne({
          email,
        })
        .then((user) => {
          if (!user) {
            return done(null, false, {
              message: 'Incorrect email or password.',
            });
          }

          if (!user.comparePassword(password)) {
            return done(null, false, {
              message: 'Incorrect email or password.',
            });
          }

          return done(null, user, {
            message: 'Logged In Successfully',
          });
        })
        .catch((err) => {
          return done(err);
        });
    },
  ),
);

passport.use(new Strategy({
  clientID:     "374980976639-7o7i055m6f2aq1bi5c2gnnljur2k6vmk.apps.googleusercontent.com",
  clientSecret: "8gZL9Eq3Cjos-PQJsPxNpqi4",
  callbackURL: "http://lvh.me:7777/api/v1/auth/google/redirect",
  passReqToCallback   : true
},
function(request, accessToken, refreshToken, profile, done) {
  User.findOne({ email: profile.email }, function (err, user) {
    request.body.owner = user.id
    return done(err, user);
  });
}
));

passport.use(
  new JWTStrategy({
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.jwt.secret,
    },
    function (jwtPayload, done) {
      //find the user in db if needed
      return User.findById(jwtPayload.id)
        .then((user) => {
          if (user) {
            return done(null, user);
          } else {
            return done(null, false);
          }
        })
        .catch((err) => {
          return done(err, false);
        });
    },
  ),
);

export default passport;
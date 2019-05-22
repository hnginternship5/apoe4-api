import passport from 'passport';
import passportJWT from 'passport-jwt';
import passportLocalStrategy from 'passport-local';
import passportGoogleStrategy from 'passport-google-oauth2';
import { User } from '../components/user/userModel';
import GooglePlusToken from "passport-google-plus-token";
import config from '.';

const ExtractJWT = passportJWT.ExtractJwt;
const JWTStrategy = passportJWT.Strategy;
const LocalStrategy = passportLocalStrategy.Strategy;
const GoogleStrategy = passportGoogleStrategy.Strategy;
const GooglePlusStrategy = GooglePlusToken.Strategy;

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


passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENTID,
        clientSecret: process.env.GOOGLE_SECRET,
        callbackURL: "http://localhost:7777/api/v1/auth/google/redirect",
        passReqToCallback: true
    },
    function(request, accessToken, refreshToken, profile, done) {
        User.findOne({ email: profile.email }, function(err, user) {
            request.body.owner = user.id;
            request.body.profile = profile.email;

            //if user is found, log them in
            if (user) {
                return done(err, user);
            } else {
                // if the user isnt in our database, create a new user
                var newUser = new User();

                // set all of the relevant information
                newUser.id = profile.id;
                newUser.accessToken = accessToken;
                newUser.firstName = profile.name.givenName;
                newUser.email = profile.email;

                // save the user
                newUser.save(function(err) {
                    if (err)
                        throw err;
                    return done(null, newUser);
                });
            }
        });
    }
));

passport.use(
    new JWTStrategy({
            jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.jwt.secret,
        },
        function(jwtPayload, done) {
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
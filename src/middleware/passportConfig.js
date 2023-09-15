import passport from "passport";
import passportJwt from "passport-jwt";
import mongoose from "mongoose";
import config from "config";

const nodeEnv = process.env.NODE_ENV;

const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;

const User = mongoose.model("User");
const secret = config.get(`${nodeEnv}.JWT_ACCESSTOKEN_SECRET`);

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = secret;

passport.use(
    new JwtStrategy(opts, (payload, done) => {
        User.findById(payload.id)
            .then((user) => {
                if (user) return done(null, user);

                return done(null, false);
            })
            .catch((err) => {
                return done(err, false);
            });
    })
);
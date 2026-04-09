const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
},
async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
            return done(null, user);
        }

        // Check if a local account already exists with this email
        const email = profile.emails[0].value;
        user = await User.findOne({ email });

        if (user) {
            // Link Google to existing local account
            user.googleId = profile.id;
            user.avatar = user.avatar || profile.photos[0].value;
            user.authProvider = 'google';
            await user.save();
            return done(null, user);
        }

        // Create brand new user
        user = await User.create({
            googleId: profile.id,
            email,
            name: profile.displayName,
            avatar: profile.photos[0].value,
            authProvider: 'google'
        });

        return done(null, user);
    } catch (err) {
        return done(err, null);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

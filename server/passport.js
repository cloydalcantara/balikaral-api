const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const LocalStrategy = require('passport-local').Strategy;
const GooglePlusTokenStrategy = require('passport-google-plus-token');
const FacebookTokenStrategy = require('passport-facebook-token');
const config = require('./configuration');
const User = require('./models/user');

// JSON WEB TOKENS STRATEGY
passport.use(new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.JWT_SECRET
}, async (payload, done) => {
  try {
    // Find the user specified in token
    const user = await User.findById(payload.sub);

    // If user doesn't exists, handle it
    if (!user) {
      return done(null, false);
    }

    // Otherwise, return the user
    done(null, user);
  } catch(error) {
    done(error, false);
  }
}));

// LOCAL STRATEGY
passport.use(new LocalStrategy({
  usernameField: 'employeeid'
}, async (employeeid, password, done) => {
  try {
    // Find the user given the email
    const user = await User.findOne({ "employeeid": employeeid });
    
    // If not, handle it
    if (!user) {
      return done(null, false);
    }
    console.log(user)
    if(user){
      // Check if the password is correct
      const isMatch = await user.isValidPassword(password);
      console.log("isMatch",isMatch)
      // If not, handle it
      if (!isMatch) {
        return done(null, false);
      }
    
      // Otherwise, return the user
     done(null, user);
    }else{
      return done(null, false);
    }
    
  } catch(error) {
    done(error, false);
  }
}));
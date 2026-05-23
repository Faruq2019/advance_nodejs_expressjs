import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { mockUsers } from "../utils/constants.mjs";
import { User } from "../mongoose/schemas/user.mjs";

passport.serializeUser((user, done) => {
  done(null, user.id); //serialize the user by storing the user id in the session
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id); //deserialize the user by finding the user in the mockUsers array using the id stored in the session
    if (!user) throw new Error("User not found");
    done(null, user); //if the user is found, pass the user object to the done function
  } catch (error) {
    done(error, null);
  }
});

export default passport.use(
  //Local Strategy as two parameters, 1. option object which is use to redfine the default field names for username and password and 2. a callback function that will be called when a user tries to authenticate using this strategy. The callback function takes the username and password as parameters and a done function that should be called with the user object if authentication is successful or false if authentication fails.
  new LocalStrategy(async (username, password, done) => {
    console.log("Authenticating user:", username, password);
    try {
      const user = await User.findOne({ username });
      if (!user) throw new Error("Invalid credentials");
      if (user.password !== password) throw new Error("Invalid credentials");
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  }),
);

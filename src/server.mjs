import express from "express";
import { loggingMiddleware } from "../utils/middleware.mjs";
import cookieParser from "cookie-parser";
import session from "express-session";
import { mockUsers } from "../utils/constants.mjs";
import passport from "passport";
import "./../strategies/local-strategy.mjs"; //import the local strategy for authentication

//Routes
import routes from "./routes/index.mjs";

const app = express();

//Application-level middleware
app.use(express.json()); //built-in middleware to parse JSON payloads in the request body
app.use(express.urlencoded({ extended: true })); //built-in middleware to parse URL-encoded payloads in the request body
app.use(loggingMiddleware); //custom middleware to log the request method and original URL
app.use(cookieParser("yahooCookieSecret")); //third-party middleware to parse cookies in the request headers and populate req.cookies with an object containing the cookie names and values and should be passed before the routes so that the cookies can be accessed in the route handlers.
app.use(
  session({
    secret: "roukLeadsSessionSecret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 60000 * 60, //1 hour
    },
  }),
); //third-party middleware to manage user sessions and should be passed before the routes so that the session data can be accessed in the route handlers.
app.use(passport.initialize());
app.use(passport.session()); //Passport middleware for authentication, should be passed after the session middleware so that it can access the session data to manage user authentication state.
app.use(routes); //use the routes defined in the routes/index.mjs file, which will handle all the API endpoints for our application. This should be passed after the middleware so that the middleware can be executed before the route handlers.

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  console.log("Session Data:", req.session);
  console.log("Session ID:", req.session.id);
  req.session.visited = true; //set a session variable to indicate that the user has visited the site
  res.cookie("myCookie", "cookieValue", {
    httpOnly: true,
    secure: true,
    signed: true,
    sameSite: "Strict",
    maxAge: 60000 * 60 * 2,
  });
  res.status(201).send({ msg: "Hello, World!" });
});

app.post("/api/auth/login", passport.authenticate("local"), (req, res) => {
  const {
    body: { username, password },
  } = req;

  console.log("Login attempt:", username, password);

  // If authentication is successful, the user object will be available in req.user
  if (req.user) {
    req.session.user = req.user; // Store user information in the session
    res.status(200).send({ message: "Login successful", user: req.user });
  } else {
    res.status(401).send({ message: "Login failed" });
  }
});

app.get("/api/auth/status", (req, res) => {
  console.log("Checking authentication status for session:", req.user);
  console.log("Session Data:", req.session);
  req.user
    ? res.status(200).send({ message: "Logged in", user: req.user })
    : res.status(401).send({ message: "Not logged in" });
});

app.post("/api/auth/logout", (req, res) => {
  console.log("Logging out user:", req.user);
  if (!req) return res.status(400).send({ message: "No user to log out" });
  req.logout((err) => {
    if (err) {
      console.error("Error during logout:", err);
      return res.status(500).send({ message: "Logout failed" });
    }
    res.status(200).send({ message: "Logged out successfully" });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

//Cookies are simple concept but alot people find it hard to understand, so here is a simple explanation of what cookies are and how they work and how to use them in real world applications.
// Cookies are small pieces of data that are stored on the client's browser. They are used to store information about the user and their preferences. Cookies are sent to the server with every request, and the server can use this information to personalize the user's experience. For example, a website might use cookies to remember a user's login information, so they don't have to log in every time they visit the site. Cookies can also be used for tracking and analytics purposes, allowing websites to gather data about user behavior and preferences. In real-world applications, cookies are often used in conjunction with sessions to manage user authentication and maintain state across multiple requests.:
//1. When a user visits a website, the server can set a cookie in the user's browser by including a Set-Cookie header in the response. This cookie can contain information such as a unique identifier for the user, their preferences, or any other data that the server wants to store.
//2. The user's browser will store the cookie and include it in subsequent requests to the same server by sending a Cookie header with the request. This allows the server to identify the user and provide a personalized experience based on the information stored in the cookie.
//3. Cookies can have various attributes such as httpOnly, secure, sameSite, and maxAge, which can be used to control how the cookie is stored and accessed by the browser. For example, setting httpOnly to true will prevent client-side scripts from accessing the cookie, while setting secure to true will ensure that the cookie is only sent over HTTPS connections.
//4. In real-world applications, cookies are often used in conjunction with sessions to manage user authentication and maintain state across multiple requests. When a user logs in, the server can create a session for that user and store the session ID in a cookie. This allows the server to identify the user on subsequent requests and maintain their authenticated state without requiring them to log in again.

//Session
//By default http is stateless protocol, which means that the server does not maintain any information about the client between requests. This can be a problem for web applications that need to maintain state across multiple requests, such as user authentication, shopping carts, etc. To solve this problem, we can use sessions to store information about the user and their interactions with the application across multiple requests. A session is typically created when a user logs in or performs an action that requires authentication, and it can be used to store information such as the user's ID, preferences, and other data that needs to persist across requests. Sessions are often implemented using cookies, where a unique session ID is stored in a cookie on the client's browser, allowing the server to identify the user and maintain their session state across multiple requests. In real-world applications, sessions are commonly used for user authentication, shopping carts, and other features that require maintaining state across multiple interactions with the application.
//Session represent the duration that a user interacts with a web application. It is a way to store information about the user and their interactions with the application across multiple requests. A session is typically created when a user logs in or performs an action that requires authentication, and it can be used to store information such as the user's ID, preferences, and other data that needs to persist across requests. Sessions are often implemented using cookies, where a unique session ID is stored in a cookie on the client's browser, allowing the server to identify the user and maintain their session state across multiple requests. In real-world applications, sessions are commonly used for user authentication, shopping carts, and other features that require maintaining state across multiple interactions with the application.
//

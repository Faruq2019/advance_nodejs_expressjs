import express from "express";
import { loggingMiddleware } from "../utils/middleware.mjs";
import cookieParser from "cookie-parser";

//Routes
import routes from "./routes/index.mjs";

const app = express();

//Application-level middleware
app.use(express.json()); //built-in middleware to parse JSON payloads in the request body
app.use(express.urlencoded({ extended: true })); //built-in middleware to parse URL-encoded payloads in the request body
app.use(loggingMiddleware); //custom middleware to log the request method and original URL
app.use(cookieParser("yahooCookieSecret")); //third-party middleware to parse cookies in the request headers and populate req.cookies with an object containing the cookie names and values and should be passed before the routes so that the cookies can be accessed in the route handlers.
app.use(routes); //use the routes defined in the routes/index.mjs file, which will handle all the API endpoints for our application. This should be passed after the middleware so that the middleware can be executed before the route handlers.

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.cookie("myCookie", "cookieValue", {
    httpOnly: true,
    secure: true,
    signed: true,
    sameSite: "Strict",
    maxAge: 60000 * 60 * 2,
  });
  res.status(201).send({ msg: "Hello, World!" });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

//Cookies are simple concept but alot people find it hard to understand, so here is a simple explanation of what cookies are and how they work and how to use them in real world applications.
// Cookies are small pieces of data that are stored on the client's browser. They are used to store information about the user and their preferences. Cookies are sent to the server with every request, and the server can use this information to personalize the user's experience. For example, a website might use cookies to remember a user's login information, so they don't have to log in every time they visit the site. Cookies can also be used for tracking and analytics purposes, allowing websites to gather data about user behavior and preferences. In real-world applications, cookies are often used in conjunction with sessions to manage user authentication and maintain state across multiple requests.:

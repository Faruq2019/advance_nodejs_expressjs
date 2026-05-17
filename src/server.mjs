import express from "express";
import { loggingMiddleware } from "../utils/middleware.mjs";

//Routes
import routes from "./routes/index.mjs";

const app = express();

//Application-level middleware
app.use(express.json()); //built-in middleware to parse JSON payloads in the request body
app.use(express.urlencoded({ extended: true })); //built-in middleware to parse URL-encoded payloads in the request body
app.use(loggingMiddleware); //custom middleware to log the request method and original URL
app.use(routes);

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.status(201).send({ msg: "Hello, World!" });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

import express from "express";
import {
  query,
  validationResult,
  body,
  matchedData,
  checkSchema,
} from "express-validator";
import { createUserValidationSchema } from "../validators/validationSchema.mjs";

const app = express();

const loggingMiddleware = (req, res, next) => {
  console.info(`${req.method} - ${req.originalUrl}`);
  next();
};

const resolveIndexByUserId = (req, res, next) => {
  const {
    params: { id },
  } = req;
  const parseId = parseInt(id);
  if (isNaN(parseId))
    return res.status(400).send({ msg: "Bad Request. Invalid user id" });
  const userIndex = mockUsers.findIndex((user) => user.id === parseId);
  if (userIndex === -1) return res.sendStatus(404);
  console.log("User index:", userIndex);
  req.userIndex = userIndex;
  next();
};

//Application-level middleware
app.use(express.json()); //built-in middleware to parse JSON payloads in the request body
app.use(express.urlencoded({ extended: true })); //built-in middleware to parse URL-encoded payloads in the request body
app.use(loggingMiddleware); //custom middleware to log the request method and original URL

const PORT = process.env.PORT || 3000;

const mockUsers = [
  { id: 1, username: "rouklead", displayName: "Farouk" },
  { id: 2, username: "belliscolli", displayName: "Bello" },
  { id: 3, username: "jay", displayName: "Olajide" },
  { id: 4, username: "jane_doe", displayName: "Jane Doe" },
  { id: 5, username: "john_smith", displayName: "John Smith" },
  { id: 6, username: "alice_wonder", displayName: "Alice Wonder" },
  { id: 7, username: "bob_builder", displayName: "Bob Builder" },
  { id: 8, username: "charlie_brown", displayName: "Charlie Brown" },
  { id: 9, username: "daisy_duck", displayName: "Daisy Duck" },
  { id: 10, username: "edward_snow", displayName: "Edward Snow" },
];

app.get("/", (req, res) => {
  res.status(201).send({ msg: "Hello, World!" });
});

app.get(
  "/api/users",
  query("filter")
    .isString()
    .withMessage("Filter must be a string")
    .notEmpty()
    .withMessage("Filter must be a non-empty string")
    .isLength({ min: 3, max: 10 })
    .withMessage(
      "Filter must be a non-empty string between 3 and 10 characters long",
    ),
  (req, res) => {
    console.log("Query params:", req.query);
    const result = validationResult(req);
    console.log("Validation result:", result);
    const {
      query: { filter, value },
    } = req;
    console.log("Filter:", filter, "Value:", value);
    if (filter && value)
      return res.send(mockUsers.filter((user) => user[filter].includes(value)));
    return res.send(mockUsers);
  },
);

app.post("/api/users", checkSchema(createUserValidationSchema), (req, res) => {
  console.log("Payload:", req.body);
  const result = validationResult(req);
  console.log("Validation result:", result);
  if (!result.isEmpty())
    return res.status(400).send({ errors: result.array() });

  const { username, displayName } = matchedData(req);
  console.log("Validated data:", { username, displayName });
  const newUser = { id: mockUsers.length + 1, ...{ username, displayName } };
  mockUsers.push(newUser);
  res.status(201).send(newUser);
});

app.get("/api/users/:id", resolveIndexByUserId, (req, res) => {
  //get method to fetch user by id called route parameter
  const { userIndex } = req;
  const findUser = mockUsers[userIndex];
  return res.send(findUser);
});

app.get("/api/products", (req, res) => {
  res.send([{ id: 1, name: "Laptop", price: 999.99 }]);
});

app.put("/api/users/:id", resolveIndexByUserId, (req, res) => {
  const { body, userIndex } = req;
  console.log("PUT Payload:", mockUsers[userIndex]);
  const updatedUser = { id: mockUsers[userIndex].id, ...body };
  mockUsers[userIndex] = updatedUser;
  return res.status(200).send(updatedUser);
});

app.patch("/api/users/:id", resolveIndexByUserId, (req, res) => {
  const { body, userIndex } = req;
  const updatedUser = { ...mockUsers[userIndex], ...body };
  mockUsers[userIndex] = updatedUser;
  return res.status(200).send(updatedUser);
});

app.delete("/api/users/:id", resolveIndexByUserId, (req, res) => {
  const { userIndex } = req;
  mockUsers.splice(userIndex, 1);
  return res.sendStatus(204);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

//CrUD operations: are the basic operations that can be performed on a resource. They are Create, Read, Update, and Delete.

//PUT: allows you to update a resource completely i.e you need to provide all the fields of a resource even if you want to update just one field.
//PATCH: allows you to update a resource partially i.e you can update one or more fields of a resource without affecting the other fields.
//DELETE: allows you to delete a resource.
//GET: allows you to fetch a resource or a list of resources.
//POST: allows you to create a new resource.

//Middleware

//Middleware: is a function that has access to the request and response objects and the next function in the request-response cycle. It can execute any code, make changes to the request and response objects, end the request-response cycle, or call the next middleware function in the stack.
//You can actually make use of the middleware to do some pre-processing before the request is handled by the route handler. For example, you can use middleware to log the request, validate the request body, authenticate the user, etc.
//Middleware can be implemented at the application level, router level, or route level. Application-level middleware is executed for every request to the application, router-level middleware is executed for every request to the router, and route-level middleware is executed for a specific route.
//You can also use third-party middleware like morgan for logging, cors for handling cross-origin requests, etc.
//You can also have multiple middleware functions for a single route, and they will be executed in the order they are defined.

//Validation
//Using express-validation to validate incoming request data for our express API. It allows you to define validation rules for your routes and automatically handles the validation process, returning appropriate error responses if the validation fails. This helps ensure that the data being processed by your application is in the expected format and meets the required criteria, improving the robustness and reliability of your API.
// //One may reason like why do I need to validate incoming request data ? When I already validate the data on the frontend ? The answer is that you cannot rely solely on frontend validation because it can be bypassed by malicious users. They can send requests directly to your API without going through the frontend, and if you don't have proper validation in place, it can lead to security vulnerabilities and data integrity issues. Therefore, it's essential to validate incoming request data on the server side to ensure that it meets the expected criteria and to protect your application from potential attacks.

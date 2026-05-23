import { Router } from "express";
import {
  query,
  validationResult,
  body,
  matchedData,
  checkSchema,
} from "express-validator";
import { mockUsers } from "../../utils/constants.mjs";
import { createUserValidationSchema } from "../../validators/validationSchema.mjs";
import { resolveIndexByUserId } from "../../utils/middleware.mjs";
import { User } from "./../../mongoose/schemas/user.mjs";

const router = Router();

router.get(
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
    console.log("Session Data:", req.session);
    console.log("Session ID:", req.session.id);
    req.sessionStore.get(req.session.id, (err, session) => {
      if (err) {
        console.error("Error retrieving session data:", err);
        throw err;
      }
      console.log("Session data from store:", session);
    });

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

router.get("/api/users/:id", resolveIndexByUserId, (req, res) => {
  //get method to fetch user by id called route parameter
  const { userIndex } = req;
  const findUser = mockUsers[userIndex];
  return res.send(findUser);
});

router.post(
  "/api/users",
  checkSchema(createUserValidationSchema),
  async (req, res) => {
    const result = validationResult(req);

    //Which signify that their is an error
    if (!result.isEmpty())
      res.status(400).send({
        error: true,
        message: "validation Error",
        details: result.array(),
      });

    const data = matchedData(request);

    console.log("Data", data);

    //Instance of the user model
    const newUser = new User(data);
    try {
      const savedUser = await newUser.save();
      return res
        .status(201)
        .send({ message: "User created successfully", data: savedUser });
    } catch (err) {
      console.log(err);
      return res.status(400).send({ message: "Bad request" });
    }
  },
);

router.put("/api/users/:id", resolveIndexByUserId, (req, res) => {
  const { body, userIndex } = req;
  console.log("PUT Payload:", mockUsers[userIndex]);
  const updatedUser = { id: mockUsers[userIndex].id, ...body };
  mockUsers[userIndex] = updatedUser;
  return res.status(200).send(updatedUser);
});

router.patch("/api/users/:id", resolveIndexByUserId, (req, res) => {
  const { body, userIndex } = req;
  const updatedUser = { ...mockUsers[userIndex], ...body };
  mockUsers[userIndex] = updatedUser;
  return res.status(200).send(updatedUser);
});

router.delete("/api/users/:id", resolveIndexByUserId, (req, res) => {
  const { userIndex } = req;
  mockUsers.splice(userIndex, 1);
  return res.sendStatus(204);
});

export default router;

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

import { Router } from "express";

const router = Router();

router.get("/api/products", (req, res) => {
  console.log("Header Cookies", req.headers.cookie);
  console.log("Parsed Cookies", req.cookies);
  console.log("Signed Cookies", req.signedCookies);
  if (
    req.signedCookies &&
    req.signedCookies.myCookie &&
    req.signedCookies.myCookie === "cookieValue"
  ) {
    res.send([{ id: 1, name: "Laptop", price: 999.99 }]);
  } else {
    res.status(401).send({ error: "Unauthorized" });
  }
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

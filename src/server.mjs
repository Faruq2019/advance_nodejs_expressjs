import express from "express";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;

const mockUsers = [
  { id: 1, username: "rouklead", displayName: "Farouk" },
  { id: 2, username: "belliscolli", displayName: "Ismail" },
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

app.get("/api/users", (req, res) => {
  console.log("Query params:", req.query);
  const {
    query: { filter, value },
  } = req;
  if (filter && value)
    return res.send(mockUsers.filter((user) => user[filter].includes(value)));
  return res.send(mockUsers);
});

app.post("/api/users", (req, res) => {
  console.log("Payload:", req.body);
  const { body } = req;
  const newUser = { id: mockUsers.length + 1, ...body };
  mockUsers.push(newUser);
  res.status(201).send(newUser);
});

app.get("/api/users/:id", (req, res) => {
  //get method to fetch user by id called route parameter
  console.log(req.params);
  const parseId = parseInt(req.params.id);
  if (isNaN(parseId)) {
    return res.status(400).send({ msg: "Bad Request. Invalid user id" });
  }

  const findUser = mockUsers.find((user) => user.id === parseInt(parseId));
  if (!findUser) return res.sendStatus(404);
  return res.send(findUser);
});

app.get("/api/products", (req, res) => {
  res.send([{ id: 1, name: "Laptop", price: 999.99 }]);
});

app.put("/api/users/:id", (req, res) => {
  const {
    body,
    params: { id },
  } = req;
  const parseId = parseInt(id);
  if (isNaN(parseId))
    return res.status(400).send({ msg: "Bad Request. Invalid user id" });

  const userIndex = mockUsers.findIndex((user) => user.id === parseId);
  if (userIndex === -1) return res.sendStatus(404);
  const updatedUser = { id: parseId, ...body };
  mockUsers[userIndex] = updatedUser;
  return res.status(200).send(updatedUser);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

//PUT: allows you to update a resource completely i.e you need to provide all the fields of a resource even if you want to update just one field.
//PATCH: allows you to update a resource partially i.e you can update one or more fields of a resource without affecting the other fields.
//DELETE: allows you to delete a resource.
//GET: allows you to fetch a resource or a list of resources.
//POST: allows you to create a new resource.

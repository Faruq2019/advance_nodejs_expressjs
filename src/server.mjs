import express from "express";

const app = express();
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

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

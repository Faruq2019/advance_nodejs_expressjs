import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;

const mockUsers = [
  { id: 1, username: "rouklead", displayName: "Farouk" },
  { id: 2, username: "belliscolli", displayName: "Ismail" },
  { id: 3, username: "jay", displayName: "Olajide" },
];

app.get("/", (req, res) => {
  res.status(201).send({ msg: "Hello, World!" });
});

app.get("/api/users", (req, res) => {
  res.send(mockUsers);
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

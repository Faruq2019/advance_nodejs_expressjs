import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.status(201).send({ msg: "Hello, World!" });
});

app.get("/api/users", (req, res) => {
  res.send([
    { id: 1, username: "rouklead", displayName: "Farouk" },
    { id: 2, username: "belliscolli", displayName: "Ismail" },
    { id: 3, username: "jay", displayName: "Olajide" },
  ]);
});

app.get("/api/products", (req, res) => {
  res.send([{ id: 1, name: "Laptop", price: 999.99 }]);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

import { mockUsers } from "./constants.mjs";

export const resolveIndexByUserId = (req, res, next) => {
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

export const loggingMiddleware = (req, res, next) => {
  console.info(`${req.method} - ${req.originalUrl}`);
  next();
};

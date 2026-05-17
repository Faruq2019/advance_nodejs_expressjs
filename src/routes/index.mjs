import { Router } from "express";
import usersRouter from "./users.mjs";
import productsRouter from "./products.mjs";
const router = Router();

router.use(usersRouter); //router-level middleware to handle routes related to users
router.use(productsRouter); //router-level middleware to handle routes related to products

export default router;

import { Router } from "express";
import * as user from "../controllers/user";
import { authValidator } from "../validator/auth-validator";
import validate from "../middleware/validate-middleware";

const router = Router();

router.post("/register", validate(authValidator), user.register);
router.post("/login", user.login);

export default router;
import { Router } from "express";

import { login, verify, register } from "../controller/auth.controller";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/verify", verify);
export default router;

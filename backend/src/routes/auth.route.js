import express from "express";
import { logout, signin, signup, validateSignup } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", validateSignup,signup);
router.post("/signin", signin);
router.post("/logout", logout);


export default router;
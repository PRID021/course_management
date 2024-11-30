import express from "express";
import { updateUser } from "../controllers/usersClerkController";

const router = express.Router();

router.put("/:userId", updateUser);
export default router;
import express from "express";
import { me } from "../controllers/user.controller.js";

const router = express.Router();

router.get(
  "/",
  me
);

export default router;
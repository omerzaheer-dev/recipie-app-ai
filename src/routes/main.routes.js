import express from "express";
import { main } from "../controllers/main.controller.js";

const router = express.Router();

/**
 * @swagger
 * /api/main:
 *   post:
 *     summary: Run main endpoint
 *     description: Accepts a social media URL and returns extracted recipe data.
 *     tags:
 *       - Main
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - url
 *             properties:
 *               url:
 *                 type: string
 *                 format: uri
 *                 description: Source content URL from YouTube, TikTok, Instagram, or a website.
 *                 example: https://youtu.be/RaLzxZryEoA?si=uU0mXBgki2MjvtgS
 *           example:
 *             url: https://youtu.be/RaLzxZryEoA?si=uU0mXBgki2MjvtgS
 *     responses:
 *       200:
 *         description: Successful response
 *       400:
 *         description: Bad request
 *       422:
 *         description: Description was found empty, so recipe extraction could not run
 *       500:
 *         description: Server error
 */
router.post(
  "/",
  main
);


export default router;
import express from "express";
import { VideoController } from "../controllers/index.js";
import { mdAuth } from "../middlewares/index.js";

const api = express.Router();

api.post("/video/agora/token", [mdAuth.asureAuth], VideoController.getAgoraToken);

export const videoRoutes = api;

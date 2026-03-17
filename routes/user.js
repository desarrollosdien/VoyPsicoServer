import express from "express";
import { UserController } from "../controllers/index.js";
import { mdAuth } from "../middlewares/index.js";

const api = express.Router();

api.get("/user/me", [mdAuth.asureAuth], UserController.getMe);
api.get("/user", [mdAuth.asureAuth], UserController.getUsers);
api.get("/user/:id", [mdAuth.asureAuth], UserController.getUser);
api.patch("/user/me", [mdAuth.asureAuth], UserController.updateUser);
api.put("/user/:id", [mdAuth.asureAuth], UserController.updateUser);
api.post("/user/pushTokenNotification/:userId", [mdAuth.asureAuth], UserController.saveExpoNotification);
api.post("/user/push-token", [mdAuth.asureAuth], UserController.saveExpoNotification);

export const userRoutes = api;

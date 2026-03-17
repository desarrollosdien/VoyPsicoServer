import express from "express";
import { ChatController } from "../controllers/index.js";
import { mdAuth } from "../middlewares/index.js";

const api = express.Router();

api.get("/chats", [mdAuth.asureAuth], ChatController.getChats);
api.get("/mensajes/:chatId", [mdAuth.asureAuth], ChatController.getMensajes);
api.post("/mensajes", [mdAuth.asureAuth], ChatController.createMensaje);

export const chatRoutes = api;

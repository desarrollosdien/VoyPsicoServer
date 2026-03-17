import express from "express";
import { CitaController } from "../controllers/index.js";
import { mdAuth } from "../middlewares/index.js";

const api = express.Router();

api.get("/citas/mias", [mdAuth.asureAuth], CitaController.getMisCitas);
api.get("/citas/psicologo", [mdAuth.asureAuth], CitaController.getCitasPsicologo);
api.post("/cita", [mdAuth.asureAuth], CitaController.createCita);
api.get("/cita/:id", [mdAuth.asureAuth], CitaController.getCita);
api.put("/cita/:id/confirmar", [mdAuth.asureAuth], CitaController.confirmarCita);
api.put("/cita/cancelar/:id", [mdAuth.asureAuth], CitaController.cancelarCita);
api.get("/sesion/activa", [mdAuth.asureAuth], CitaController.getSesionActiva);
api.get("/sesiones/historial", [mdAuth.asureAuth], CitaController.getSesionesHistorial);

export const citaRoutes = api;

import express from "express";
import { PsicologoController } from "../controllers/index.js";
import { mdAuth } from "../middlewares/index.js";

const api = express.Router();

api.get("/psicologos", [mdAuth.asureAuth], PsicologoController.getPsicologos);
api.get("/psicologo/:id", [mdAuth.asureAuth], PsicologoController.getPsicologo);
api.put("/psicologo/:id", [mdAuth.asureAuth], PsicologoController.updatePsicologo);
api.get("/psicologo/:id/estadisticas", [mdAuth.asureAuth], PsicologoController.getEstadisticas);
api.get("/psicologo/:id/pacientes", [mdAuth.asureAuth], PsicologoController.getPacientes);
api.get("/psicologo/:id/horarios", [mdAuth.asureAuth], PsicologoController.getHorarios);
api.put("/psicologo/:id/horarios", [mdAuth.asureAuth], PsicologoController.setHorarios);
api.get("/disponibilidad/:psicologoId", [mdAuth.asureAuth], PsicologoController.getDisponibilidad);
api.put("/disponibilidad/:psicologoId", [mdAuth.asureAuth], PsicologoController.setDisponibilidad);

export const psicologoRoutes = api;

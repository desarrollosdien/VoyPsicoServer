import crypto from "crypto";
import { CitaDoc, SesionActivaDoc, SesionHistorialDoc } from "./mongo.js";

function createId(prefix) {
  return `${prefix}-${crypto.randomBytes(4).toString("hex")}`;
}

async function findById(citaId) {
  return CitaDoc.findById(citaId).lean();
}

async function findByPaciente(userId) {
  return CitaDoc.find({ "paciente._id": userId }).lean();
}

async function findByPsicologo(userId, fecha) {
  const query = { "psicologo._id": userId };
  if (fecha) query.fecha = fecha;
  return CitaDoc.find(query).lean();
}

async function findForAdmin(filters = {}) {
  const query = {};
  if (filters.fecha) query.fecha = filters.fecha;
  if (filters.psicologoId) query["psicologo._id"] = filters.psicologoId;
  if (filters.pacienteId) query["paciente._id"] = filters.pacienteId;
  return CitaDoc.find(query).lean();
}

async function findByUser(userId) {
  return CitaDoc.find({
    $or: [
      { "paciente._id": userId },
      { "psicologo._id": userId },
    ],
  }).lean();
}

async function create(payload) {
  const cita = await CitaDoc.create({
    _id: createId("cita"),
    estado: "pendiente",
    ...payload,
  });
  return cita;
}

async function findActiveBySlot(psicologoId, fecha, horaInicio, horaFin) {
  return CitaDoc.findOne({
    "psicologo._id": psicologoId,
    fecha,
    hora_inicio: horaInicio,
    hora_fin: horaFin,
    estado: { $in: ["pendiente", "confirmada", "completada"] },
  }).lean();
}

async function updateById(citaId, payload) {
  return CitaDoc.findByIdAndUpdate(
    citaId,
    { $set: payload || {} },
    { new: true, lean: true },
  );
}

async function getSesionActiva() {
  const record = await SesionActivaDoc.findById("activa").lean();
  return record?.payload || null;
}

async function getSesionesHistorial() {
  return SesionHistorialDoc.find({}).lean();
}

export const Cita = {
  findById,
  findByPaciente,
  findByPsicologo,
  findForAdmin,
  findByUser,
  create,
  findActiveBySlot,
  updateById,
  getSesionActiva,
  getSesionesHistorial,
};

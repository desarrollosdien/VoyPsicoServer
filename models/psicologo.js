import {
  CitaDoc,
  DisponibilidadDoc,
  EstadisticaDoc,
  HorariosDoc,
  PacienteDoc,
  PsicologoDoc,
} from "./mongo.js";

async function list(filters = {}) {
  const { especialidad, ciudad } = filters;
  const query = {};

  if (especialidad) {
    query.especialidades = { $elemMatch: { $regex: String(especialidad), $options: "i" } };
  }

  if (ciudad) {
    query.ciudad = { $regex: String(ciudad), $options: "i" };
  }

  return PsicologoDoc.find(query).lean();
}

async function findById(psicologoId) {
  return PsicologoDoc.findById(psicologoId).lean();
}

async function updateById(psicologoId, payload) {
  return PsicologoDoc.findByIdAndUpdate(
    psicologoId,
    { $set: payload || {} },
    { new: true, lean: true },
  );
}

async function getDisponibilidad(psicologoId) {
  const disponibilidad = await DisponibilidadDoc.findById(psicologoId).lean();
  return { slots: disponibilidad?.slots || [] };
}

async function getDisponibilidadByFecha(psicologoId, fecha) {
  const disponibilidad = await DisponibilidadDoc.findById(psicologoId).lean();
  const baseSlots = Array.isArray(disponibilidad?.slots) ? disponibilidad.slots : [];

  if (!fecha) {
    return { slots: baseSlots };
  }

  const citasActivas = await CitaDoc.find({
    "psicologo._id": psicologoId,
    fecha,
    estado: { $in: ["pendiente", "confirmada", "completada"] },
  }).lean();

  const occupiedBySlot = new Map();
  for (const cita of citasActivas) {
    const key = `${cita.hora_inicio}|${cita.hora_fin}`;
    occupiedBySlot.set(key, cita);
  }

  const slots = baseSlots.map((slot) => {
    const key = `${slot.inicio}|${slot.fin}`;
    const cita = occupiedBySlot.get(key);
    const ocupado = Boolean(cita);
    return {
      ...slot,
      disponible: Boolean(slot.disponible) && !ocupado,
      ocupado,
      citaConfirmada: ocupado,
      estadoCita: cita?.estado,
      paciente: cita?.paciente
        ? `${cita.paciente.firstname || ""} ${cita.paciente.lastname || ""}`.trim()
        : null,
      citaId: cita?._id || null,
      fecha,
    };
  });

  return { slots };
}

async function setDisponibilidad(psicologoId, slots = []) {
  const normalizedSlots = Array.isArray(slots) ? slots : [];

  await PsicologoDoc.findByIdAndUpdate(
    psicologoId,
    { $set: { slots: normalizedSlots } },
    { lean: true },
  );

  await DisponibilidadDoc.findByIdAndUpdate(
    psicologoId,
    { $set: { _id: psicologoId, slots: normalizedSlots } },
    { upsert: true, new: true, lean: true },
  );

  return { slots: normalizedSlots };
}

async function getPacientes(psicologoId) {
  const data = await CitaDoc.find({ "psicologo._id": psicologoId }).lean();
  const desdeCitas = data
    .map((item) => ({
      id: item.paciente?._id,
      userId: item.paciente?._id,
      nombre: `${item.paciente?.firstname || ""} ${item.paciente?.lastname || ""}`.trim(),
      ultimaSesion: item.fecha,
      progreso: "Seguimiento",
    }));

  const unicos = [];
  const vistos = new Set();
  for (const paciente of desdeCitas) {
    if (!paciente.id || vistos.has(paciente.id)) continue;
    vistos.add(paciente.id);
    unicos.push(paciente);
  }

  if (unicos.length > 0) return unicos;

  const fallbackPacientes = await PacienteDoc.find({}).lean();
  return fallbackPacientes.map((paciente) => ({
    id: paciente._id,
    userId: paciente.userId,
    nombre: paciente.nombre,
    ultimaSesion: paciente.ultimaSesion,
    progreso: paciente.progreso,
  }));
}

async function getHorarios(psicologoId) {
  const record = await HorariosDoc.findById(psicologoId).lean();
  return record?.horarios || [];
}

async function setHorarios(psicologoId, data = []) {
  const horarios = Array.isArray(data) ? data : [];

  await PsicologoDoc.findByIdAndUpdate(
    psicologoId,
    { $set: { horarios } },
    { lean: true },
  );

  await HorariosDoc.findByIdAndUpdate(
    psicologoId,
    { $set: { _id: psicologoId, horarios } },
    { upsert: true, new: true, lean: true },
  );

  return horarios;
}

async function getEstadisticas() {
  const record = await EstadisticaDoc.findById("global").lean();
  if (record) {
    return {
      sesionesMes: record.sesionesMes,
      ingresosMes: record.ingresosMes,
      pacientesActivos: record.pacientesActivos,
      valoracionMedia: record.valoracionMedia,
      ocupacionSemanal: record.ocupacionSemanal || [],
    };
  }

  return {
    sesionesMes: 0,
    ingresosMes: 0,
    pacientesActivos: 0,
    valoracionMedia: 0,
    ocupacionSemanal: [],
  };
}

export const Psicologo = {
  list,
  findById,
  updateById,
  getDisponibilidad,
  getDisponibilidadByFecha,
  setDisponibilidad,
  getPacientes,
  getHorarios,
  setHorarios,
  getEstadisticas,
};

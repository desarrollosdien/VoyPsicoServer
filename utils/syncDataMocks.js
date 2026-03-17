import {
  chats,
  citas,
  disponibilidades,
  estadisticas,
  horarios,
  mensajes,
  pacientes,
  psicologos,
  sesionActiva,
  sesionesHistorial,
  users,
} from "../scripts/seed-data.js";
import {
  ChatDoc,
  CitaDoc,
  DisponibilidadDoc,
  EstadisticaDoc,
  HorariosDoc,
  MensajeDoc,
  MockMetaDoc,
  PacienteDoc,
  PsicologoDoc,
  SesionActivaDoc,
  SesionHistorialDoc,
  UserDoc,
} from "../models/mongo.js";

function onInsertSet(document) {
  return { $setOnInsert: document };
}

export async function syncDataMocks() {
  await UserDoc.bulkWrite(
    users.map((user) => ({
      updateOne: {
        filter: { _id: user._id },
        update: onInsertSet(user),
        upsert: true,
      },
    })),
  );

  const psicologosConExtras = psicologos.map((psicologo) => ({
    ...psicologo,
    slots: disponibilidades[psicologo._id]?.slots || [],
    horarios: horarios[psicologo._id] || [],
  }));

  await PsicologoDoc.bulkWrite(
    psicologosConExtras.map((psicologo) => ({
      updateOne: {
        filter: { _id: psicologo._id },
        update: onInsertSet(psicologo),
        upsert: true,
      },
    })),
  );

  await CitaDoc.bulkWrite(
    citas.map((cita) => ({
      updateOne: {
        filter: { _id: cita._id },
        update: onInsertSet(cita),
        upsert: true,
      },
    })),
  );

  await ChatDoc.bulkWrite(
    chats.map((chat) => ({
      updateOne: {
        filter: { _id: chat._id },
        update: onInsertSet(chat),
        upsert: true,
      },
    })),
  );

  await MensajeDoc.bulkWrite(
    mensajes.map((mensaje) => ({
      updateOne: {
        filter: { _id: mensaje._id },
        update: onInsertSet({
          ...mensaje,
          createdAt: mensaje.createdAt ? new Date(mensaje.createdAt) : new Date(),
        }),
        upsert: true,
      },
    })),
  );

  const metas = [
    { key: "estadisticas", payload: estadisticas },
    { key: "sesionActiva", payload: sesionActiva },
    { key: "sesionesHistorial", payload: sesionesHistorial },
    { key: "pacientes", payload: pacientes },
  ];

  await MockMetaDoc.bulkWrite(
    metas.map((meta) => ({
      updateOne: {
        filter: { key: meta.key },
        update: onInsertSet(meta),
        upsert: true,
      },
    })),
  );

  await DisponibilidadDoc.bulkWrite(
    Object.entries(disponibilidades).map(([psicologoId, data]) => ({
      updateOne: {
        filter: { _id: psicologoId },
        update: onInsertSet({ _id: psicologoId, slots: data?.slots || [] }),
        upsert: true,
      },
    })),
  );

  await HorariosDoc.bulkWrite(
    Object.entries(horarios).map(([psicologoId, data]) => ({
      updateOne: {
        filter: { _id: psicologoId },
        update: onInsertSet({ _id: psicologoId, horarios: Array.isArray(data) ? data : [] }),
        upsert: true,
      },
    })),
  );

  await PacienteDoc.bulkWrite(
    pacientes.map((paciente) => ({
      updateOne: {
        filter: { _id: paciente.id || paciente._id },
        update: onInsertSet({
          _id: paciente.id || paciente._id,
          userId: paciente.userId,
          nombre: paciente.nombre,
          ultimaSesion: paciente.ultimaSesion,
          progreso: paciente.progreso,
        }),
        upsert: true,
      },
    })),
  );

  await EstadisticaDoc.updateOne(
    { _id: "global" },
    onInsertSet({ _id: "global", ...estadisticas }),
    { upsert: true },
  );

  await SesionActivaDoc.updateOne(
    { _id: "activa" },
    onInsertSet({ _id: "activa", payload: sesionActiva }),
    { upsert: true },
  );

  await SesionHistorialDoc.bulkWrite(
    sesionesHistorial.map((sesion) => ({
      updateOne: {
        filter: { _id: sesion.id || sesion._id },
        update: onInsertSet({
          _id: sesion.id || sesion._id,
          fecha: sesion.fecha,
          psicologoNombre: sesion.psicologoNombre,
          duracion: sesion.duracion,
          valoracion: sesion.valoracion,
          nota: sesion.nota,
        }),
        upsert: true,
      },
    })),
  );
}

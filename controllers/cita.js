import { Chat, Cita, Psicologo, User } from "../models/index.js";

async function getMisCitas(req, res) {
  const citas = await Cita.findByPaciente(req.user.user_id);
  return res.status(200).send({ citas });
}

async function getCitasPsicologo(req, res) {
  const isAdmin = req.userData?.rol === "admin";
  const fecha = req.query?.fecha;

  const citas = isAdmin
    ? await Cita.findForAdmin({
      fecha,
      psicologoId: req.query?.psicologoId,
      pacienteId: req.query?.pacienteId,
    })
    : await Cita.findByPsicologo(req.user.user_id, fecha);

  return res.status(200).send({ citas });
}

async function createCita(req, res) {
  const payload = req.body || {};
  const rol = req.userData?.rol;

  const psicologoId = payload.psicologo;
  const fecha = payload.fecha;
  const horaInicio = payload.hora_inicio;
  const horaFin = payload.hora_fin;

  if (!psicologoId || !fecha || !horaInicio || !horaFin) {
    return res.status(400).send({ msg: "Datos de reserva incompletos" });
  }

  const psicologo = await Psicologo.findById(psicologoId);
  if (!psicologo) {
    return res.status(404).send({ msg: "Psicólogo no encontrado" });
  }

  let paciente = null;
  if (rol === "paciente") {
    paciente = req.userData;
  } else if (rol === "admin" && payload.paciente) {
    paciente = await User.findById(payload.paciente);
  }

  if (!paciente) {
    return res.status(403).send({ msg: "No autorizado para crear esta cita" });
  }

  const disponibilidad = await Psicologo.getDisponibilidadByFecha(psicologoId, fecha);
  const slot = (disponibilidad?.slots || []).find(
    (item) => item.inicio === horaInicio && item.fin === horaFin,
  );

  if (!slot) {
    return res.status(400).send({ msg: "El horario seleccionado no existe" });
  }

  if (!slot.disponible) {
    return res.status(409).send({ msg: "El horario seleccionado ya no está disponible" });
  }

  const activeCita = await Cita.findActiveBySlot(psicologoId, fecha, horaInicio, horaFin);
  if (activeCita) {
    return res.status(409).send({ msg: "El horario seleccionado ya está reservado" });
  }

  const cita = await Cita.create({
    psicologo: {
      _id: psicologo._id,
      firstname: psicologo.firstname,
      lastname: psicologo.lastname,
      email: psicologo.email,
    },
    paciente: {
      _id: paciente._id,
      firstname: paciente.firstname,
      lastname: paciente.lastname,
      email: paciente.email,
    },
    fecha,
    hora_inicio: horaInicio,
    hora_fin: horaFin,
    tipo: payload.tipo || slot.tipo || "online",
    precio_total: payload.precio_total ?? slot.precio ?? psicologo.precioSesion ?? 0,
    motivo: payload.motivo || "",
    notas: payload.notas || "",
    estado: "pendiente",
  });

  await Chat.ensureChatForUsers(paciente._id, psicologo._id);

  return res.status(201).send({ cita });
}

async function getCita(req, res) {
  const cita = await Cita.findById(req.params.id);
  if (!cita) {
    return res.status(404).send({ msg: "Cita no encontrada" });
  }
  return res.status(200).send({ cita });
}

async function confirmarCita(req, res) {
  if (!["psicologo", "admin"].includes(req.userData?.rol)) {
    return res.status(403).send({ msg: "No autorizado para confirmar citas" });
  }

  const citaActual = await Cita.findById(req.params.id);
  if (!citaActual) {
    return res.status(404).send({ msg: "Cita no encontrada" });
  }

  const isOwnerPsicologo = req.userData?.rol === "psicologo"
    && citaActual.psicologo?._id === req.user.user_id;
  if (req.userData?.rol === "psicologo" && !isOwnerPsicologo) {
    return res.status(403).send({ msg: "No autorizado para confirmar esta cita" });
  }

  const cita = await Cita.updateById(req.params.id, { estado: "confirmada" });
  if (!cita) {
    return res.status(404).send({ msg: "Cita no encontrada" });
  }

  await Chat.ensureChatForUsers(cita.paciente?._id, cita.psicologo?._id);

  return res.status(200).send({ cita });
}

async function cancelarCita(req, res) {
  const citaActual = await Cita.findById(req.params.id);
  if (!citaActual) {
    return res.status(404).send({ msg: "Cita no encontrada" });
  }

  const isAdmin = req.userData?.rol === "admin";
  const isPacienteOwner = req.userData?.rol === "paciente"
    && citaActual.paciente?._id === req.user.user_id;
  const isPsicologoOwner = req.userData?.rol === "psicologo"
    && citaActual.psicologo?._id === req.user.user_id;

  if (!isAdmin && !isPacienteOwner && !isPsicologoOwner) {
    return res.status(403).send({ msg: "No autorizado para cancelar esta cita" });
  }

  const cita = await Cita.updateById(req.params.id, {
    estado: "cancelada",
    motivo_cancelacion: req.body?.motivo || "",
  });
  if (!cita) {
    return res.status(404).send({ msg: "Cita no encontrada" });
  }
  return res.status(200).send({ cita });
}

async function getSesionActiva(_req, res) {
  return res.status(200).send({ sesion: await Cita.getSesionActiva() });
}

async function getSesionesHistorial(_req, res) {
  return res.status(200).send({ sesiones: await Cita.getSesionesHistorial() });
}

export const CitaController = {
  getMisCitas,
  getCitasPsicologo,
  createCita,
  getCita,
  confirmarCita,
  cancelarCita,
  getSesionActiva,
  getSesionesHistorial,
};

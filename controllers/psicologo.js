import { Psicologo } from "../models/index.js";

async function getPsicologos(req, res) {
  console.log(`[PSICO] GET /psicologos - query=${JSON.stringify(req.query || {})} user=${req.user?._id || 'anon'} ip=${req.ip} time=${new Date().toISOString()}`);
  const psicologos = await Psicologo.list(req.query || {});
  return res.status(200).send({ psicologos });
}

async function getPsicologo(req, res) {
  console.log(`[PSICO] GET /psicologo/${req.params.id} - params=${JSON.stringify(req.params)} user=${req.user?._id || 'anon'} ip=${req.ip} time=${new Date().toISOString()}`);
  const psicologo = await Psicologo.findById(req.params.id);
  if (!psicologo) {
    return res.status(404).send({ msg: "Psicólogo no encontrado" });
  }
  return res.status(200).send({ psicologo });
}

async function updatePsicologo(req, res) {
  const psicologo = await Psicologo.updateById(req.params.id, req.body || {});
  if (!psicologo) {
    return res.status(404).send({ msg: "Psicólogo no encontrado" });
  }
  return res.status(200).send({ psicologo });
}

async function getDisponibilidad(req, res) {
  const fecha = req.query?.fecha;
  if (fecha) {
    return res.status(200).send(
      await Psicologo.getDisponibilidadByFecha(req.params.psicologoId, fecha),
    );
  }
  return res.status(200).send(await Psicologo.getDisponibilidad(req.params.psicologoId));
}

async function setDisponibilidad(req, res) {
  const disponibilidad = await Psicologo.setDisponibilidad(
    req.params.psicologoId,
    req.body?.slots || [],
  );
  return res.status(200).send({ ok: true, disponibilidad });
}

async function getEstadisticas(_req, res) {
  return res.status(200).send({ estadisticas: await Psicologo.getEstadisticas() });
}

async function getPacientes(req, res) {
  const psicologoId = req.params.id;
  return res.status(200).send({ pacientes: await Psicologo.getPacientes(psicologoId) });
}

async function getHorarios(req, res) {
  const psicologoId = req.params.id;
  return res.status(200).send({ horarios: await Psicologo.getHorarios(psicologoId) });
}

async function setHorarios(req, res) {
  const psicologoId = req.params.id;
  const data = await Psicologo.setHorarios(psicologoId, req.body?.horarios || []);
  return res.status(200).send({ ok: true, horarios: data });
}

export const PsicologoController = {
  getPsicologos,
  getPsicologo,
  updatePsicologo,
  getDisponibilidad,
  setDisponibilidad,
  getEstadisticas,
  getPacientes,
  getHorarios,
  setHorarios,
};

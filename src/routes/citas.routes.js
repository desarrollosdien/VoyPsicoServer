const express = require("express");
const { authRequired } = require("../auth");
const { citas, createCita } = require("../mockDb");

const router = express.Router();

router.get("/citas/mias", authRequired, (req, res) => {
  const list = citas.filter((c) => c.paciente?._id === req.user._id);
  return res.json({ citas: list });
});

router.get("/citas/psicologo", authRequired, (req, res) => {
  const { fecha } = req.query;
  let list = citas.filter((c) => c.psicologo?._id === req.user._id || req.user.rol === "admin");
  if (fecha) list = list.filter((c) => c.fecha === fecha);
  return res.json({ citas: list });
});

router.post("/cita", authRequired, (req, res) => {
  const payload = req.body || {};
  const nueva = createCita(payload);
  return res.status(201).json({ cita: nueva });
});

router.get("/cita/:id", authRequired, (req, res) => {
  const cita = citas.find((c) => c._id === req.params.id);
  if (!cita) return res.status(404).json({ message: "Cita no encontrada" });
  return res.json({ cita });
});

router.put("/cita/:id/confirmar", authRequired, (req, res) => {
  const idx = citas.findIndex((c) => c._id === req.params.id);
  if (idx < 0) return res.status(404).json({ message: "Cita no encontrada" });
  citas[idx].estado = "confirmada";
  return res.json({ cita: citas[idx] });
});

router.put("/cita/cancelar/:id", authRequired, (req, res) => {
  const idx = citas.findIndex((c) => c._id === req.params.id);
  if (idx < 0) return res.status(404).json({ message: "Cita no encontrada" });
  citas[idx].estado = "cancelada";
  citas[idx].motivo_cancelacion = req.body?.motivo || "";
  return res.json({ cita: citas[idx] });
});

module.exports = router;

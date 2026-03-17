const express = require("express");
const { authRequired } = require("../auth");
const { psicologos, disponibilidad } = require("../mockDb");

const router = express.Router();

router.get("/psicologos", authRequired, (req, res) => {
  const { especialidad, ciudad } = req.query;

  let list = [...psicologos];
  if (especialidad) {
    const term = String(especialidad).toLowerCase();
    list = list.filter((p) => p.especialidades?.some((e) => e.toLowerCase().includes(term)));
  }
  if (ciudad) {
    const c = String(ciudad).toLowerCase();
    list = list.filter((p) => p.ciudad?.toLowerCase().includes(c));
  }

  return res.json({ psicologos: list });
});

router.get("/psicologo/:id", authRequired, (req, res) => {
  const p = psicologos.find((x) => x._id === req.params.id);
  if (!p) return res.status(404).json({ message: "Psicólogo no encontrado" });
  return res.json({ psicologo: p });
});

router.put("/psicologo/:id", authRequired, (req, res) => {
  const idx = psicologos.findIndex((x) => x._id === req.params.id);
  if (idx < 0) return res.status(404).json({ message: "Psicólogo no encontrado" });
  psicologos[idx] = { ...psicologos[idx], ...req.body };
  return res.json({ psicologo: psicologos[idx] });
});

router.get("/psicologo/:id/estadisticas", authRequired, (_req, res) => {
  return res.json({
    estadisticas: {
      sesionesMes: 42,
      ingresosMes: 2310,
      pacientesActivos: 18,
      valoracionMedia: 4.8,
      ocupacionSemanal: [65, 72, 80, 76],
    },
  });
});

router.get("/disponibilidad/:psicologoId", authRequired, (req, res) => {
  const data = disponibilidad[req.params.psicologoId] || { slots: [] };
  return res.json(data);
});

router.put("/disponibilidad/:psicologoId", authRequired, (req, res) => {
  disponibilidad[req.params.psicologoId] = {
    slots: req.body?.slots || disponibilidad[req.params.psicologoId]?.slots || [],
  };
  return res.json({ ok: true, disponibilidad: disponibilidad[req.params.psicologoId] });
});

module.exports = router;

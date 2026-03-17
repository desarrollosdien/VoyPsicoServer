const express = require("express");
const { users } = require("../mockDb");
const { authRequired } = require("../auth");

const router = express.Router();

router.get("/me", authRequired, (req, res) => {
  const { password, ...safe } = req.user;
  return res.json(safe);
});

router.get("/:userId", authRequired, (req, res) => {
  const user = users.find((u) => u._id === req.params.userId);
  if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
  const { password, ...safe } = user;
  return res.json(safe);
});

router.put("/:userId", authRequired, (req, res) => {
  const idx = users.findIndex((u) => u._id === req.params.userId);
  if (idx < 0) return res.status(404).json({ message: "Usuario no encontrado" });

  users[idx] = { ...users[idx], ...req.body };
  const { password, ...safe } = users[idx];
  return res.json({ user: safe });
});

router.post("/push-token", authRequired, (req, res) => {
  return res.json({ ok: true, pushToken: req.body?.pushToken || null });
});

module.exports = router;

const express = require("express");
const jwt = require("jsonwebtoken");
const { users } = require("../mockDb");
const { config } = require("../config");
const { signAccessToken, signRefreshToken } = require("../auth");

const router = express.Router();

router.post("/register", (req, res) => {
  const { firstname, lastname, email, password, rol = "paciente" } = req.body || {};
  if (!firstname || !lastname || !email || !password) {
    return res.status(400).json({ message: "Campos requeridos incompletos" });
  }
  const exists = users.some((u) => u.email.toLowerCase() === email.toLowerCase());
  if (exists) return res.status(409).json({ message: "Email ya registrado" });

  const user = {
    _id: `usr-${Date.now()}`,
    firstname,
    lastname,
    email: email.toLowerCase(),
    password,
    rol,
  };
  users.push(user);
  return res.status(201).json({ user: { ...user, password: undefined } });
});

router.post("/login", (req, res) => {
  const { email, password } = req.body || {};
  const user = users.find(
    (u) => u.email.toLowerCase() === String(email || "").toLowerCase() && u.password === password,
  );
  if (!user) return res.status(401).json({ message: "Credenciales inválidas" });

  return res.json({
    accessToken: signAccessToken(user),
    refreshToken: signRefreshToken(user),
  });
});

router.post("/refresh-token", (req, res) => {
  const { refreshToken } = req.body || {};
  if (!refreshToken) return res.status(400).json({ message: "refreshToken requerido" });

  try {
    const decoded = jwt.verify(refreshToken, config.jwtSecret);
    if (decoded.type !== "refresh") throw new Error("Tipo inválido");
    const user = users.find((u) => u._id === decoded.sub);
    if (!user) return res.status(401).json({ message: "Usuario no encontrado" });
    return res.json({ accessToken: signAccessToken(user) });
  } catch (_err) {
    return res.status(401).json({ message: "refreshToken inválido" });
  }
});

module.exports = router;

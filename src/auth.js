const jwt = require("jsonwebtoken");
const { config } = require("./config");
const { users } = require("./mockDb");

function signAccessToken(user) {
  return jwt.sign(
    { sub: user._id, rol: user.rol, email: user.email, type: "access" },
    config.jwtSecret,
    { expiresIn: "7d" },
  );
}

function signRefreshToken(user) {
  return jwt.sign(
    { sub: user._id, type: "refresh" },
    config.jwtSecret,
    { expiresIn: "30d" },
  );
}

function parseBearer(tokenHeader = "") {
  if (!tokenHeader.startsWith("Bearer ")) return null;
  return tokenHeader.slice(7);
}

function authRequired(req, res, next) {
  const raw = parseBearer(req.headers.authorization || "");
  if (!raw) return res.status(401).json({ message: "Token requerido" });

  try {
    const payload = jwt.verify(raw, config.jwtSecret);
    const user = users.find((u) => u._id === payload.sub);
    if (!user) return res.status(401).json({ message: "Usuario inválido" });
    req.user = user;
    return next();
  } catch (_err) {
    return res.status(401).json({ message: "Token inválido" });
  }
}

module.exports = {
  signAccessToken,
  signRefreshToken,
  authRequired,
};

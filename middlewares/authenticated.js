import { jwt } from "../utils/index.js";
import { User } from "../models/index.js";

async function asureAuth(req, res, next) {
  if (!req.headers.authorization) {
    return res.status(403).send({ msg: "La petición no tiene la cabecera de autenticación" });
  }

  const token = req.headers.authorization.replace("Bearer ", "");

  try {
    const hasExpired = jwt.hasExpiredToken(token);
    if (hasExpired) {
      return res.status(400).send({ msg: "El token ha expirado" });
    }

    const payload = jwt.decoded(token);
    const user = await User.findById(payload.user_id);
    if (!user) {
      return res.status(400).send({ msg: "Usuario no encontrado" });
    }

    req.user = payload;
    req.userData = user;
    next();
  } catch (_error) {
    return res.status(400).send({ msg: "Token invalido" });
  }
}

export const mdAuth = {
  asureAuth,
};

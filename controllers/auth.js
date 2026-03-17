import { User } from "../models/index.js";
import { jwt } from "../utils/index.js";

async function register(req, res) {
  const formData = req.body?.newUser || req.body || {};
  const email = formData?.email?.toLowerCase()?.trim();

  if (!email || !formData.password || !formData.firstname || !formData.lastname) {
    return res.status(400).send({ msg: "Datos de registro incompletos", type: "KO" });
  }

  const userFind = await User.findOne({ email });
  if (userFind) {
    return res.status(409).send({ msg: "Usuario ya registrado", type: "KO" });
  }

  const user = await User.register({
    email,
    firstname: formData.firstname,
    lastname: formData.lastname,
    password: formData.password,
    telefono: formData.telefono || "",
    rol: formData.rol || "paciente",
    genero: formData.genero || "",
    fechaNacimiento: formData.fechaNacimiento || null,
  });

  return res.status(201).send(User.sanitize(user));
}

async function login(req, res) {
  const { email, password } = req.body || {};
  const emailLowerCase = String(email || "").toLowerCase();
  console.log(`[AUTH] login attempt - email=${emailLowerCase} ip=${req.ip} time=${new Date().toISOString()}`);
  const userStorage = await User.findOne({ email: emailLowerCase });

  if (!userStorage) {
    return res.status(400).send({ msg: "Usuario no encontrado", tipo: "KO1" });
  }

  if (userStorage.password !== password) {
    return res.status(400).send({ msg: "Contraseña incorrecta", tipo: "KO2" });
  }

  if (!userStorage.activo) {
    return res.status(400).send({
      msg: "Usuario dado de baja",
      tipo: "USER_BAJA",
      access: jwt.createAccessToken(userStorage),
      refresh: jwt.createRefreshToken(userStorage),
    });
  }

  return res.status(200).send({
    accessToken: jwt.createAccessToken(userStorage),
    refreshToken: jwt.createRefreshToken(userStorage),
    access: jwt.createAccessToken(userStorage),
    refresh: jwt.createRefreshToken(userStorage),
  });
}

async function refreshAccessToken(req, res) {
  const refreshtoken = req.body?.refreshtoken || req.body?.refreshToken;
  if (!refreshtoken) {
    return res.status(400).send({ msg: "Token requerido" });
  }

  const hasExpired = jwt.hasExpiredToken(refreshtoken);
  if (hasExpired) {
    return res.status(400).send({ msg: "Token expirado" });
  }

  const { user_id } = jwt.decoded(refreshtoken);
  const userStorage = await User.findById(user_id);
  if (!userStorage) {
    return res.status(404).send({ msg: "Usuario no encontrado" });
  }

  return res.status(200).send({
    accessToken: jwt.createAccessToken(userStorage),
    access: jwt.createAccessToken(userStorage),
  });
}

export const AuthController = {
  register,
  login,
  refreshAccessToken,
};

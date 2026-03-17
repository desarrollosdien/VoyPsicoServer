import crypto from "crypto";
import { PushTokenDoc } from "../models/mongo.js";
import { User } from "../models/index.js";

function getMe(req, res) {
  return res.status(200).send(User.sanitize(req.userData));
}

async function getUsers(_req, res) {
  return res.status(200).send({ users: await User.list() });
}

async function getUser(req, res) {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).send({ msg: "Usuario no encontrado" });
  }
  return res.status(200).send(User.sanitize(user));
}

async function updateUser(req, res) {
  const targetUserId = req.params.id || req.user.user_id;
  const user = await User.updateById(targetUserId, req.body || {});
  if (!user) {
    return res.status(404).send({ msg: "Usuario no encontrado" });
  }
  return res.status(200).send({ user: User.sanitize(user) });
}

async function saveExpoNotification(req, res) {
  const record = {
    _id: `push-${crypto.randomBytes(4).toString("hex")}`,
    userId: req.params.userId || req.body?.userId,
    pushToken: req.body?.pushToken,
    savedAt: new Date().toISOString(),
  };

  if (!record.userId || !record.pushToken) {
    return res.status(400).send({ msg: "userId y pushToken son requeridos" });
  }

  await PushTokenDoc.findOneAndUpdate(
    { userId: record.userId, pushToken: record.pushToken },
    { $set: record },
    { upsert: true, new: true, lean: true },
  );

  return res.status(200).send({ ok: true, record });
}

export const UserController = {
  getMe,
  getUsers,
  getUser,
  updateUser,
  saveExpoNotification,
};

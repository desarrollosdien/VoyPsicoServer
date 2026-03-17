import crypto from "crypto";
import { UserDoc } from "./mongo.js";

function createId(prefix) {
  return `${prefix}-${crypto.randomBytes(4).toString("hex")}`;
}

function sanitize(user) {
  if (!user) return null;
  const { password, ...safe } = user;
  return safe;
}

async function findById(userId) {
  const user = await UserDoc.findById(userId).lean();
  return user || null;
}

async function findOne(query = {}) {
  const user = await UserDoc.findOne(query).lean();
  return user || null;
}

async function register(payload) {
  const user = await UserDoc.create({
    _id: createId("usr"),
    activo: true,
    avatar: null,
    ...payload,
  });
  return user;
}

async function updateById(userId, payload) {
  const user = await UserDoc.findByIdAndUpdate(
    userId,
    { $set: payload || {} },
    { new: true, lean: true },
  );
  return user || null;
}

async function list() {
  const allUsers = await UserDoc.find({}).lean();
  return allUsers.map(sanitize);
}

export const User = {
  sanitize,
  findById,
  findOne,
  register,
  updateById,
  list,
};

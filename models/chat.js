import crypto from "crypto";
import { ChatDoc, MensajeDoc, UserDoc } from "./mongo.js";

function createId(prefix) {
  return `${prefix}-${crypto.randomBytes(4).toString("hex")}`;
}

async function getOtherUser(chat, userId) {
  const otherId = chat.participants.find((id) => id !== userId);
  const other = await UserDoc.findById(otherId).lean();
  if (!other) return null;
  const { password, ...safe } = other;
  return safe;
}

async function listByUser(userId) {
  const chats = await ChatDoc.find({ participants: userId }).lean();
  const result = [];

  for (const chat of chats) {
    result.push({
      ...chat,
      otroUsuario: await getOtherUser(chat, userId),
      unread_messages: chat.unread_by?.[userId] || 0,
    });
  }

  return result;
}

async function getMensajes(chatId) {
  return MensajeDoc
    .find({ chat: chatId })
    .sort({ createdAt: -1 })
    .lean();
}

async function createMensaje({ chatId, texto, userId }) {
  const chat = await ChatDoc.findById(chatId);
  if (!chat) return null;

  const mensaje = await MensajeDoc.create({
    _id: createId("msg"),
    chat: chatId,
    texto,
    user: { _id: userId },
    createdAt: new Date(),
  });

  chat.last_message = texto;
  chat.last_message_date = new Date().toISOString();

  chat.participants
    .filter((participantId) => participantId !== userId)
    .forEach((participantId) => {
      chat.unread_by[participantId] = (chat.unread_by[participantId] || 0) + 1;
    });

  chat.unread_by[userId] = 0;
  await chat.save();

  return mensaje.toObject();
}

async function markAsRead(chatId, userId) {
  const chat = await ChatDoc.findById(chatId);
  if (!chat) return null;
  chat.unread_by[userId] = 0;
  await chat.save();
  return chat;
}

async function findByParticipants(userA, userB) {
  return ChatDoc.findOne({
    participants: { $all: [userA, userB], $size: 2 },
  });
}

async function ensureChatForUsers(userA, userB) {
  if (!userA || !userB || userA === userB) return null;

  const existing = await findByParticipants(userA, userB);
  if (existing) return existing.toObject();

  const nowIso = new Date().toISOString();
  const chat = await ChatDoc.create({
    _id: createId("chat"),
    participants: [userA, userB],
    last_message: "",
    last_message_date: nowIso,
    unread_by: {
      [userA]: 0,
      [userB]: 0,
    },
  });

  return chat.toObject();
}

export const Chat = {
  listByUser,
  getMensajes,
  createMensaje,
  markAsRead,
  findByParticipants,
  ensureChatForUsers,
};

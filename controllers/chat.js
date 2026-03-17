import { Chat, Cita } from "../models/index.js";
import { io } from "../utils/index.js";

async function syncChatsFromCitas(userId) {
  const citas = await Cita.findByUser(userId);
  const pairs = new Set();

  for (const cita of citas || []) {
    const pacienteId = cita?.paciente?._id;
    const psicologoId = cita?.psicologo?._id;
    if (!pacienteId || !psicologoId) continue;

    const pairKey = [pacienteId, psicologoId].sort().join("::");
    if (pairs.has(pairKey)) continue;
    pairs.add(pairKey);

    await Chat.ensureChatForUsers(pacienteId, psicologoId);
  }
}

async function getChats(req, res) {
  try {
    await syncChatsFromCitas(req.user.user_id);
  } catch (error) {
    console.error("chat sync error:", error);
  }
  const chats = await Chat.listByUser(req.user.user_id);
  return res.status(200).send({ chats });
}

async function getMensajes(req, res) {
  await Chat.markAsRead(req.params.chatId, req.user.user_id);
  const mensajes = await Chat.getMensajes(req.params.chatId);
  return res.status(200).send({ mensajes });
}

async function createMensaje(req, res) {
  const mensaje = await Chat.createMensaje({
    chatId: req.body?.chatId,
    texto: req.body?.texto,
    userId: req.user.user_id,
  });

  if (!mensaje) {
    return res.status(404).send({ msg: "Chat no encontrado" });
  }

  io?.to(req.body?.chatId).emit("mensaje:nuevo", mensaje);
  return res.status(201).send({ mensaje });
}

export const ChatController = {
  getChats,
  getMensajes,
  createMensaje,
};

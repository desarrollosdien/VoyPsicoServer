import crypto from "crypto";
import { VideoSessionDoc } from "./mongo.js";

async function getOrCreateSession(sessionId, encryptionMode) {
  const existing = await VideoSessionDoc.findOne({ sessionId }).lean();
  if (existing) return existing;

  const created = {
    sessionId,
    channelName: `voypsico_${sessionId}`,
    encryptionMode,
    encryptionSecret: crypto.randomBytes(24).toString("base64url"),
    createdAt: Date.now(),
  };

  const saved = await VideoSessionDoc.create(created);
  return saved.toObject();
}

export const VideoSession = {
  getOrCreateSession,
};

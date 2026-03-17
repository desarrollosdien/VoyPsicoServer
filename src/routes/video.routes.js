const express = require("express");
const crypto = require("crypto");
const { RtcTokenBuilder, RtcRole } = require("agora-token");
const { authRequired } = require("../auth");
const { config } = require("../config");
const { videoSessions } = require("../mockDb");

const router = express.Router();

function buildAgoraToken(channelName, uid) {
  if (!config.agoraAppId || !config.agoraAppCertificate) {
    return null;
  }

  const currentTs = Math.floor(Date.now() / 1000);
  const expireTs = currentTs + config.agoraTokenTtlSeconds;
  return RtcTokenBuilder.buildTokenWithUid(
    config.agoraAppId,
    config.agoraAppCertificate,
    channelName,
    Number(uid),
    RtcRole.PUBLISHER,
    expireTs,
  );
}

function getOrCreateSession(sessionId) {
  const existing = videoSessions.get(sessionId);
  if (existing) return existing;

  const created = {
    sessionId,
    channelName: `voypsico_${sessionId}`,
    encryptionMode: config.videoE2eeMode,
    encryptionSecret: crypto.randomBytes(24).toString("base64url"),
    createdAt: Date.now(),
  };
  videoSessions.set(sessionId, created);
  return created;
}

router.post("/agora/token", authRequired, (req, res) => {
  const { sessionId } = req.body || {};
  if (!sessionId) return res.status(400).json({ message: "sessionId requerido" });

  const session = getOrCreateSession(sessionId);
  const uid = Number(String(req.user._id).replace(/\D/g, "").slice(-6) || 1);
  const rtcToken = buildAgoraToken(session.channelName, uid);

  return res.json({
    provider: "agora",
    appId: config.agoraAppId || "",
    channelName: session.channelName,
    uid,
    rtcToken,
    expiresInSeconds: config.agoraTokenTtlSeconds,
    e2ee: {
      enabled: true,
      mode: session.encryptionMode,
      secret: session.encryptionSecret,
    },
  });
});

module.exports = router;

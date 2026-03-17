import agoraTokenPkg from "agora-token";
import {
  AGORA_APP_CERTIFICATE,
  AGORA_APP_ID,
  AGORA_TOKEN_TTL_SECONDS,
  VIDEO_E2EE_MODE,
} from "../constants.js";
import { VideoSession } from "../models/index.js";

const { RtcTokenBuilder, RtcRole } = agoraTokenPkg;

function toAgoraUid(value) {
  const seed = String(value || "anon");
  let hash = 0;
  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash * 31 + seed.charCodeAt(index)) >>> 0;
  }
  return (hash % 4294967294) + 1;
}

function buildAgoraToken(channelName, uid) {
  if (!AGORA_APP_ID || !AGORA_APP_CERTIFICATE) {
    return null;
  }

  const currentTs = Math.floor(Date.now() / 1000);
  const expireTs = currentTs + AGORA_TOKEN_TTL_SECONDS;

  return RtcTokenBuilder.buildTokenWithUid(
    AGORA_APP_ID,
    AGORA_APP_CERTIFICATE,
    channelName,
    Number(uid),
    RtcRole.PUBLISHER,
    expireTs,
  );
}

async function getAgoraToken(req, res) {
  const { sessionId } = req.body || {};
  if (!sessionId) {
    return res.status(400).send({ msg: "sessionId requerido" });
  }

  if (!AGORA_APP_ID) {
    return res.status(500).send({
      msg: "AGORA_APP_ID no configurado en el servidor",
    });
  }

  const session = await VideoSession.getOrCreateSession(sessionId, VIDEO_E2EE_MODE);
  const uid = toAgoraUid(`${req.user.user_id}:${req.user.rol || "user"}`);
  const rtcToken = buildAgoraToken(session.channelName, uid);

  return res.status(200).send({
    provider: "agora",
    appId: AGORA_APP_ID,
    channelName: session.channelName,
    uid,
    rtcToken,
    expiresInSeconds: AGORA_TOKEN_TTL_SECONDS,
    tokenMode: AGORA_APP_CERTIFICATE ? "certificate" : "app-id",
    e2ee: {
      enabled: true,
      mode: session.encryptionMode,
      secret: session.encryptionSecret,
    },
  });
}

export const VideoController = {
  getAgoraToken,
};

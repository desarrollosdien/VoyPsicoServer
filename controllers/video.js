import agoraTokenPkg from "agora-token";
import {
  AGORA_APP_CERTIFICATE,
  AGORA_APP_ID,
  AGORA_TOKEN_TTL_SECONDS,
  VIDEO_E2EE_MODE,
} from "../constants.js";
import { VideoSession } from "../models/index.js";

const { RtcTokenBuilder, RtcRole } = agoraTokenPkg;

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

  const session = await VideoSession.getOrCreateSession(sessionId, VIDEO_E2EE_MODE);
  const uid = Number(String(req.user.user_id).replace(/\D/g, "").slice(-6) || 1);

  return res.status(200).send({
    provider: "agora",
    appId: AGORA_APP_ID,
    channelName: session.channelName,
    uid,
    rtcToken: buildAgoraToken(session.channelName, uid),
    expiresInSeconds: AGORA_TOKEN_TTL_SECONDS,
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

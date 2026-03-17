const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const config = {
  port: Number(process.env.PORT || 4000),
  jwtSecret: process.env.JWT_SECRET || "dev_super_secret_change_me",
  agoraAppId: process.env.AGORA_APP_ID || "",
  agoraAppCertificate: process.env.AGORA_APP_CERTIFICATE || "",
  agoraTokenTtlSeconds: Number(process.env.AGORA_TOKEN_TTL_SECONDS || 3600),
  videoE2eeMode: process.env.VIDEO_E2EE_MODE || "aes-256-gcm2",
};

module.exports = { config };

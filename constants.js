import "dotenv/config";

export const IP_SERVER = process.env.IP_SERVER || "localhost";
export const PORT = process.env.PORT || 4000;
export const JWT_SECRET_KEY = process.env.JWT_SECRET || "voypsico_dev_secret";
export const MONGO_URI = process.env.MONGO_URI || "";
export const AGORA_APP_ID = process.env.AGORA_APP_ID || process.env.EXPO_PUBLIC_AGORA_APP_ID || "8b74767ed33f4f7598155ca6c93cd582";
export const AGORA_APP_CERTIFICATE = process.env.AGORA_APP_CERTIFICATE || "";
export const AGORA_TOKEN_TTL_SECONDS = Number(process.env.AGORA_TOKEN_TTL_SECONDS || 3600);
export const VIDEO_E2EE_MODE = process.env.VIDEO_E2EE_MODE || "aes-256-gcm2";

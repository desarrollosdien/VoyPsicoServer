import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import http from "http";
import morgan from "morgan";
import {
  authRoutes,
  chatRoutes,
  citaRoutes,
  psicologoRoutes,
  userRoutes,
  videoRoutes,
} from "./routes/index.js";
import { initSocketServer } from "./utils/index.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

initSocketServer(server);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("uploads"));
app.use(cors());
app.use(morgan("dev"));

app.get("/health", (_req, res) => {
  res.status(200).send({ ok: true, service: "voypsico-server" });
});

app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", psicologoRoutes);
app.use("/api", citaRoutes);
app.use("/api", chatRoutes);
app.use("/api", videoRoutes);

export { server };

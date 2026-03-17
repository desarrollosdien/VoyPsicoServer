const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { config } = require("./config");

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const psicologoRoutes = require("./routes/psicologo.routes");
const citasRoutes = require("./routes/citas.routes");
const videoRoutes = require("./routes/video.routes");

const app = express();

app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "voypsico-server" });
});

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api", psicologoRoutes);
app.use("/api", citasRoutes);
app.use("/api/video", videoRoutes);

app.use((_req, res) => {
  res.status(404).json({ message: "Ruta no encontrada" });
});

app.listen(config.port, () => {
  console.log(`VoyPsico server running on http://localhost:${config.port}`);
});

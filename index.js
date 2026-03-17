import mongoose from "mongoose";
import { server } from "./app.js";
import { IP_SERVER, MONGO_URI, PORT } from "./constants.js";
import { io } from "./utils/index.js";

function startServer() {
  server.listen(PORT, () => {
    console.log("#########################");
    console.log("###### VOYPSICO API #####");
    console.log("#########################");
    console.log(`http://${IP_SERVER}:${PORT}/api`);

    io?.sockets.on("connection", (socket) => {
      console.log("NUEVO USUARIO CONECTADO");

      socket.on("disconnect", () => {
        console.log("USUARIO DESCONECTADO");
      });

      socket.on("subscribe", (room) => {
        socket.join(room);
      });

      socket.on("unsubscribe", (room) => {
        socket.leave(room);
      });
    });
  });
}

if (!MONGO_URI) {
  console.error("MONGO_URI no configurado. Define la variable en .env para arrancar el backend.");
  process.exit(1);
}

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("Mongo conectado");
    startServer();
  })
  .catch((error) => {
    console.error("Error conectando Mongo:", error.message);
    process.exit(1);
  });

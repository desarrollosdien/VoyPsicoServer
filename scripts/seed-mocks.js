import "dotenv/config";
import mongoose from "mongoose";
import { syncDataMocks } from "../utils/syncDataMocks.js";

async function seed() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error("MONGO_URI no está definido en .env");
  }

  await mongoose.connect(uri);

  await syncDataMocks();

  console.log("Mocks guardados en Mongo correctamente");

  await mongoose.disconnect();
}

seed()
  .then(() => process.exit(0))
  .catch(async (error) => {
    console.error("Error haciendo seed de mocks:", error.message);
    try {
      await mongoose.disconnect();
    } catch (_e) {
      // no-op
    }
    process.exit(1);
  });

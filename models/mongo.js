import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  _id: { type: String },
  firstname: String,
  lastname: String,
  email: { type: String, index: true, unique: true, sparse: true },
  password: String,
  telefono: String,
  rol: String,
  activo: { type: Boolean, default: true },
  avatar: mongoose.Schema.Types.Mixed,
  objetivo: String,
  genero: String,
  fechaNacimiento: mongoose.Schema.Types.Mixed,
  titulo: String,
  especialidades: [String],
  rating: Number,
  precioSesion: Number,
  anosExperiencia: Number,
  ciudad: String,
  presencial: Boolean,
  disponibleHoy: Boolean,
  bio: String,
}, { versionKey: false });

const slotSchema = new mongoose.Schema({
  inicio: String,
  fin: String,
  disponible: Boolean,
  precio: Number,
  tipo: String,
}, { _id: false });

const horarioSchema = new mongoose.Schema({
  id: String,
  dia: String,
  activo: Boolean,
  rango: String,
}, { _id: false });

const psicologoSchema = new mongoose.Schema({
  _id: { type: String },
  firstname: String,
  lastname: String,
  activo: { type: Boolean, default: true },
  titulo: String,
  especialidades: [String],
  rating: Number,
  precioSesion: Number,
  anosExperiencia: Number,
  ciudad: String,
  presencial: Boolean,
  disponibleHoy: Boolean,
  bio: String,
  slots: [slotSchema],
  horarios: [horarioSchema],
}, { versionKey: false });

const citaSchema = new mongoose.Schema({
  _id: { type: String },
  psicologo: {
    _id: String,
    firstname: String,
    lastname: String,
    email: String,
  },
  paciente: {
    _id: String,
    firstname: String,
    lastname: String,
    email: String,
  },
  fecha: String,
  hora_inicio: String,
  hora_fin: String,
  estado: String,
  tipo: String,
  precio_total: Number,
  motivo: String,
  notas: String,
  motivo_cancelacion: String,
}, { versionKey: false });

const chatSchema = new mongoose.Schema({
  _id: { type: String },
  participants: [String],
  last_message: String,
  last_message_date: String,
  unread_by: { type: Map, of: Number, default: {} },
}, { versionKey: false });

const mensajeSchema = new mongoose.Schema({
  _id: { type: String },
  chat: String,
  texto: String,
  user: {
    _id: String,
  },
  createdAt: { type: Date, default: Date.now },
}, { versionKey: false });

const videoSessionSchema = new mongoose.Schema({
  sessionId: { type: String, unique: true, index: true },
  channelName: String,
  encryptionMode: String,
  encryptionSecret: String,
  createdAt: Number,
}, { versionKey: false });

const mockMetaSchema = new mongoose.Schema({
  key: { type: String, unique: true, index: true },
  payload: mongoose.Schema.Types.Mixed,
}, { versionKey: false });

const disponibilidadSchema = new mongoose.Schema({
  _id: { type: String },
  slots: [slotSchema],
}, { versionKey: false });

const horariosSchema = new mongoose.Schema({
  _id: { type: String },
  horarios: [horarioSchema],
}, { versionKey: false });

const pacienteSchema = new mongoose.Schema({
  _id: { type: String },
  userId: String,
  nombre: String,
  ultimaSesion: String,
  progreso: String,
}, { versionKey: false });

const estadisticaSchema = new mongoose.Schema({
  _id: { type: String, default: "global" },
  sesionesMes: Number,
  ingresosMes: Number,
  pacientesActivos: Number,
  valoracionMedia: Number,
  ocupacionSemanal: [Number],
}, { versionKey: false });

const sesionActivaSchema = new mongoose.Schema({
  _id: { type: String, default: "activa" },
  payload: mongoose.Schema.Types.Mixed,
}, { versionKey: false });

const sesionHistorialSchema = new mongoose.Schema({
  _id: { type: String },
  fecha: String,
  psicologoNombre: String,
  duracion: Number,
  valoracion: Number,
  nota: String,
}, { versionKey: false });

const pushTokenSchema = new mongoose.Schema({
  _id: { type: String },
  userId: { type: String, index: true },
  pushToken: { type: String, index: true },
  savedAt: String,
}, { versionKey: false });

export const UserDoc = mongoose.models.UserDoc || mongoose.model("UserDoc", userSchema, "users");
export const PsicologoDoc = mongoose.models.PsicologoDoc || mongoose.model("PsicologoDoc", psicologoSchema, "psicologos");
export const CitaDoc = mongoose.models.CitaDoc || mongoose.model("CitaDoc", citaSchema, "citas");
export const ChatDoc = mongoose.models.ChatDoc || mongoose.model("ChatDoc", chatSchema, "chats");
export const MensajeDoc = mongoose.models.MensajeDoc || mongoose.model("MensajeDoc", mensajeSchema, "mensajes");
export const VideoSessionDoc = mongoose.models.VideoSessionDoc || mongoose.model("VideoSessionDoc", videoSessionSchema, "video_sessions");
export const MockMetaDoc = mongoose.models.MockMetaDoc || mongoose.model("MockMetaDoc", mockMetaSchema, "mock_meta");
export const DisponibilidadDoc = mongoose.models.DisponibilidadDoc || mongoose.model("DisponibilidadDoc", disponibilidadSchema, "disponibilidades");
export const HorariosDoc = mongoose.models.HorariosDoc || mongoose.model("HorariosDoc", horariosSchema, "horarios");
export const PacienteDoc = mongoose.models.PacienteDoc || mongoose.model("PacienteDoc", pacienteSchema, "pacientes");
export const EstadisticaDoc = mongoose.models.EstadisticaDoc || mongoose.model("EstadisticaDoc", estadisticaSchema, "estadisticas");
export const SesionActivaDoc = mongoose.models.SesionActivaDoc || mongoose.model("SesionActivaDoc", sesionActivaSchema, "sesion_activa");
export const SesionHistorialDoc = mongoose.models.SesionHistorialDoc || mongoose.model("SesionHistorialDoc", sesionHistorialSchema, "sesiones_historial");
export const PushTokenDoc = mongoose.models.PushTokenDoc || mongoose.model("PushTokenDoc", pushTokenSchema, "push_tokens");

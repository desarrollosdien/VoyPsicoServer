const { randomUUID } = require("crypto");

const users = [
  {
    _id: "demo-user-1",
    firstname: "Clara",
    lastname: "Martín",
    email: "demo@voypsico.com",
    password: "Demo1234",
    rol: "paciente",
  },
  {
    _id: "demo-psico-2",
    firstname: "Laura",
    lastname: "Ortega",
    email: "psico@voypsico.com",
    password: "Psico1234",
    rol: "psicologo",
    titulo: "Psicóloga Sanitaria",
    especialidades: ["Ansiedad", "Autoestima", "Estrés laboral"],
    rating: 4.9,
    precioSesion: 55,
    anosExperiencia: 8,
    ciudad: "Madrid",
    presencial: true,
    disponibleHoy: true,
    bio: "Acompaño procesos de ansiedad y gestión emocional desde un enfoque integrador.",
  },
  {
    _id: "demo-admin-3",
    firstname: "Mario",
    lastname: "Sierra",
    email: "admin@voypsico.com",
    password: "Admin1234",
    rol: "admin",
  },
];

const psicologos = [
  {
    _id: "demo-psico-2",
    firstname: "Laura",
    lastname: "Ortega",
    titulo: "Psicóloga Sanitaria",
    especialidades: ["Ansiedad", "Autoestima", "Estrés laboral"],
    rating: 4.9,
    precioSesion: 55,
    anosExperiencia: 8,
    ciudad: "Madrid",
    presencial: true,
    disponibleHoy: true,
    bio: "Acompaño procesos de ansiedad y gestión emocional desde un enfoque integrador.",
  },
  {
    _id: "ps-002",
    firstname: "Daniel",
    lastname: "Romero",
    titulo: "Psicólogo Clínico",
    especialidades: ["Depresión", "Duelo", "Pareja"],
    rating: 4.7,
    precioSesion: 60,
    anosExperiencia: 11,
    ciudad: "Valencia",
    presencial: false,
    disponibleHoy: true,
    bio: "Especialista en terapia cognitivo-conductual orientada a objetivos concretos.",
  },
];

//console.log(`[MOCKDB] psicologos cargados: ${psicologos.length}`);

const citas = [
  {
    _id: "cita-api-001",
    psicologo: { _id: "demo-psico-2", firstname: "Laura", lastname: "Ortega" },
    paciente: { _id: "demo-user-1", firstname: "Clara", lastname: "Martín", email: "demo@voypsico.com" },
    fecha: "2026-03-15",
    hora_inicio: "10:00",
    hora_fin: "10:50",
    estado: "confirmada",
    tipo: "online",
    precio_total: 55,
    motivo: "Seguimiento ansiedad generalizada",
    notas: "",
  },
  {
    _id: "cita-api-002",
    psicologo: { _id: "demo-psico-2", firstname: "Laura", lastname: "Ortega" },
    paciente: { _id: "demo-user-1", firstname: "Clara", lastname: "Martín", email: "demo@voypsico.com" },
    fecha: "2026-03-20",
    hora_inicio: "17:00",
    hora_fin: "17:50",
    estado: "pendiente",
    tipo: "online",
    precio_total: 55,
    motivo: "Primera consulta",
    notas: "",
  },
];

const disponibilidad = {
  "demo-psico-2": {
    slots: [
      { inicio: "09:00", fin: "09:50", disponible: true, precio: 55, tipo: "online" },
      { inicio: "10:00", fin: "10:50", disponible: false, precio: 55, tipo: "online" },
      { inicio: "11:00", fin: "11:50", disponible: true, precio: 55, tipo: "online" },
      { inicio: "16:00", fin: "16:50", disponible: true, precio: 55, tipo: "presencial" },
    ],
  },
};

const videoSessions = new Map();

function createCita(payload) {
  const nueva = {
    _id: randomUUID(),
    estado: "pendiente",
    ...payload,
  };
  citas.push(nueva);
  return nueva;
}

module.exports = {
  users,
  psicologos,
  citas,
  disponibilidad,
  videoSessions,
  createCita,
};

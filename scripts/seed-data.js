export const users = [
  {
    _id: "demo-user-1",
    firstname: "Clara",
    lastname: "Martín",
    email: "demo@voypsico.com",
    password: "Demo1234",
    telefono: "+34 600 123 456",
    rol: "paciente",
    activo: true,
    avatar: null,
    objetivo: "Reducir ansiedad y mejorar hábitos de autocuidado",
  },
  {
    _id: "demo-psico-2",
    firstname: "Laura",
    lastname: "Ortega",
    email: "psico@voypsico.com",
    password: "Psico1234",
    telefono: "+34 600 555 777",
    rol: "psicologo",
    activo: true,
    avatar: null,
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
    telefono: "+34 600 111 999",
    rol: "admin",
    activo: true,
    avatar: null,
  },
];

export const psicologos = [
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
    especialidades: ["Depresión", "Duelo", "Terapia de pareja"],
    rating: 4.7,
    precioSesion: 60,
    anosExperiencia: 11,
    ciudad: "Valencia",
    presencial: false,
    disponibleHoy: true,
    bio: "Especialista en terapia cognitivo-conductual orientada a objetivos concretos.",
  },
  {
    _id: "ps-003",
    firstname: "Elena",
    lastname: "Vega",
    titulo: "Psicóloga General Sanitaria",
    especialidades: ["Trauma", "Regulación emocional", "Mindfulness"],
    rating: 4.8,
    precioSesion: 58,
    anosExperiencia: 9,
    ciudad: "Barcelona",
    presencial: true,
    disponibleHoy: true,
    bio: "Trabajo con adultos y jóvenes para recuperar equilibrio y bienestar sostenido.",
  },
];

export const citas = [
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

export const disponibilidades = {
  "demo-psico-2": {
    slots: [
      { inicio: "09:00", fin: "09:50", disponible: true, precio: 55, tipo: "online" },
      { inicio: "10:00", fin: "10:50", disponible: false, precio: 55, tipo: "online" },
      { inicio: "11:00", fin: "11:50", disponible: true, precio: 55, tipo: "online" },
      { inicio: "16:00", fin: "16:50", disponible: true, precio: 55, tipo: "presencial" },
    ],
  },
  "ps-002": {
    slots: [
      { inicio: "12:00", fin: "12:50", disponible: true, precio: 60, tipo: "online" },
      { inicio: "18:00", fin: "18:50", disponible: true, precio: 60, tipo: "online" },
    ],
  },
};

export const horarios = {
  "demo-psico-2": [
    { id: "lun", dia: "Lunes", activo: true, rango: "09:00 - 18:00" },
    { id: "mar", dia: "Martes", activo: true, rango: "09:00 - 18:00" },
    { id: "mie", dia: "Miércoles", activo: true, rango: "09:00 - 17:00" },
    { id: "jue", dia: "Jueves", activo: true, rango: "10:00 - 18:00" },
    { id: "vie", dia: "Viernes", activo: true, rango: "09:00 - 14:00" },
    { id: "sab", dia: "Sábado", activo: false, rango: "No disponible" },
    { id: "dom", dia: "Domingo", activo: false, rango: "No disponible" },
  ],
};

export const pacientes = [
  {
    id: "pac-1",
    userId: "demo-user-1",
    nombre: "Clara Martín",
    ultimaSesion: "Hace 3 días",
    progreso: "Mejorando",
  },
  {
    id: "pac-2",
    userId: "demo-user-2",
    nombre: "Javier Ruiz",
    ultimaSesion: "Hace 1 semana",
    progreso: "Estable",
  },
  {
    id: "pac-3",
    userId: "demo-user-3",
    nombre: "Marta León",
    ultimaSesion: "Ayer",
    progreso: "Muy positivo",
  },
  {
    id: "pac-4",
    userId: "demo-user-4",
    nombre: "Noa Pérez",
    ultimaSesion: "Hace 2 semanas",
    progreso: "Seguimiento",
  },
];

export const estadisticas = {
  sesionesMes: 42,
  ingresosMes: 2310,
  pacientesActivos: 18,
  valoracionMedia: 4.8,
  ocupacionSemanal: [65, 72, 80, 76],
};

export const sesionActiva = {
  id: "sesion-001",
  citaId: "cita-api-001",
  psicologo: {
    _id: "demo-psico-2",
    firstname: "Laura",
    lastname: "Ortega",
    titulo: "Psicóloga Sanitaria",
  },
  paciente: {
    _id: "demo-user-1",
    firstname: "Clara",
    lastname: "Martín",
  },
  fecha: "2026-03-15",
  hora: "10:00",
  hora_inicio: "10:00",
  hora_fin: "10:50",
  duracion: 50,
  tipo: "online",
  motivo: "Seguimiento ansiedad generalizada",
};

export const sesionesHistorial = [
  {
    id: "hist-001",
    fecha: "15 Mar 2026",
    psicologoNombre: "Laura Ortega",
    duracion: 50,
    valoracion: 5,
    nota: "Sesión muy productiva. Aprendí técnicas de respiración.",
  },
  {
    id: "hist-002",
    fecha: "8 Mar 2026",
    psicologoNombre: "Laura Ortega",
    duracion: 48,
    valoracion: 4,
    nota: "Trabajamos reestructuración cognitiva.",
  },
];

export const chats = [
  {
    _id: "chat-001",
    participants: ["demo-user-1", "demo-psico-2"],
    last_message: "Perfecto, nos vemos en sesión.",
    last_message_date: "2026-03-15T09:32:00.000Z",
    unread_by: { "demo-user-1": 0, "demo-psico-2": 1 },
  },
];

export const mensajes = [
  {
    _id: "msg-001",
    chat: "chat-001",
    texto: "Hola Laura, ¿sigues disponible para hoy?",
    user: { _id: "demo-user-1" },
    createdAt: "2026-03-15T09:28:00.000Z",
  },
  {
    _id: "msg-002",
    chat: "chat-001",
    texto: "Sí, claro. Te espero a las 10:00.",
    user: { _id: "demo-psico-2" },
    createdAt: "2026-03-15T09:29:30.000Z",
  },
  {
    _id: "msg-003",
    chat: "chat-001",
    texto: "Perfecto, nos vemos en sesión.",
    user: { _id: "demo-user-1" },
    createdAt: "2026-03-15T09:32:00.000Z",
  },
];

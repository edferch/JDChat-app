// --- 1. Importar las librerías ---
// 'express' es para crear el servidor web
// 'http' es un módulo de Node para crear el servidor HTTP
// 'socket.io' es la librería mágica para el tiempo real
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors'); // Importamos cors para permitir conexiones

// --- 2. Configuración inicial ---
const app = express();
// Permitimos que nuestro frontend (que estará en otro puerto) se conecte
app.use(cors());

// Creamos el servidor HTTP usando la app de express
const server = http.createServer(app);

// Conectamos Socket.IO al servidor HTTP
// y configuramos CORS para Socket.IO también
const io = new Server(server, {
  cors: {
    origin: "*", // En un proyecto real, aquí iría tu frontend (ej. "http://localhost:3000")
    methods: ["GET", "POST"]
  }
});

const PORT = 3001; // El puerto donde nuestro backend escuchará

// --- 3. Lógica de Socket.IO (El corazón del chat) ---

// 'io.on("connection", ...)' se dispara CADA VEZ que un usuario se conecta
io.on('connection', (socket) => {
  console.log(`Un usuario se ha conectado: ${socket.id}`);

  // --- A. Escuchar mensajes del cliente ---
  // 'socket.on("chat message", ...)' escucha un evento llamado "chat message"
  // que nuestro frontend enviará.
  socket.on('chat message', (msg) => {
    console.log(`Mensaje recibido de ${socket.id}: ${msg}`);

    // --- B. Reenviar el mensaje a TODOS ---
    // 'io.emit(...)' envía un evento a TODOS los sockets conectados,
    // incluyéndo al que lo envió.
    io.emit('chat message', msg);
  });

  // --- C. Manejar la desconexión ---
  // 'socket.on("disconnect", ...)' se dispara cuando ese usuario se desconecta
  socket.on('disconnect', () => {
    console.log(`Un usuario se ha desconectado: ${socket.id}`);
  });
});

// --- 4. Iniciar el servidor ---
server.listen(PORT, () => {
  console.log(`Servidor de chat escuchando en http://localhost:${PORT}`);
});

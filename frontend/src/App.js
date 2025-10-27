import { useState, useEffect } from 'react'; // Hooks de React
import io from 'socket.io-client'; // Cliente de Socket.IO
import './App.css'; // Importamos nuestros estilos

// 1. Conexión con nuestro servidor backend
// Esta URL debe apuntar a tu server.js (en el puerto 3001)
const socket = io('http://localhost:3001');

function App() {
  // 2. Estados de React
  // 'messages' guardará la lista de todos los mensajes
  const [messages, setMessages] = useState([]);
  // 'currentMessage' guardará lo que el usuario está escribiendo en el input
  const [currentMessage, setCurrentMessage] = useState('');

  // 3. Efecto para escuchar mensajes entrantes
  useEffect(() => {
    // Esta función se ejecutará solo una vez, cuando el componente se monte
    
    // Nos suscribimos al evento 'chat message' que viene del servidor
    socket.on('chat message', (message) => {
      // Cuando recibimos un mensaje, lo añadimos a nuestra lista de mensajes
      // Usamos una función para asegurarnos de que estamos actualizando el estado anterior
      setMessages(prevMessages => [...prevMessages, message]);
    });

    // Importante: buena práctica de React
    // Cuando el componente se desmonte, nos "desuscribimos" del evento
    return () => {
      socket.off('chat message');
    };
  }, []); // El array vacío [] significa que este efecto solo se ejecuta al inicio

  // 4. Función para enviar un mensaje
  const sendMessage = (e) => {
    e.preventDefault(); // Evita que el formulario recargue la página

    if (currentMessage.trim()) { // Si el mensaje no está vacío
      // Emitimos el evento 'chat message' al servidor
      socket.emit('chat message', currentMessage);
      
      // Limpiamos el input
      setCurrentMessage('');
    }
  };

  // 5. Renderizado del componente (lo que se ve en pantalla)
  return (
    <div className="App">
      {/* VENTANA DE MENSAJES */}
      <div className="chat-window">
        <ul className="message-list">
          {/* Usamos .map() para "dibujar" cada mensaje de la lista */}
          {messages.map((msg, index) => (
            <li key={index} className="message">
              {msg}
            </li>
          ))}
        </ul>
      </div>

      {/* FORMULARIO DE ENVÍO */}
      <form className="message-form" onSubmit={sendMessage}>
        <input
          type="text"
          className="message-input"
          placeholder="Escribe un mensaje..."
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
        />
        <button type="submit" className="send-button">Enviar</button>
      </form>
    </div>
  );
}

export default App;
import './App.css';
import NavBar from './components/NavBar';
import ChatInterface from './components/ChatInterface';
import { useState } from 'react';

function App() {
  const [messages, setMessages] = useState([]);

  const clearSession = () => {
    setMessages([]);
  };

  return (
    <div >
      <NavBar clearSession={clearSession} />
      <ChatInterface messages={messages} setMessages={setMessages} />
    </div>
  );
}

export default App;

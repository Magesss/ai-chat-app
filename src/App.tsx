import React, { useState } from 'react';
import { ChatContainer } from './components/ChatContainer';
import { WelcomeScreen } from './components/WelcomeScreen';

function App() {
  const [showWelcome, setShowWelcome] = useState(true);

  const handleStartChat = () => {
    setShowWelcome(false);
  };

  return (
    <div className="App">
      {showWelcome ? (
        <WelcomeScreen onStartChat={handleStartChat} />
      ) : (
        <ChatContainer />
      )}
    </div>
  );
}

export default App;


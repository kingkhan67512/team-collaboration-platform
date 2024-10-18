// src/components/Chat.js
import React, { useState, useEffect } from 'react';
import { db } from '../firebase';  // Adjust import based on your structure
import { collection, onSnapshot, addDoc } from 'firebase/firestore';

const Chat = ({ workspaceId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'messages'), (snapshot) => {
      const messageList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(messageList);
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      await addDoc(collection(db, 'messages'), {
        text: newMessage,
        workspaceId: workspaceId,
        timestamp: new Date(),
      });
      setNewMessage(''); // Clear the input
    }
  };

  return (
    <div>
      <h2>Chat</h2>
      <div style={{ maxHeight: '200px', overflowY: 'scroll', border: '1px solid #ccc', padding: '10px' }}>
        {messages.map(msg => (
          <p key={msg.id}>{msg.text}</p>
        ))}
      </div>
      <form onSubmit={handleSendMessage}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          required
        />
        <button type="submit" className="btn btn-primary">Send</button>
      </form>
    </div>
  );
};

export default Chat;

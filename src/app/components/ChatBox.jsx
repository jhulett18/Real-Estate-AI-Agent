import React, { useState } from 'react';

export default function ChatBox() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const toggleChat = () => setIsOpen(!isOpen);

  const handleSend = async () => {
    if (!input.trim()) return;
  
    console.log("📤 Sending message:", input); // 🔍 Add this
  
    const userMessage = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
  
    try {
      const response = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        body: JSON.stringify({ message: input }),
        headers: { 'Content-Type': 'application/json' },
      });
  
      const data = await response.json();
      console.log("🤖 Bot replied:", data); // 🔍 Add this
  
      const botMessage = { sender: 'bot', text: data.reply };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("❌ Chat fetch error:", error); // 🔍 Add this
      setMessages(prev => [...prev, { sender: 'bot', text: "Something went wrong." }]);
    }
  
    setInput('');
  };
  

  return (
    <div className="fixed bottom-6 right-6 z-50 w-[350px]">
      <div className="rounded-xl shadow-lg border border-gray-300 bg-white">
        <div
          className="px-4 py-2 bg-black text-white rounded-t-xl cursor-pointer font-medium flex items-center justify-between"
          onClick={toggleChat}
        >
          {isOpen ? 'Close Chat' : 'Ask Real Estate AI'}
        </div>

        {isOpen && (
          <div className="flex flex-col h-[450px]">
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`max-w-[80%] px-4 py-2 rounded-lg text-sm ${
                    msg.sender === 'user'
                      ? 'bg-blue-100 self-end'
                      : 'bg-gray-200 self-start'
                  }`}
                >
                  {msg.text}
                </div>
              ))}
            </div>

            <div className="p-2 border-t bg-white flex items-center space-x-2">
              <input
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Ask about a property..."
              />
              <button
                onClick={handleSend}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                Send
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

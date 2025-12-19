'use client';

import React, { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';

const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: "Hi! How can I help you today?", isBot: true }
    ]);
    const [input, setInput] = useState('');

    const handleSend = () => {
        if (!input.trim()) return;
        
        setMessages(prev => [...prev, { id: Date.now(), text: input, isBot: false }]);
        setInput('');
        
        // Simulate bot response
        setTimeout(() => {
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                text: "Thanks for your message! Our team will get back to you soon.",
                isBot: true
            }]);
        }, 1000);
    };

    return (
        <>
            {/* Chat Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 bg-[#B88E2F] text-white p-4 rounded-full shadow-lg hover:bg-[#9a7628] transition-colors z-50"
            >
                {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-24 right-6 w-80 h-96 bg-white rounded-lg shadow-2xl flex flex-col z-50 border">
                    {/* Header */}
                    <div className="bg-[#B88E2F] text-white p-4 rounded-t-lg">
                        <h3 className="font-semibold">Chat Support</h3>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {messages.map(msg => (
                            <div
                                key={msg.id}
                                className={`p-3 rounded-lg max-w-[80%] ${
                                    msg.isBot
                                        ? 'bg-gray-100 text-gray-800'
                                        : 'bg-[#B88E2F] text-white ml-auto'
                                }`}
                            >
                                {msg.text}
                            </div>
                        ))}
                    </div>

                    {/* Input */}
                    <div className="p-3 border-t flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Type a message..."
                            className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:border-[#B88E2F]"
                        />
                        <button
                            onClick={handleSend}
                            className="bg-[#B88E2F] text-white p-2 rounded-lg hover:bg-[#9a7628]"
                        >
                            <Send size={20} />
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default ChatBot;

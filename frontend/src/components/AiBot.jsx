import React, { useState, useRef, useEffect } from "react";
import { FaRobot, FaPaperPlane, FaTimes } from "react-icons/fa";
import axios from "axios";
import { serverUrl } from "../App";

function AiBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Radhe Radhe! 🙏 I'm your Brijwalla AI Mithai Bot. Ask me anything about sweets, flavors, ingredients, or local specialties!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const handleAskBot = async (e) => {
      const item = e.detail;
      if (!item) return;

      const queryText = `Tell me about ${item.name} sweet from category ${item.category}. What is its description, price, and ingredients?`;
      
      const currentHistory = messages.map(m => ({ role: m.sender === "user" ? "user" : "model", text: m.text }));
      
      setIsOpen(true);
      setMessages((prev) => [...prev, { sender: "user", text: queryText }]);
      setLoading(true);

      try {
        const response = await axios.post(
          `${serverUrl}/api/ai/recommend`,
          { prompt: queryText, history: currentHistory },
          { withCredentials: true }
        );
        setMessages((prev) => [...prev, { sender: "bot", text: response.data.reply }]);
      } catch (error) {
        console.error(error);
        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            text: "I'm experiencing a bit of sugar overload right now. Please try again in a moment!",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    window.addEventListener("ask-mithai-bot", handleAskBot);
    return () => window.removeEventListener("ask-mithai-bot", handleAskBot);
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    const currentHistory = messages.map(m => ({ role: m.sender === "user" ? "user" : "model", text: m.text }));

    setMessages((prev) => [...prev, { sender: "user", text: userMsg }]);
    setInput("");
    setLoading(true);

    try {
      const response = await axios.post(
        `${serverUrl}/api/ai/recommend`,
        { prompt: userMsg, history: currentHistory },
        { withCredentials: true }
      );
      setMessages((prev) => [...prev, { sender: "bot", text: response.data.reply }]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "I'm experiencing a bit of sugar overload right now. Please try again in a moment!",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999]">
      {/* Bot Launcher Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-700 hover:to-yellow-600 text-white p-4 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center animate-bounce"
        >
          <FaRobot size={24} />
        </button>
      )}

      {/* Chat window */}
      {isOpen && (
        <div className="w-[360px] h-[480px] bg-black rounded-3xl shadow-2xl border border-black-100/50 flex flex-col justify-between overflow-hidden animate-in slide-in-from-bottom-5 duration-250">
          {/* Header */}
          <div className="bg-gradient-to-r from-teal-400 to-teal-400 p-4 flex items-center justify-between text-white">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-white rounded-full">
                <FaRobot size={20} />
              </div>
              <div>
                <h3 className="font-bold text-sm">Brijwalla test of brij</h3>
                <p className="text-[10px] text-teal-100">Handcrafted Sweet Suggester</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-white/15 rounded-full transition-colors"
            >
              <FaTimes size={16} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#fff9f6]/40">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${msg.sender === "user"
                    ? "bg-teal-600 text-white rounded-br-none"
                    : "bg-white text-gray-800 shadow-sm border border-orange-100/20 rounded-bl-none"
                    }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white p-3 rounded-2xl shadow-sm border border-orange-100/20 rounded-bl-none flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-bounce duration-300 [animation-delay:0.1s]" />
                  <span className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-bounce duration-300 [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-bounce duration-300 [animation-delay:0.3s]" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-150 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask for low sugar sweets, Pedha specials..."
              className="flex-1 outline-none text-sm px-4 py-2.5 bg-[#fff9f6] border border-orange-100/30 rounded-xl focus:border-teal-500 transition-colors"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="bg-teal-600 hover:bg-teal-700 disabled:bg-teal-300 text-white p-3 rounded-xl transition-all active:scale-95 flex items-center justify-center"
            >
              <FaPaperPlane size={14} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default AiBot;

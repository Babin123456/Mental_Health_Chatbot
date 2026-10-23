import React, { useState, useRef } from "react";
import { Send, Mic, MicOff } from "lucide-react";

const MessageInput = ({ onSend }) => {
  const [message, setMessage] = useState("");
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  const initRecognition = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Your browser does not support voice recognition. Please try Chrome or Edge.");
      return null;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      setMessage((prev) => (prev ? `${prev} ${text}` : text));
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    return recognition;
  };

  const toggleVoiceRecording = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    let recognition = recognitionRef.current;
    if (!recognition) {
      recognition = initRecognition();
      recognitionRef.current = recognition;
    }

    if (!recognition) return;

    try {
      recognition.start();
      setIsListening(true);
    } catch (err) {
      console.error("Could not start recognition:", err);
      setIsListening(false);
    }
  };

  const handleSend = () => {
    if (!message.trim()) return;
    onSend(message.trim());
    setMessage("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="bg-white border-t border-gray-100 p-3 sm:p-4 shadow-lg flex-shrink-0">
      <div className="max-w-4xl mx-auto flex items-end gap-2 sm:gap-3 bg-gray-50 border border-gray-200 rounded-2xl p-2 focus-within:border-purple-400 focus-within:bg-white transition shadow-inner">
        {/* Voice Toggle Button */}
        <button
          type="button"
          onClick={toggleVoiceRecording}
          className={`p-2.5 rounded-xl transition cursor-pointer flex-shrink-0 ${
            isListening
              ? "bg-red-500 text-white animate-pulse"
              : "text-gray-500 hover:text-purple-600 hover:bg-purple-50"
          }`}
          title={isListening ? "Stop listening" : "Click to speak"}
          aria-label={isListening ? "Stop voice dictation" : "Start voice dictation"}
        >
          {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>

        {/* Text Input Area */}
        <textarea
          rows={1}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isListening ? "Listening to your voice..." : "Type your thoughts here... (Enter to send)"}
          className="flex-1 bg-transparent border-none focus:outline-none resize-none text-sm py-2 px-1 text-gray-800 placeholder-gray-400 max-h-32"
          aria-label="Chat message input"
        />

        {/* Send Button */}
        <button
          type="button"
          onClick={handleSend}
          disabled={!message.trim()}
          className="p-2.5 rounded-xl bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-40 disabled:hover:bg-purple-600 transition flex-shrink-0 cursor-pointer shadow-sm"
          title="Send message"
          aria-label="Send message"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default MessageInput;

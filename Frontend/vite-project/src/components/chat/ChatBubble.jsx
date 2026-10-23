import React, { useState } from "react";
import { Copy, Check, Volume2, VolumeX, AlertCircle } from "lucide-react";

export const ChatBubble = ({ message }) => {
  const isUser = message.sender === "user";
  const [copied, setCopied] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleCopy = () => {
    if (!message.text) return;
    navigator.clipboard.writeText(message.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeak = () => {
    if (!("speechSynthesis" in window)) {
      alert("Text-to-speech is not supported by your browser.");
      return;
    }

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(message.text);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    setIsPlaying(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div
      className={`group relative max-w-lg w-fit p-4 rounded-2xl shadow-sm transition ${
        isUser
          ? "chat-bubble-user text-white self-end rounded-br-none bg-purple-600"
          : message.isCrisis
          ? "bg-red-50 text-red-950 border border-red-200 self-start rounded-bl-none"
          : "chat-bubble-bot text-gray-800 bg-white border border-gray-100 self-start rounded-bl-none"
      }`}
    >
      {message.isCrisis && (
        <div className="flex items-center space-x-1.5 text-xs font-bold text-red-600 mb-2 pb-1 border-b border-red-200">
          <AlertCircle className="w-4 h-4" />
          <span>Emergency Support Response</span>
        </div>
      )}

      <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>

      {/* Bubble action toolbar */}
      <div className="flex items-center justify-between mt-2 pt-1 border-t border-black/5 text-xs">
        <div className="flex items-center space-x-1.5 opacity-70 group-hover:opacity-100 transition">
          {!isUser && (
            <button
              onClick={handleSpeak}
              className="p-1 rounded hover:bg-black/5 transition cursor-pointer"
              title={isPlaying ? "Stop audio" : "Listen to response"}
              aria-label={isPlaying ? "Stop reading response" : "Read response aloud"}
            >
              {isPlaying ? <VolumeX className="w-3.5 h-3.5 text-purple-600" /> : <Volume2 className="w-3.5 h-3.5 text-gray-500" />}
            </button>
          )}

          <button
            onClick={handleCopy}
            className="p-1 rounded hover:bg-black/5 transition cursor-pointer"
            title="Copy to clipboard"
            aria-label="Copy message text"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-green-500" />
            ) : (
              <Copy className={`w-3.5 h-3.5 ${isUser ? "text-purple-200" : "text-gray-400"}`} />
            )}
          </button>
        </div>

        {message.timestamp && (
          <span
            className={`text-[10px] ml-4 ${
              isUser ? "text-purple-200" : "text-gray-400"
            }`}
          >
            {message.timestamp}
          </span>
        )}
      </div>
    </div>
  );
};

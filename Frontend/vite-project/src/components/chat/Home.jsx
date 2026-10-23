import React from "react";
import { MessageSquare, Sparkles } from "lucide-react";

const Home = ({ onStartConversation, onSuggestionClick, recentSessions = [], onSelectSession }) => {
  return (
    <div className="flex flex-col items-center justify-center flex-grow text-center p-4 max-w-2xl mx-auto">
      <div className="header-avatar-bg w-24 h-24 rounded-full flex items-center justify-center mb-4 shadow-inner">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-purple-600" viewBox="0 0 20 20" fill="currentColor">
          <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
          <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h1a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
        </svg>
      </div>

      <h2 className="text-3xl sm:text-4xl font-light text-purple-700 leading-snug">
        Your Daily Mental Wellness Companion
      </h2>
      <p className="mt-2 text-sm text-gray-500 max-w-md">
        A private, compassionate space to unpack your thoughts, find clarity, and nurture emotional calm.
      </p>

      {/* Suggestion Chips */}
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        <button
          onClick={() => onSuggestionClick("Feeling anxious about work")}
          className="px-4 py-2 text-sm rounded-full text-white shadow-md bg-gradient-to-r from-purple-500 to-indigo-400 hover:opacity-90 transition cursor-pointer"
        >
          Feeling anxious
        </button>

        <button
          onClick={() => onSuggestionClick("Need quick breathing exercises to relax")}
          className="px-4 py-2 text-sm rounded-full text-white shadow-md bg-gradient-to-r from-fuchsia-500 to-purple-400 hover:opacity-90 transition cursor-pointer"
        >
          Need to relax
        </button>

        <button
          onClick={() => onSuggestionClick("I can't sleep, my mind won't stop racing")}
          className="px-4 py-2 text-sm rounded-full text-purple-900 shadow-md bg-gradient-to-r from-violet-200 to-purple-200 hover:opacity-90 transition cursor-pointer"
        >
          Can't sleep
        </button>
      </div>

      {/* Recent Conversations if any */}
      {recentSessions && recentSessions.length > 0 && (
        <div className="mt-8 w-full text-left">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 text-center">
            Resume Recent Conversation
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {recentSessions.slice(0, 4).map((sess) => (
              <button
                key={sess._id}
                onClick={() => onSelectSession(sess._id)}
                className="flex items-center space-x-2 p-3 bg-white/80 border border-purple-100 rounded-xl hover:border-purple-300 hover:bg-white text-left transition shadow-xs cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 text-purple-500 flex-shrink-0" />
                <span className="text-sm font-medium text-gray-700 truncate">{sess.title}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Primary Action Button */}
      <button
        onClick={onStartConversation}
        className="home-start-btn mt-8 px-8 py-3 text-white bg-purple-600 font-semibold rounded-full shadow-lg transition-transform transform hover:scale-105 cursor-pointer flex items-center space-x-2"
      >
        <Sparkles className="w-4 h-4" />
        <span>Start a Conversation</span>
      </button>
    </div>
  );
};

export default Home;

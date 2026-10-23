import React, { useState } from "react";
import GlobalStyles from "./components/common/GlobalStyles.jsx";
import Sidebar from "./components/layout/Sidebar.jsx";
import Header from "./components/layout/Header.jsx";
import Home from "./components/chat/Home.jsx";
import ChatHistory from "./components/chat/ChatHistory.jsx";
import MessageInput from "./components/chat/MessageInput.jsx";

import LoginCard from "./components/layout/LoginCard.jsx";
import CreateAccountCard from "./components/layout/CreateAccountCard.jsx";

import { sendMessageToBot } from "./api/chatApi";
import { useAuth } from "./context/AuthContext.jsx";

export default function App() {
  const { user, isLoggedIn, logout, isLoading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isChatActive, setIsChatActive] = useState(false);
  const [authView, setAuthView] = useState(null); // login / signup
  const [loading, setLoading] = useState(false);

  // ---------------- CHAT FUNCTIONS ---------------- //

  const handleStartConversation = async () => {
    const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    try {
      const response = await sendMessageToBot("Hello, I need someone to talk to.");
      
      setMessages([
        {
          id: 1,
          text: response.data.reply,
          sender: "bot",
          timestamp
        }
      ]);

      setIsChatActive(true);

    } catch (error) {
      console.error("Error starting conversation:", error);

      setMessages([
        {
          id: 1,
          text: "Hello! I'm here to listen and help. What's on your mind today?",
          sender: "bot",
          timestamp
        }
      ]);

      setIsChatActive(true);
    }
  };

  const handleSendMessage = async (text) => {
    const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const userMessage = {
      id: Date.now(),
      text,
      sender: "user",
      timestamp
    };

    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const response = await sendMessageToBot(text);

      const botMessage = {
        id: Date.now() + 1,
        text: response.data.reply,
        sender: "bot",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };

      setMessages((prev) => [...prev, botMessage]);

    } catch (error) {
      console.error("Chat API error:", error);

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          text: "Sorry, I'm having trouble connecting. Please try again.",
          sender: "bot",
          timestamp
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = async (text) => {
    const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const userMessage = {
      id: Date.now(),
      text,
      sender: "user",
      timestamp
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsChatActive(true);
    setLoading(true);

    try {
      const response = await sendMessageToBot(text);

      const botMessage = {
        id: Date.now() + 1,
        text: response.data.reply,
        sender: "bot",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };

      setMessages((prev) => [...prev, botMessage]);

    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          text: `I understand you're mentioning: ${text}. Can you tell me more?`,
          sender: "bot",
          timestamp
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setIsChatActive(false);
    setSidebarOpen(false);
  };

  // ---------------- AUTH FUNCTIONS ---------------- //

  const handleAuthClick = () => setAuthView("login");
  const handleCloseAuth = () => setAuthView(null);

  const handleSwitchAuthView = (view) => setAuthView(view);

  const handleLogout = () => {
    logout();
    setIsChatActive(false);
    setMessages([]);
  };

  const handleAuthSuccess = () => {
    setAuthView(null);
    setIsChatActive(false);
  };

  const renderAuthCard = () => {
    if (authView === "login") {
      return (
        <LoginCard
          onSwitchToSignup={() => handleSwitchAuthView("signup")}
          onAuthSuccess={handleAuthSuccess}
        />
      );
    }

    if (authView === "signup") {
      return (
        <CreateAccountCard
          onSwitchToLogin={() => handleSwitchAuthView("login")}
          onAuthSuccess={handleAuthSuccess}
        />
      );
    }

    return null;
  };

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-purple-50">
        <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // ---------------- UI ---------------- //

  return (
    <>
      <GlobalStyles />

      <div className="flex h-screen w-screen bg-gradient-to-br from-purple-100 via-white to-orange-100 overflow-hidden">

        {/* Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onNewChat={handleNewChat}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col max-h-screen">

          <Header
            onMenuClick={() => setSidebarOpen(true)}
            onAuthClick={handleAuthClick}
            onLogout={handleLogout}
            isLoggedIn={isLoggedIn}
            user={user}
          />

          <main className="flex-1 flex flex-col items-center justify-center text-center overflow-y-auto p-4">

            {/* Before Login */}
            {!isLoggedIn && (
              <h2 className="text-xl text-gray-700">
                👋 Welcome! Please{" "}
                <button
                  className="text-purple-600 font-semibold underline cursor-pointer"
                  onClick={handleAuthClick}
                >
                  login
                </button>{" "}
                to start chatting.
              </h2>
            )}

            {/* After Login, Before Chat Start */}
            {isLoggedIn && !isChatActive && (
              <Home
                onStartConversation={handleStartConversation}
                onSuggestionClick={handleSuggestionClick}
              />
            )}

            {/* Active chat */}
            {isLoggedIn && isChatActive && (
              <ChatHistory messages={messages} loading={loading} />
            )}
          </main>

          {/* Chat input */}
          {isLoggedIn && isChatActive && (
            <MessageInput onSend={handleSendMessage} />
          )}
        </div>
      </div>

      {/* Authentication Modal */}
      {authView && (
        <div className="fixed inset-0 bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center p-4 z-50">
          <div className="relative">
            <button
              onClick={handleCloseAuth}
              className="absolute -top-3 -right-3 bg-white text-gray-800 rounded-full h-8 w-8 flex items-center justify-center text-xl font-bold shadow-lg cursor-pointer"
            >
              &times;
            </button>

            {renderAuthCard()}
          </div>
        </div>
      )}
    </>
  );
}

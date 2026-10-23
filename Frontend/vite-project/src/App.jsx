import React, { useState, useEffect, useCallback } from "react";
import GlobalStyles from "./components/common/GlobalStyles.jsx";
import Sidebar from "./components/layout/Sidebar.jsx";
import Header from "./components/layout/Header.jsx";
import Home from "./components/chat/Home.jsx";
import ChatHistory from "./components/chat/ChatHistory.jsx";
import MessageInput from "./components/chat/MessageInput.jsx";

import LoginCard from "./components/layout/LoginCard.jsx";
import CreateAccountCard from "./components/layout/CreateAccountCard.jsx";

import { sendMessageToBot } from "./api/chatApi";
import { getSessions, getSessionHistory, deleteSession } from "./api/sessionApi";

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isChatActive, setIsChatActive] = useState(false);
  const [authView, setAuthView] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(() => Boolean(localStorage.getItem("token")));
  const [loading, setLoading] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);

  const loadSessions = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await getSessions();
      if (res.data?.sessions) {
        setSessions(res.data.sessions);
      }
    } catch (err) {
      console.warn("Failed to load user sessions:", err.message);
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      loadSessions();
    }
  }, [isLoggedIn, loadSessions]);

  const handleSelectSession = async (sessionId) => {
    setActiveSessionId(sessionId);
    setLoading(true);
    setIsChatActive(true);

    try {
      const res = await getSessionHistory(sessionId);
      if (res.data?.messages) {
        const formatted = res.data.messages.map((m, idx) => ({
          id: m._id || idx,
          text: m.text,
          sender: m.sender,
          timestamp: new Date(m.createdAt || Date.now()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        }));
        setMessages(formatted);
      }
    } catch (err) {
      console.error("Failed to load conversation history:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSession = async (sessionId) => {
    try {
      await deleteSession(sessionId);
      setSessions((prev) => prev.filter((s) => s._id !== sessionId));
      if (activeSessionId === sessionId) {
        handleNewChat();
      }
    } catch (err) {
      console.error("Failed to delete session:", err);
    }
  };

  const handleStartConversation = async () => {
    const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    try {
      const response = await sendMessageToBot("Hello, I need someone to talk to.", activeSessionId);
      if (response.data?.sessionId) {
        setActiveSessionId(response.data.sessionId);
        loadSessions();
      }

      setMessages([
        {
          id: 1,
          text: response.data.reply,
          sender: "bot",
          timestamp,
        },
      ]);
      setIsChatActive(true);
    } catch (error) {
      setMessages([
        {
          id: 1,
          text: "Hello! I'm here to listen and help. What's on your mind today?",
          sender: "bot",
          timestamp,
        },
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
      timestamp,
    };

    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const response = await sendMessageToBot(text, activeSessionId);
      if (response.data?.sessionId && !activeSessionId) {
        setActiveSessionId(response.data.sessionId);
        loadSessions();
      }

      const botMessage = {
        id: Date.now() + 1,
        text: response.data.reply,
        sender: "bot",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          text: "Sorry, I'm having trouble connecting. Please try again.",
          sender: "bot",
          timestamp,
        },
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
      timestamp,
    };

    setMessages([userMessage]);
    setIsChatActive(true);
    setLoading(true);

    try {
      const response = await sendMessageToBot(text, null);
      if (response.data?.sessionId) {
        setActiveSessionId(response.data.sessionId);
        loadSessions();
      }

      const botMessage = {
        id: Date.now() + 1,
        text: response.data.reply,
        sender: "bot",
        timestamp,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          text: `I understand you're mentioning: ${text}. Can you tell me more?`,
          sender: "bot",
          timestamp,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleNewChat = () => {
    setActiveSessionId(null);
    setMessages([]);
    setIsChatActive(false);
    setSidebarOpen(false);
  };

  const handleAuthClick = () => setAuthView("login");
  const handleCloseAuth = () => setAuthView(null);
  const handleSwitchAuthView = (view) => setAuthView(view);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setActiveSessionId(null);
    setSessions([]);
    setIsChatActive(false);
    setMessages([]);
  };

  const handleAuthSuccess = () => {
    setIsLoggedIn(true);
    setAuthView(null);
    loadSessions();
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

  return (
    <>
      <GlobalStyles />

      <div className="flex h-screen w-screen bg-gradient-to-br from-purple-100 via-white to-orange-100 overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onNewChat={handleNewChat}
          onLogout={handleLogout}
          sessions={sessions}
          activeSessionId={activeSessionId}
          onSelectSession={handleSelectSession}
          onDeleteSession={handleDeleteSession}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col max-h-screen">
          <Header
            onMenuClick={() => setSidebarOpen(true)}
            onAuthClick={handleAuthClick}
            onLogout={handleLogout}
            isLoggedIn={isLoggedIn}
          />

          <main className="flex-1 flex flex-col items-center justify-center text-center overflow-y-auto p-4">
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

            {isLoggedIn && !isChatActive && (
              <Home
                onStartConversation={handleStartConversation}
                onSuggestionClick={handleSuggestionClick}
                recentSessions={sessions}
                onSelectSession={handleSelectSession}
              />
            )}

            {isLoggedIn && isChatActive && (
              <ChatHistory messages={messages} loading={loading} />
            )}
          </main>

          {isLoggedIn && isChatActive && (
            <MessageInput onSend={handleSendMessage} />
          )}
        </div>
      </div>

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

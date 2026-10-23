import "./header.css";
import React from "react";
import { MessageSquare, Plus, Trash2, LogOut, X } from "lucide-react";

const Sidebar = ({
  isOpen,
  onClose,
  onNewChat,
  onLogout,
  sessions = [],
  activeSessionId = null,
  onSelectSession,
  onDeleteSession,
}) => {
  const handleStartNewChat = () => {
    if (onNewChat) onNewChat();
    onClose();
  };

  const handleSelect = (sessionId) => {
    if (onSelectSession) onSelectSession(sessionId);
    onClose();
  };

  const handleDelete = (e, sessionId) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this conversation?")) {
      if (onDeleteSession) onDeleteSession(sessionId);
    }
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 transition-opacity backdrop-blur-xs"
          onClick={onClose}
        ></div>
      )}

      <div
        className={`fixed top-0 left-0 h-full bg-white w-72 shadow-2xl z-40 transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold">
              🧠
            </div>
            <h2 className="text-lg font-bold text-gray-800">MindEase</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 cursor-pointer"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* New Chat Button */}
        <div className="p-4 border-b border-gray-100">
          <button
            onClick={handleStartNewChat}
            className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl bg-purple-600 text-white font-medium hover:bg-purple-700 transition shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Chat</span>
          </button>
        </div>

        {/* Conversations History List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          <div className="px-3 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Conversations
          </div>

          {sessions.length === 0 ? (
            <div className="px-3 py-6 text-center text-sm text-gray-400">
              No previous chats yet
            </div>
          ) : (
            sessions.map((sess) => {
              const isActive = activeSessionId === sess._id;
              return (
                <div
                  key={sess._id}
                  onClick={() => handleSelect(sess._id)}
                  className={`group flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition cursor-pointer ${
                    isActive
                      ? "bg-purple-100 text-purple-800 font-medium"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <div className="flex items-center space-x-2.5 truncate flex-1 mr-2">
                    <MessageSquare className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-purple-600" : "text-gray-400"}`} />
                    <span className="truncate">{sess.title || "Conversation"}</span>
                  </div>

                  <button
                    onClick={(e) => handleDelete(e, sess._id)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 rounded transition cursor-pointer"
                    title="Delete conversation"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Sidebar Footer with Logout */}
        <div className="p-4 border-t border-gray-100">
          <button
            onClick={onLogout}
            className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-xl transition cursor-pointer font-medium"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;

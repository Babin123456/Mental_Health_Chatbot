import React, { useState } from "react";
import { AlertTriangle, PhoneCall, X } from "lucide-react";

const CrisisBanner = () => {
  const [dismissed, setDismissed] = useState(false);
  const [showModal, setShowModal] = useState(false);

  if (dismissed) return null;

  return (
    <>
      <div className="bg-gradient-to-r from-red-500 via-rose-500 to-pink-600 text-white px-4 py-2 text-xs sm:text-sm flex items-center justify-between shadow-xs z-20">
        <div className="flex items-center space-x-2 truncate">
          <AlertTriangle className="w-4 h-4 flex-shrink-0 animate-pulse text-amber-200" />
          <span className="font-medium truncate">
            Need urgent help? In crisis, call <strong>14416</strong> (Tele-MANAS, India) or <strong>988</strong> (US/Canada).
          </span>
        </div>

        <div className="flex items-center space-x-2 flex-shrink-0 ml-2">
          <button
            onClick={() => setShowModal(true)}
            className="underline hover:text-amber-100 font-semibold cursor-pointer flex items-center space-x-1"
          >
            <PhoneCall className="w-3.5 h-3.5 inline" />
            <span className="hidden sm:inline">All Helplines</span>
          </button>
          <button
            onClick={() => setDismissed(true)}
            className="p-1 hover:bg-white/20 rounded-full transition cursor-pointer"
            aria-label="Dismiss crisis banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl relative border border-red-100">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center">
                <PhoneCall className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">24/7 Crisis Support Helplines</h3>
                <p className="text-xs text-gray-500">Free, confidential assistance available right now.</p>
              </div>
            </div>

            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              <div className="p-3 bg-red-50/60 border border-red-100 rounded-2xl">
                <div className="font-bold text-red-800 text-sm">Tele-MANAS (India)</div>
                <div className="text-xs text-gray-600 mt-0.5">National tele-mental health programme across all official languages.</div>
                <a href="tel:14416" className="inline-block mt-2 font-bold text-red-600 hover:underline text-xs">
                  📞 Call 14416 (Toll-free 24/7)
                </a>
              </div>

              <div className="p-3 bg-purple-50/60 border border-purple-100 rounded-2xl">
                <div className="font-bold text-purple-800 text-sm">Vandrevala Foundation</div>
                <div className="text-xs text-gray-600 mt-0.5">Free 24/7 mental health counseling and psychological first aid.</div>
                <a href="tel:+919999666555" className="inline-block mt-2 font-bold text-purple-600 hover:underline text-xs">
                  📞 Call +91 9999 666 555 (24/7)
                </a>
              </div>

              <div className="p-3 bg-blue-50/60 border border-blue-100 rounded-2xl">
                <div className="font-bold text-blue-800 text-sm">988 Suicide & Crisis Lifeline (USA & Canada)</div>
                <div className="text-xs text-gray-600 mt-0.5">Confidential crisis intervention via phone call or text.</div>
                <a href="tel:988" className="inline-block mt-2 font-bold text-blue-600 hover:underline text-xs">
                  📞 Call or Text 988 (24/7)
                </a>
              </div>

              <div className="p-3 bg-gray-50 border border-gray-200 rounded-2xl">
                <div className="font-bold text-gray-800 text-sm">Befrienders Worldwide</div>
                <div className="text-xs text-gray-600 mt-0.5">International directory of volunteer-driven emotional support helplines.</div>
                <a href="https://www.befrienders.org" target="_blank" rel="noopener noreferrer" className="inline-block mt-2 font-bold text-gray-700 hover:underline text-xs">
                  🌐 Visit befrienders.org
                </a>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 text-center">
              <button
                onClick={() => setShowModal(false)}
                className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-xl transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CrisisBanner;

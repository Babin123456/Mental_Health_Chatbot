import React, { useState } from "react";
import { X, Heart, CheckCircle2 } from "lucide-react";
import { logMood } from "../../api/moodApi";

const MOODS = [
  { score: 5, label: "Great", emoji: "😄", color: "border-green-400 bg-green-50 text-green-700" },
  { score: 4, label: "Good", emoji: "🙂", color: "border-teal-400 bg-teal-50 text-teal-700" },
  { score: 3, label: "Neutral", emoji: "😐", color: "border-amber-400 bg-amber-50 text-amber-700" },
  { score: 2, label: "Low", emoji: "😔", color: "border-orange-400 bg-orange-50 text-orange-700" },
  { score: 1, label: "Overwhelmed", emoji: "😣", color: "border-red-400 bg-red-50 text-red-700" },
];

const EMOTION_TAGS = [
  "Calm", "Grateful", "Anxious", "Stressed", "Tired", "Hopeful", "Lonely", "Motivated", "Frustrated"
];

const MoodCheckInModal = ({ isOpen, onClose, onMoodLogged }) => {
  const [selectedMood, setSelectedMood] = useState(null);
  const [selectedEmotions, setSelectedEmotions] = useState([]);
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const toggleEmotion = (tag) => {
    setSelectedEmotions((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedMood) return;

    setIsSubmitting(true);
    try {
      await logMood({
        moodScore: selectedMood.score,
        moodLabel: selectedMood.label,
        emotions: selectedEmotions,
        note,
      });

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        if (onMoodLogged) onMoodLogged(selectedMood);
        onClose();
      }, 1200);
    } catch (err) {
      console.error("Failed to log mood:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative border border-purple-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 rounded-full cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {success ? (
          <div className="py-12 text-center space-y-3">
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto animate-bounce" />
            <h3 className="text-2xl font-bold text-gray-800">Check-in Logged!</h3>
            <p className="text-sm text-gray-500">Thank you for taking a moment for yourself today.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-2">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">Daily Mood Check-in</h3>
              <p className="text-xs text-gray-500 mt-1">How are you feeling right now?</p>
            </div>

            {/* Mood Emoji Selection */}
            <div className="grid grid-cols-5 gap-2">
              {MOODS.map((m) => {
                const isSelected = selectedMood?.score === m.score;
                return (
                  <button
                    key={m.score}
                    type="button"
                    onClick={() => setSelectedMood(m)}
                    className={`flex flex-col items-center p-2 rounded-2xl border-2 transition cursor-pointer ${
                      isSelected ? `${m.color} ring-2 ring-purple-400 scale-105 shadow-sm` : "border-gray-100 hover:bg-gray-50 text-gray-600"
                    }`}
                  >
                    <span className="text-2xl">{m.emoji}</span>
                    <span className="text-[10px] font-medium mt-1 truncate">{m.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Emotion Tags */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-2">
                What describes your headspace? (Optional)
              </label>
              <div className="flex flex-wrap gap-1.5">
                {EMOTION_TAGS.map((tag) => {
                  const isTagged = selectedEmotions.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleEmotion(tag)}
                      className={`text-xs px-2.5 py-1 rounded-full border transition cursor-pointer ${
                        isTagged
                          ? "bg-purple-600 text-white border-purple-600"
                          : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Reflection Note */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Reflections or Thoughts
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="What is contributing to how you feel today?"
                rows={3}
                className="w-full text-sm p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={!selectedMood || isSubmitting}
              className="w-full py-3 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition disabled:opacity-40 disabled:cursor-not-allowed shadow-md cursor-pointer"
            >
              {isSubmitting ? "Saving..." : "Save Today's Check-in"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default MoodCheckInModal;

import Mood from "../models/mood.js";

export const logMood = async (req, res) => {
  try {
    const { moodScore, moodLabel, emotions, note } = req.body;
    const userId = req.user?.userId || null;

    if (!moodScore || !moodLabel) {
      return res.status(400).json({ error: "moodScore and moodLabel are required." });
    }

    const newMood = new Mood({
      userId,
      moodScore: Number(moodScore),
      moodLabel,
      emotions: Array.isArray(emotions) ? emotions : [],
      note: typeof note === "string" ? note.slice(0, 500) : "",
      loggedAt: new Date(),
    });

    await newMood.save();

    return res.status(201).json({
      message: "Mood logged successfully!",
      mood: newMood,
    });
  } catch (error) {
    console.error("Log mood error:", error);
    return res.status(500).json({ error: "Failed to log mood." });
  }
};

export const getMoodHistory = async (req, res) => {
  try {
    const userId = req.user?.userId || null;
    const limit = parseInt(req.query.limit, 10) || 30;

    const query = userId ? { userId } : {};
    const moods = await Mood.find(query)
      .sort({ loggedAt: -1 })
      .limit(limit)
      .lean();

    return res.status(200).json({ moods });
  } catch (error) {
    console.error("Get mood history error:", error);
    return res.status(500).json({ error: "Failed to retrieve mood history." });
  }
};

export const getWeeklyMoodSummary = async (req, res) => {
  try {
    const userId = req.user?.userId || null;
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const matchQuery = { loggedAt: { $gte: sevenDaysAgo } };
    if (userId) matchQuery.userId = userId;

    const moods = await Mood.find(matchQuery).sort({ loggedAt: 1 }).lean();

    const totalLogs = moods.length;
    const averageScore = totalLogs > 0
      ? (moods.reduce((sum, m) => sum + m.moodScore, 0) / totalLogs).toFixed(1)
      : null;

    return res.status(200).json({
      period: "Last 7 Days",
      totalLogs,
      averageScore: averageScore ? Number(averageScore) : null,
      history: moods,
    });
  } catch (error) {
    console.error("Mood summary error:", error);
    return res.status(500).json({ error: "Failed to compute mood summary." });
  }
};

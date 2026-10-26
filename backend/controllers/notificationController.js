const Notification = require("../models/Notification");

const getNotifications = async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: "Not authorized. Token required." });
    }

    const limit = Math.min(Number(req.query.limit) || 30, 100);
    const notifications = await Notification.find({ recipientId: userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
    const unreadCount = await Notification.countDocuments({ recipientId: userId, isRead: false });

    res.status(200).json({ success: true, notifications, unreadCount });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Unable to fetch notifications." });
  }
};

const markAllNotificationsRead = async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: "Not authorized. Token required." });
    }

    await Notification.updateMany(
      { recipientId: userId, isRead: false },
      { $set: { isRead: true } }
    );
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error marking notifications read:", error);
    res.status(500).json({ message: "Unable to update notifications." });
  }
};

module.exports = { getNotifications, markAllNotificationsRead };

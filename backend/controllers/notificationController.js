const Notification = require("../models/Notification");

const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipientId: req.user.userId }).sort({ createdAt: -1 }).limit(30);
    const unreadCount = notifications.filter((notification) => !notification.isRead).length;
    res.status(200).json({ success: true, notifications, unreadCount });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Unable to fetch notifications." });
  }
};

const markAllNotificationsRead = async (req, res) => {
  try {
    await Notification.updateMany({ recipientId: req.user.userId, isRead: false }, { isRead: true });
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error marking notifications read:", error);
    res.status(500).json({ message: "Unable to update notifications." });
  }
};

module.exports = { getNotifications, markAllNotificationsRead };

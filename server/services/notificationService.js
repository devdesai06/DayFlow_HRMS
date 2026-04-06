import { Notification } from "../models/Notification.js";
import { getIO } from "./socketHub.js";

export async function notifyUser({ userId, title, message, type = "INFO", meta = {} }) {
  const n = await Notification.create({ userId, title, message, type, meta });
  try {
    const io = getIO();
    io.to(`user:${String(userId)}`).emit("notification:new", {
      id: String(n._id),
      title: n.title,
      message: n.message,
      type: n.type,
      createdAt: n.createdAt,
      readAt: n.readAt,
      meta: n.meta,
    });
  } catch {
    // ignore if socket not ready
  }
  return n;
}


import { asyncWrapper } from "../utils/asyncWrapper.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Notification } from "../models/Notification.js";

export const listNotifications = asyncWrapper(async (req, res) => {
  const { page, limit } = req.query;
  const skip = (page - 1) * limit;

  const [rows, total] = await Promise.all([
    Notification.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Notification.countDocuments({ userId: req.user.id }),
  ]);

  const unread = await Notification.countDocuments({
    userId: req.user.id,
    readAt: null,
  });

  res.status(200).json(
    new ApiResponse({
      message: "Notifications fetched.",
      data: { rows, unread },
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    })
  );
});

export const markRead = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const n = await Notification.findOne({ _id: id, userId: req.user.id });
  if (!n) throw new ApiError(404, "Notification not found");
  if (!n.readAt) {
    n.readAt = new Date();
    await n.save();
  }
  res.status(200).json(new ApiResponse({ message: "Marked read.", data: { notification: n } }));
});


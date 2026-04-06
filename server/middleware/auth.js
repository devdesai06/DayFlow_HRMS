import { ApiError } from "../utils/ApiError.js";
import { verifyAccessToken } from "../utils/jwt.js";
import { User } from "../models/User.js";
import { Employee } from "../models/Employee.js";

export async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice("Bearer ".length).trim()
      : null;

    if (!token) throw new ApiError(401, "Unauthorized");

    const payload = verifyAccessToken(token);
    const user = await User.findById(payload.sub).select("email role isEmailVerified");
    if (!user) throw new ApiError(401, "Unauthorized");

    const emp = await Employee.findOne({ userId: user._id }).select("_id");

    req.user = {
      id: String(user._id),
      email: user.email,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
      employeeId: emp ? String(emp._id) : null,
    };
    next();
  } catch (e) {
    next(e);
  }
}


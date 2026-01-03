import jwt from "jsonwebtoken";

export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token missing" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 🔴 MUST MATCH PAYLOAD
    req.user = decoded; // { userId, role }

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

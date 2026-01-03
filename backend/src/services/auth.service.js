import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { findUserByEmail, createUser } from "../repositories/user.repository.js";

const SALT_ROUNDS = 10;

export async function registerUser(payload) {
  const existing = await findUserByEmail(payload.email);
  if (existing) {
    throw new Error("Email already registered");
  }

  const passwordHash = await bcrypt.hash(payload.password, SALT_ROUNDS);

  const userId = await createUser({
    employeeCode: payload.employeeCode,
    email: payload.email,
    passwordHash,
    role: payload.role
  });

  return userId;
}

export async function loginUser({ email, password }) {
  const user = await findUserByEmail(email);
  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  const token = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  return {
    token,
    role: user.role
  };
}

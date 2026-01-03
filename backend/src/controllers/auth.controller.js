import { registerUser, loginUser } from "../services/auth.service.js";

export async function register(req, res) {
  try {
    const { employeeCode, email, password, role } = req.body;

    if (!employeeCode || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    await registerUser({ employeeCode, email, password, role });

    return res.status(201).json({
      message: "User registered successfully"
    });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}

export async function login(req, res) {
  try {



    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const data = await loginUser({ email, password });

    return res.status(200).json(data);
  } catch (err) {
    return res.status(401).json({ message: err.message });
  }
}

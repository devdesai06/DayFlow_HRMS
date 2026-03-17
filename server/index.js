import express from "express";
import cors from "cors";
import authRouter from "./routes/auth.js";
import departmentRouter from "./routes/department.js";
import employeeRouter from "./routes/employee.js";
import leaveRouter from "./routes/leave.js";
import attendanceRouter from "./routes/attendance.js"
import profileRouter from "./routes/profile.js"
import connectToDatabase from "./db/db.js";
const port = process.env.PORT || 5000;

connectToDatabase();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/department", departmentRouter);
app.use("/api/employee", employeeRouter);
app.use("/api/leave", leaveRouter);
app.use("/api/attendance", attendanceRouter);
app.use("/api/profile", profileRouter);

app.listen(port, () => {
  console.log(`server is running on ${port}`);
});

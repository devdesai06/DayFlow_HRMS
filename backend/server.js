import express from "express";
import { testDBConnection } from "./src/db/testConnection.js";

const app = express();

app.use(express.json());

await testDBConnection();

app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

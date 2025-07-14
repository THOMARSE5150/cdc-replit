import express, { Request, Response } from "express";
import session from "express-session";
import memoryStore from "memorystore";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

import contactRoutes from "./routes/contact"; // adjust if multiple routes needed

dotenv.config();

const MemoryStore = memoryStore(session);

// Enable __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || "8080");

// 🧠 Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🔐 Session handling
app.use(
  session({
    secret: process.env.SESSION_SECRET || "change_this_secret",
    resave: false,
    saveUninitialized: false,
    store: new MemoryStore({ checkPeriod: 86400000 }), // 1 day
  })
);

// 🚀 API routes
app.use("/api/contact", contactRoutes); // adjust if needed

// ✅ Healthcheck for Railway
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).send("OK");
});

// 🧱 Serve static frontend from dist/client
const distClientPath = path.resolve(__dirname, "../client");
app.use(express.static(distClientPath));

// 🎯 Fallback to index.html for SPA
app.get("*", (_req: Request, res: Response) => {
  res.sendFile(path.join(distClientPath, "index.html"));
});

// 🔊 Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
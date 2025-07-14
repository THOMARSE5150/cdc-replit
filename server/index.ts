import express from "express";
import session from "express-session";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import memorystore from "memorystore";

// ✅ Correct contact route import
import contactRoutes from "./routes/contact";

const MemoryStore = memorystore(session);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Session (not required for contact form, but if you use auth/session elsewhere, keep this)
app.use(
  session({
    secret: process.env.SESSION_SECRET || "change_this_secret",
    resave: false,
    saveUninitialized: false,
    store: new MemoryStore({ checkPeriod: 86400000 }),
  })
);

// ✅ Serve static files (optional, usually handled by Vite frontend or CDN)
app.use(express.static(join(__dirname, "..", "public")));

// ✅ API route for contact form
app.use("/api/contact", contactRoutes);

// ✅ Debug: log all requests (optional but helpful on Railway)
app.use((req, _res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});

// ✅ Fallback route to frontend (can disable if frontend handles 404s via client router)
app.get("*", (_req, res) => {
  res.sendFile(join(__dirname, "..", "public", "homepage.html"));
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
import express from "express";
import session from "express-session";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import memorystore from "memorystore";

// ✅ Use ESM-compatible path (with .js extension)
import contactRoutes from "./routes/contact.js";

const MemoryStore = memorystore(session);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Session config (skip if not needed)
app.use(
  session({
    secret: process.env.SESSION_SECRET || "change_this_secret",
    resave: false,
    saveUninitialized: false,
    store: new MemoryStore({ checkPeriod: 86400000 }),
  })
);

// ✅ Serve static files
app.use(express.static(join(__dirname, "../public")));

// ✅ API route
app.use("/api/contact", contactRoutes);

// ✅ Optional logging
app.use((req, _res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});

// ✅ Fallback for SPA
app.get("*", (_req, res) => {
  res.sendFile(join(__dirname, "../public/homepage.html"));
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
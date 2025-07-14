import express, { Request, Response } from "express";
import session from "express-session";
import memorystore from "memorystore";
import path from "node:path";
import { fileURLToPath } from "node:url";
import contactRoutes from "./routes/contact.ts";

const MemoryStore = memorystore(session);

// ⛓ Required for __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Session
app.use(
  session({
    secret: process.env.SESSION_SECRET || "change_this_secret",
    resave: false,
    saveUninitialized: false,
    store: new MemoryStore({ checkPeriod: 86400000 }),
  })
);

// ✅ Static files
app.use(express.static(path.join(__dirname, "../public")));

// ✅ API route
app.use("/api/contact", contactRoutes);

// ✅ Railway healthcheck endpoint
app.get("/health", (req: Request, res: Response) => {
  res.status(200).send("OK");
});

// ✅ Logging (optional)
app.use((req, _res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});

// ✅ SPA fallback
app.get("*", (_req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "../public/homepage.html"));
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
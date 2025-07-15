import express, { Request, Response } from "express";
import session from "express-session";
import memoryStore from "memorystore";
import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

// Corrected import for the new contact route
import contactRoutes from './routes/contact.js';

dotenv.config();

const MemoryStore = memorystore(session);

// Required for __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Use Railway-provided port if available
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 8080;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session
app.use(
  session({
    secret: process.env.SESSION_SECRET || "change_this_secret",
    resave: false,
    saveUninitialized: false,
    store: new MemoryStore({ checkPeriod: 86400000 }),
  })
);

// Static files (This path is for a production build)
const clientDistPath = path.resolve(__dirname, "../../client/dist");
app.use(express.static(clientDistPath));

// API route
app.use("/api/contact", contactRoutes);

// Railway healthcheck endpoint
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).send("OK");
});

// Logging (optional)
app.use((req, _res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});

// SPA fallback (This path is for a production build)
app.get("*", (_req: Request, res: Response) => {
  res.sendFile(path.join(clientDistPath, "index.html"));
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
import express from "express";
import session from "express-session";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import path from "path";
import memorystore from "memorystore";

const MemoryStore = memorystore(session);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret",
    resave: false,
    saveUninitialized: false,
    store: new MemoryStore({
      checkPeriod: 86400000 // 24 hours
    }),
    cookie: {
      maxAge: 86400000,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax"
    }
  })
);

// Serve static files from dist
app.use(express.static(path.join(__dirname, "../dist")));

// Fallback to index.html for SPA
app.get("*", (_, res) => {
  res.sendFile(join(__dirname, "../dist/index.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
// server/index.ts
import express from "express";
import session from "express-session";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import path from "path";
import memorystore from "memorystore";
var MemoryStore = memorystore(session);
var __filename = fileURLToPath(import.meta.url);
var __dirname = dirname(__filename);
var app = express();
var PORT = process.env.PORT || 8080;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret",
    resave: false,
    saveUninitialized: false,
    store: new MemoryStore({
      checkPeriod: 864e5
      // 24 hours
    }),
    cookie: {
      maxAge: 864e5,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax"
    }
  })
);
app.use(express.static(path.join(__dirname, "../dist")));
app.get("*", (_, res) => {
  res.sendFile(join(__dirname, "../dist/index.html"));
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

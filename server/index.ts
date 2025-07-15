import express, { Request, Response } from "express";
import { fileURLToPath } from "url";
import path from "path";
import dotenv from "dotenv";

import contactRoutes from "./contact.js"; // This path is correct

dotenv.config();

// Enable __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || "8080");

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use("/api/contact", contactRoutes);

// Healthcheck for Railway
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).send("OK");
});

// Serve static frontend from dist/client
const distClientPath = path.resolve(__dirname, "../../client/dist"); // Adjusted path to client build
app.use(express.static(distClientPath));

// Fallback to index.html for SPA
app.get("*", (_req: Request, res: Response) => {
  res.sendFile(path.join(distClientPath, "index.html"));
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
import express from 'express';
import session from 'express-session';
import memoryStore from 'memorystore';
import path from 'path';
import { fileURLToPath } from 'url';
import contactRoutes from './routes/contact.js';

// ES module __dirname setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const MemoryStore = memoryStore(session);

// Use Railway-provided port if available, otherwise default to 8080
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
// It correctly points from `dist/server/` to `dist/client/`
const clientDistPath = path.resolve(__dirname, '../client');
app.use(express.static(clientDistPath));

// API routes
app.use("/api/contact", contactRoutes);

// Catch-all route to serve the React app
// This is essential for client-side routing to work in production
app.get('*', (req, res) => {
  res.sendFile(path.resolve(clientDistPath, 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
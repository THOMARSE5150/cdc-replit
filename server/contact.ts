import { Router } from "express";
import { sendContactConfirmation } from "./email.js";

const contactRoutes = Router();

contactRoutes.post("/", async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const [firstName = "", ...rest] = name.split(" ");
    const lastName = rest.join(" ") || "(no last name)";

    const emailSent = await sendContactConfirmation(firstName, lastName, email, message);

    if (!emailSent) {
      throw new Error("Failed to send confirmation email");
    }

    res.status(200).json({ message: "Message received and confirmation sent!" });
  } catch (error) {
    console.error("Contact form error:", error);
    res.status(500).json({ error: "An internal error occurred." });
  }
});

// GET /api/contact/health - simple health check for Railway
contactRoutes.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

export default contactRoutes;
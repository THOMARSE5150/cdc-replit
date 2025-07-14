import { Router } from "express";
import { sendContactConfirmation } from "../email"; // ✅ import email sender

const contactRoutes = Router();

// ✅ POST /api/contact — handles form submission
contactRoutes.post("/", async (req, res) => {
  const { name, email, phone, enquiryType, preferredLocation, message } = req.body;

  console.log("Form submitted:", {
    name,
    email,
    phone,
    enquiryType,
    preferredLocation,
    message,
  });

  // 🔄 Split name into first + last
  const [firstName = "", ...rest] = name.split(" ");
  const lastName = rest.join(" ") || "(no last name)";

  // ✅ Send confirmation email
  const emailSent = await sendContactConfirmation(firstName, lastName, email, message);

  if (!emailSent) {
    return res.status(500).json({ error: "Failed to send confirmation email" });
  }

  res.status(200).json({ message: "Message received and confirmation sent!" });
});

// ✅ GET /api/contact/health — simple health check for Railway
contactRoutes.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

export default contactRoutes;
import { Router } from "express";

const contactRoutes = Router();

// ✅ POST /api/contact — handles form submission
contactRoutes.post("/", (req, res) => {
  const { name, email, phone, enquiryType, preferredLocation, message } = req.body;

  console.log("Form submitted:", {
    name,
    email,
    phone,
    enquiryType,
    preferredLocation,
    message,
  });

  // TODO: Add email forwarding with Nodemailer/Postmark/etc.

  res.status(200).json({ message: "Message received!" });
});

// ✅ GET /api/contact/health — simple health check for Railway
contactRoutes.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

export default contactRoutes;
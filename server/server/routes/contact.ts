import { Router } from "express";

const contactRoutes = Router();

contactRoutes.post("/", (req, res) => {
  const { name, email, phone, enquiryType, preferredLocation, message } = req.body;

  console.log("Form submitted:", { name, email, phone, enquiryType, preferredLocation, message });

  // You could later email this using Nodemailer, Postmark, etc.

  res.status(200).json({ message: "Message received!" });
});

export default contactRoutes;
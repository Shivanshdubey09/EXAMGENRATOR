const express = require("express");
const bcrypt = require("bcryptjs");
const Teacher = require("../models/Teacher");

const router = express.Router();

/* ===============================
   REGISTER
================================ */
router.post("/register", async (req, res) => {
  try {
    const { name, subject, email, password } = req.body;

    if (!name || !subject || !email || !password) {
      return res.status(400).json({ message: "All fields required." });
    }

    const existing = await Teacher.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const teacher = await Teacher.create({
      name,
      subject,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      _id: teacher._id,
      name: teacher.name,
      email: teacher.email,
      subject: teacher.subject,
    });

  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ message: "Registration failed." });
  }
});

/* ===============================
   LOGIN
================================ */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required." });
    }

    const teacher = await Teacher.findOne({ email });
    if (!teacher) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const isMatch = await bcrypt.compare(password, teacher.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    res.json({
      _id: teacher._id,
      name: teacher.name,
      email: teacher.email,
      subject: teacher.subject,
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: "Login failed." });
  }
});

module.exports = router;
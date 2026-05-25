const express = require("express");
const router = express.Router();
const Paper = require("../models/Paper");
const PDFDocument = require("pdfkit");

/* =========================================
   POST /api/papers
========================================= */
router.post("/", async (req, res) => {
  try {
    const paper = await Paper.create(req.body);
    return res.status(201).json(paper);
  } catch (err) {
    console.error("❌ Save Paper Error:", err.message);
    return res.status(500).json({ message: "Failed to save paper" });
  }
});

/* =========================================
   GET /api/papers/teacher/:id
========================================= */
router.get("/teacher/:id", async (req, res) => {
  try {
    const papers = await Paper.find({ teacherId: req.params.id })
      .sort({ createdAt: -1 });

    return res.status(200).json(papers);
  } catch (err) {
    console.error("❌ Fetch Papers Error:", err.message);
    return res.status(500).json({ message: "Failed to fetch papers" });
  }
});

/* =========================================
   GET /api/papers/:id
========================================= */
router.get("/:id", async (req, res) => {
  try {
    const paper = await Paper.findById(req.params.id);
    if (!paper) {
      return res.status(404).json({ message: "Paper not found" });
    }
    return res.status(200).json(paper);
  } catch (err) {
    console.error("❌ Fetch Single Paper Error:", err.message);
    return res.status(500).json({ message: "Failed to fetch paper" });
  }
});

/* =========================================
   GET /api/papers/:id/pdf
   PROFESSIONAL ACADEMIC PDF ENGINE
========================================= */
router.get("/:id/pdf", async (req, res) => {
  try {
    const paper = await Paper.findById(req.params.id);
    if (!paper) {
      return res.status(404).json({ message: "Paper not found" });
    }

    const safeTitle = paper.title.replace(/[^a-z0-9]/gi, "_").toLowerCase();

    const doc = new PDFDocument({
      margin: 50,
      size: "A4",
      bufferPages: true
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${safeTitle}.pdf`
    );

    doc.pipe(res);

    /* ========= COVER HEADER ========= */

    doc
      .fontSize(16)
      .font("Helvetica-Bold")
      .text(paper.schoolName || "SCHOOL NAME", { align: "center" });

    doc.moveDown(0.5);

    doc
      .fontSize(12)
      .font("Helvetica")
      .text(`Board: ${paper.board || "CBSE"}`, { align: "center" })
      .text(`Class: ${paper.className || "-"}`, { align: "center" })
      .text(`Subject: ${paper.subject}`, { align: "center" })
      .text(`Duration: ${paper.duration || "3 Hours"}`, { align: "center" })
      .text(`Total Marks: ${paper.totalMarks || 0}`, { align: "center" });

    doc.moveDown(2);

    /* ========= TITLE ========= */
    doc
      .fontSize(14)
      .font("Helvetica-Bold")
      .text(paper.title.toUpperCase(), { align: "center" });

    doc.moveDown(2);

    /* ========= INSTRUCTIONS ========= */
    doc.font("Helvetica-Bold").text("Instructions:", { underline: true });
    doc.moveDown(0.5);

    doc
      .font("Helvetica")
      .text("1. All questions are compulsory.")
      .text("2. Write answers clearly and neatly.")
      .text("3. Attempt all sections.");

    doc.moveDown(2);

    /* ========= SECTION GROUPING ========= */
    const grouped = {};

    paper.questions.forEach((q) => {
      const section = q.section || "General";
      if (!grouped[section]) grouped[section] = [];
      grouped[section].push(q);
    });

    Object.keys(grouped).forEach((sectionName) => {
      doc.addPage();

      doc
        .font("Helvetica-Bold")
        .fontSize(14)
        .text(`SECTION ${sectionName}`, { underline: true });

      doc.moveDown(1);

      grouped[sectionName].forEach((q, index) => {
        if (doc.y > 720) doc.addPage();

        doc
          .font("Helvetica-Bold")
          .fontSize(12)
          .text(
            `${index + 1}. ${q.question || q.questionText} (${
              q.marks || paper.marksPerQuestion || 1
            } Marks)`
          );

        doc.moveDown(0.5);

        if (Array.isArray(q.options)) {
          doc.font("Helvetica");
          q.options.forEach((opt, i) => {
            doc.text(
              `   ${String.fromCharCode(65 + i)}. ${opt}`
            );
          });
        }

        doc.moveDown();
      });
    });

    /* ========= PAGE NUMBERS ========= */
    const range = doc.bufferedPageRange();
    for (let i = 0; i < range.count; i++) {
      doc.switchToPage(i);
      doc.fontSize(9).text(
        `Page ${i + 1} of ${range.count}`,
        50,
        820,
        { align: "center" }
      );
    }

    doc.end();

  } catch (err) {
    console.error("❌ PDF Generation Error:", err.message);
    return res.status(500).json({ message: "Failed to generate PDF" });
  }
});

/* =========================================
   DELETE /api/papers/:id
========================================= */
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Paper.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Paper not found" });
    }
    return res.status(200).json({ message: "Paper deleted successfully" });
  } catch (err) {
    console.error("❌ Delete Paper Error:", err.message);
    return res.status(500).json({ message: "Failed to delete paper" });
  }
});

module.exports = router;
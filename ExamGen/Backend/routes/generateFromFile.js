const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const Tesseract = require("tesseract.js");
const axios = require("axios");

const uploadDir = path.join("/tmp", "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({
  dest: uploadDir,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

router.post(
  "/",
  upload.fields([
    { name: "file", maxCount: 1 },
    { name: "image", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      let extractedText = "";
      const { prompt, amount = 5, difficulty = "medium" } = req.body;

      /* ================= PDF / DOCX ================= */
      if (req.files?.file) {
        const file = req.files.file[0];
        const filePath = path.resolve(file.path);
        const ext = path.extname(file.originalname).toLowerCase();

        if (ext === ".pdf") {
          const dataBuffer = fs.readFileSync(filePath);
          const data = await pdfParse(dataBuffer);
          extractedText += data.text;
        } else if (ext === ".docx") {
          const result = await mammoth.extractRawText({ path: filePath });
          extractedText += result.value;
        }

        fs.unlinkSync(filePath);
      }

      /* ================= IMAGE OCR ================= */
      if (req.files?.image) {
        const image = req.files.image[0];
        const imagePath = path.resolve(image.path);

        const result = await Tesseract.recognize(imagePath, "eng");
        extractedText += "\n" + result.data.text;

        fs.unlinkSync(imagePath);
      }

      if (!extractedText.trim()) {
        return res.status(400).json({
          message: "No readable content found in file or image.",
        });
      }

      /* ================= SMART FOCUS HANDLING ================= */
      const focusInstruction = prompt
        ? `Generate questions ONLY from this focus area: "${prompt}". 
Ignore unrelated content.`
        : `Generate well-balanced questions from the full provided content.`;

      /* ================= GEMINI CALL ================= */
      const geminiResponse = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          contents: [
            {
              parts: [
                {
                  text: `
You are a professional academic exam generator.

STRICT RULES:
- Use ONLY the provided content below.
- DO NOT use outside knowledge.
- DO NOT hallucinate.
- If answer is not in content, DO NOT create it.

${focusInstruction}

Difficulty Level: ${difficulty}

Content:
"""
${extractedText}
"""

Generate exactly ${amount} questions.

Return STRICT JSON only in this format:
{
  "questions": [
    {
      "question": "string",
      "options": ["A", "B", "C", "D"],
      "answer": "Correct Option",
      "questionType": "mcq",
      "marks": 1
    }
  ]
}
`
                }
              ]
            }
          ]
        }
      );

      const aiText =
        geminiResponse.data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!aiText) {
        return res.status(500).json({ message: "AI returned empty response" });
      }

      /* ================= CLEAN JSON EXTRACTION ================= */
      const jsonMatch = aiText.match(/\{[\s\S]*\}/);

      if (!jsonMatch) {
        return res.status(500).json({
          message: "AI returned invalid format",
        });
      }

      let parsed;
      try {
        parsed = JSON.parse(jsonMatch[0]);
      } catch (parseError) {
        return res.status(500).json({
          message: "Failed to parse AI response",
        });
      }

      res.json({
        questions: parsed.questions || [],
      });
    } catch (err) {
      console.error("GENERATE FROM FILE ERROR:", err.response?.data || err);
      res.status(500).json({
        message: "AI generation failed",
      });
    }
  }
);

module.exports = router;

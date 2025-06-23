// backend/server.js
const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.send("✅ Resume Scanner AI Backend is running...");
});

// POST /api/scan
app.post("/api/scan", async (req, res) => {
  const { resumeText } = req.body;

  if (!resumeText) {
    return res.status(400).json({ error: "No resume text provided." });
  }

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "anthropic/claude-3-haiku",
        messages: [
          {
            role: "user",
            content: `You are an expert tech recruiter. Review the following resume text and give:
1. A 3-line summary.
2. Key strengths.
3. Areas to improve.
4. Suitable job roles.
Here is the resume:
"""${resumeText}"""`,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const aiReply = response.data.choices[0].message.content;
    res.json({ result: aiReply });
  } catch (error) {
    console.error("❌ Claude API Error:", error.message);
    res.status(500).json({ error: "Claude API failed" });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Backend running at http://localhost:${PORT}`);
});

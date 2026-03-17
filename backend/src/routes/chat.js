import express from "express";
import fetch from "node-fetch";

const router = express.Router();

router.post("/", async (req, res) => {
  const { message } = req.body;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `
You are FLEE Assistant.

Help users:
- Choose bikes (Flee C2, Flee B1)
- Give price, range, speed
- Help book test rides

Keep answers short and helpful.
`,
          },
          {
            role: "user",
            content: message,
          },
        ],
      }),
    });

    const data = await response.json();

    res.json({
      reply:
        data?.choices?.[0]?.message?.content ||
        "No response from AI",
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      reply: "AI error. Try again.",
    });
  }
});

export default router;
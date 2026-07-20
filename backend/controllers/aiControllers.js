import axios from "axios";
import Item from "../models/itemModel.js";

export const getMithaiRecommendation = async (req, res) => {
  try {
    const { prompt, history = [] } = req.body;
    const openrouterApiKey = process.env.OPENROUTER_API_KEY;
    const geminiApiKey = process.env.GEMINI_API_KEY;

    if (!openrouterApiKey && !geminiApiKey) {
      return res.status(200).json({
        reply: "Hello! I am your AI Mithai Bot. To get intelligent recommendations, please configure the `OPENROUTER_API_KEY` or `GEMINI_API_KEY` in the environment variables. In the meantime, I highly recommend checking out our delicious Pedhas, Kaju Katli, and Rasgullas from local shops!",
      });
    }

    // Fetch existing database sweets to supply as context
    const items = await Item.find({}).populate("shop");
    const itemContext = items
      .map((i) => `- ${i.name} (${i.foodType}) from shop "${i.shop?.name || "Local Shop"}" at price ₹${i.price}`)
      .join("\n");

    const systemPrompt = `You are the Brijwalla AI Mithai Bot. You are an expert in Indian traditional sweets (Mithai) and Namkeens, but you are also happy to chat, answer any general queries, recipes, cooking tips, or help the user with any other questions they have.
If they ask for sweet/food recommendations, try to suggest matching sweets from the list of available sweets on our platform below.
Keep your responses friendly, helpful, and concise.

Available sweets on our platform:
${itemContext}`;

    let reply = "";

    if (openrouterApiKey) {
      const openRouterHistory = history.map(h => ({
        role: h.role === "model" ? "assistant" : "user",
        content: h.text
      }));

      const response = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model: "google/gemini-2.5-flash",
          messages: [
            {
              role: "system",
              content: systemPrompt,
            },
            ...openRouterHistory,
            {
              role: "user",
              content: prompt,
            },
          ],
          max_tokens: 800,
        },
        {
          headers: {
            Authorization: `Bearer ${openrouterApiKey}`,
            "Content-Type": "application/json",
          },
        }
      );
      reply = response.data?.choices?.[0]?.message?.content || "";
    } else {
      let geminiHistory = history.map(h => ({
        role: h.role, // 'user' or 'model'
        parts: [{ text: h.text }]
      }));

      // Gemini requires the history to start with a 'user' role.
      // The frontend starts with a bot greeting, so we must remove any leading 'model' messages.
      while (geminiHistory.length > 0 && geminiHistory[0].role === 'model') {
        geminiHistory.shift();
      }

      const requestBody = {
        systemInstruction: {
          parts: [{ text: systemPrompt }]
        },
        contents: [
          ...geminiHistory,
          {
            role: "user",
            parts: [{ text: prompt }]
          }
        ]
      };

      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
        requestBody
      );

      reply = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    }

    if (!reply) {
      reply = "I'm sorry, I'm having trouble thinking right now. Feel free to browse our wide selection of sweets!";
    }

    return res.status(200).json({ reply });
  } catch (error) {
    console.error("AI Assistant Error:", error.response?.data || error.message);
    return res.status(500).json({ message: "Error communicating with AI assistant." });
  }
};

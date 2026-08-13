import axios from "axios";
import Item from "../models/itemModel.js";

export const getMithaiRecommendation = async (req, res) => {
  try {
    const { prompt, history = [] } = req.body;
    const geminiApiKey = process.env.GEMINI_API_KEY;

    if (!geminiApiKey) {
      return res.status(200).json({
        reply: "Hello! I am your AI Mithai Bot. To get intelligent recommendations, please configure the `GEMINI_API_KEY` in the environment variables. In the meantime, I highly recommend checking out our delicious Pedhas, Kaju Katli, and Rasgullas from local shops!",
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

    let geminiHistory = history.map(h => ({
      role: h.role === "model" ? "model" : "user",
      parts: [{ text: h.text }]
    }));

    // Ensure strictly alternating roles starting with 'user'
    let validGeminiHistory = [];
    for (let i = 0; i < geminiHistory.length; i++) {
      const currentMsg = geminiHistory[i];
      if (validGeminiHistory.length === 0) {
        if (currentMsg.role === 'user') validGeminiHistory.push(currentMsg);
      } else {
        const lastMsg = validGeminiHistory[validGeminiHistory.length - 1];
        if (lastMsg.role === currentMsg.role) {
          lastMsg.parts[0].text += "\n" + currentMsg.parts[0].text;
        } else {
          validGeminiHistory.push(currentMsg);
        }
      }
    }

    // Append the current prompt
    if (validGeminiHistory.length > 0 && validGeminiHistory[validGeminiHistory.length - 1].role === "user") {
      validGeminiHistory[validGeminiHistory.length - 1].parts[0].text += "\n" + prompt;
    } else {
      validGeminiHistory.push({
        role: "user",
        parts: [{ text: prompt }]
      });
    }

    const requestBody = {
      systemInstruction: {
        parts: [{ text: systemPrompt }]
      },
      contents: validGeminiHistory
    };

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${geminiApiKey}`,
      requestBody
    );

    reply = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    if (!reply) {
      reply = "I'm sorry, I'm having trouble thinking right now. Feel free to browse our wide selection of sweets!";
    }

    return res.status(200).json({ reply });
  } catch (error) {
    console.error("AI Assistant Error:", error.response?.data || error.message);
    const apiError = error.response?.data?.error?.message;
    console.error("Gemini API Error Detail:", apiError);
    if (apiError && apiError.includes("API key not valid")) {
      return res.status(200).json({ reply: "It seems your GEMINI_API_KEY is invalid. Please double-check it in your .env file." });
    }

    return res.status(500).json({ message: "Error communicating with AI assistant." });
  }
};

const prisma = require("../config/db");

// ── POST /api/ai/chat ─────────────────────────────────────
exports.chat = async (req, res, next) => {
  try {
    const { message, conversationId } = req.body;
    const user = req.user;

    // Load user full profile for context
    const profile = await prisma.user.findUnique({
      where: { id: user.id },
      select: { name:true, country:true, countryName:true, height:true, weight:true, age:true, goal:true, unit:true },
    });

    // Build system prompt with user context
    const systemPrompt = `You are FitoGlobe AI Coach — a professional, motivating, and knowledgeable personal fitness and nutrition coach built into the FitoGlobe app.

User Profile:
- Name: ${profile.name}
- Country: ${profile.countryName || "Unknown"}
- Age: ${profile.age || "Unknown"}
- Height: ${profile.height ? profile.height + "cm" : "Unknown"}
- Weight: ${profile.weight ? profile.weight + "kg" : "Unknown"}
- Goal: ${profile.goal || "general fitness"} (gain muscle / maintain / lose weight)
- Units: ${profile.unit || "metric"}

Guidelines:
- Be concise, motivating and practical
- Personalize advice based on the user's profile above
- For diet advice, consider their country's cuisine (${profile.countryName || "international"})
- Keep responses under 200 words unless asked for a full plan
- No markdown headers, use short paragraphs
- Always end with an encouraging one-liner`;

    // Get or create conversation
    let conversation = conversationId
      ? await prisma.aIConversation.findFirst({ where: { id: conversationId, userId: user.id } })
      : null;

    const history = conversation?.messages || [];

    // Call Claude API
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type":      "application/json",
        "x-api-key":         process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model:      "claude-sonnet-4-20250514",
        max_tokens: 500,
        system:     systemPrompt,
        messages:   [...history, { role:"user", content:message }],
      }),
    });

    const data    = await response.json();
    const aiReply = data.content?.[0]?.text || "I'm here to help! Tell me more about your fitness goals.";

    // Save conversation
    const updatedMessages = [
      ...history,
      { role:"user",      content:message,  timestamp: new Date() },
      { role:"assistant", content:aiReply,   timestamp: new Date() },
    ];

    const saved = conversation
      ? await prisma.aIConversation.update({
          where: { id: conversation.id },
          data:  { messages: updatedMessages },
        })
      : await prisma.aIConversation.create({
          data: { userId: user.id, messages: updatedMessages },
        });

    res.json({ success:true, reply: aiReply, conversationId: saved.id });
  } catch (err) { next(err); }
};

// ── GET /api/ai/conversations ─────────────────────────────
exports.getConversations = async (req, res, next) => {
  try {
    const conversations = await prisma.aIConversation.findMany({
      where:   { userId: req.user.id },
      orderBy: { updatedAt: "desc" },
      take:    10,
      select:  { id:true, messages:true, createdAt:true, updatedAt:true },
    });
    res.json({ success:true, conversations });
  } catch (err) { next(err); }
};

// ── POST /api/ai/macros ───────────────────────────────────
// ── POST /api/ai/macros ───────────────────────────────────
exports.getMacros = async (req, res, next) => {
  try {
    const { food, quantity } = req.body;
    if (!food) return res.status(400).json({ success:false, message:"Food is required" });

    const prompt = `You are a nutrition database. The user typed a food item (may have typos or be in any language). Identify the food, correct any spelling, and return accurate nutritional data.

Food input: "${food}"
Quantity: "${quantity || "standard serving"}"

Return ONLY this JSON, no other text:
{
  "calories": 250,
  "protein": 8,
  "carbs": 35,
  "fat": 6,
  "serving": "1 bowl (approx 200g)",
  "foodName": "Corrected Food Name"
}

Rules:
- All numbers must be integers
- Be accurate for the identified food
- If quantity given, calculate for that quantity
- If typo, identify the correct food silently`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type":  "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages:   [{ role:"user", content: prompt }],
        max_tokens: 200,
      }),
    });

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content?.replace(/```json|```/g, "").trim();

    if (!text) {
      console.error("GROQ error:", JSON.stringify(data));
      return res.status(500).json({ success:false, message:"AI unavailable" });
    }

    const macros = JSON.parse(text);
    res.json({ success:true, ...macros });
  } catch (err) { next(err); }
};



//Fito Chat & Scan Food
exports.scanFood = async (req, res, next) => {
  try {
    const { imageBase64, mimeType = "image/jpeg" } = req.body;
    if (!imageBase64) return res.status(400).json({ success:false, message:"Image required" });

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type":  "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "meta-llama/llama-4-scout-17b-16e-instruct",
        messages: [{
          role: "user",
          content: [
            { type:"image_url", image_url:{ url:`data:${mimeType};base64,${imageBase64}` } },
            { type:"text", text:`Analyze this food image and return ONLY this JSON, no other text:
{
  "foodName": "Food name",
  "isHealthy": true,
  "healthScore": 75,
  "healthLabel": "Healthy",
  "calories": 350,
  "protein": 12,
  "carbs": 45,
  "fat": 8,
  "fiber": 4,
  "serving": "1 plate (approx 300g)",
  "healthTips": ["Tip 1", "Tip 2", "Tip 3"],
  "goodFor": ["Weight loss", "Muscle gain"]
}
Rules: all numbers integers, be accurate, healthScore 0-100.` }
          ]
        }],
        max_tokens: 500,
      }),
    });

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content?.replace(/```json|```/g, "").trim();
    if (!text) { console.error("GROQ Vision error:", JSON.stringify(data)); return res.status(500).json({ success:false, message:"Scan failed" }); }
    const result = JSON.parse(text);
    res.json({ success:true, ...result });
  } catch (err) { next(err); }
};

exports.fitoChat = async (req, res, next) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ success:false, message:"Message required" });

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type":  "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role:"system", content:`You are Fito, a friendly AI fitness and nutrition chatbot. Keep responses short, practical and motivating. No markdown headers. Max 150 words.` },
          { role:"user", content: message }
        ],
        max_tokens: 300,
      }),
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "I'm here to help with your fitness journey!";
    res.json({ success:true, reply });
  } catch (err) { next(err); }
};
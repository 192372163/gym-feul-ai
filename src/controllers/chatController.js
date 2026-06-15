const { chatReply } = require('../services/groqService');

async function chat(req, res) {
  const { message, history } = req.body;
  if (!message || !message.trim()) {
    return res.status(400).json({ error: 'message is required' });
  }

  try {
    const reply = await chatReply(message, Array.isArray(history) ? history : []);
    res.json({ reply });
  } catch (err) {
    console.error('Chat error:', err.response?.data || err.message);
    res.status(502).json({ error: 'Failed to get AI response' });
  }
}

module.exports = { chat };

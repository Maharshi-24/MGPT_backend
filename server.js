import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import Groq from 'groq-sdk';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Initialize Groq SDK
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Initialize Express app
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: '*' }));
app.use(bodyParser.json());

// In-memory storage for conversation history
const conversationHistory = new Map();

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  const userId = req.body.userId || 'defaultUser'; // Use a unique identifier for each user
  const userMessage = req.body.message;

  // Initialize conversation history if it doesn't exist
  if (!conversationHistory.has(userId)) {
    conversationHistory.set(userId, []);
  }

  const history = conversationHistory.get(userId);

  // Add the user's message to the history
  history.push({ role: 'user', content: userMessage });

  try {
    // Call Groq API with the entire conversation history
    const chatCompletion = await groq.chat.completions.create({
      messages: history,
      model: 'llama-3.3-70b-versatile', // Use the correct model name
    });

    // Extract the bot's response
    const botResponse = chatCompletion.choices[0]?.message?.content || '';

    // Add the bot's response to the history
    history.push({ role: 'assistant', content: botResponse });

    res.json({ response: botResponse });
  } catch (error) {
    console.error('Error calling Groq API:', error);
    res.status(500).json({ error: 'Failed to get response from Groq API' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Maharshi Chat Backend running on http://localhost:${port}`);
});
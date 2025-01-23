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

// Chat endpoint with streaming
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
    // Set headers for streaming
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Call Groq API with streaming enabled
    const stream = await groq.chat.completions.create({
      messages: history,
      model: 'llama-3.3-70b-versatile', // Use the correct model name
      stream: true, // Enable streaming
    });

    let botResponse = '';

    // Stream the response to the client
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      botResponse += content;

      // Send each chunk to the client
      res.write(`data: ${JSON.stringify({ response: content })}\n\n`);
    }

    // Add the bot's full response to the history
    history.push({ role: 'assistant', content: botResponse });

    // End the stream
    res.end();
  } catch (error) {
    console.error('Error calling Groq API:', error);
    res.status(500).json({ error: 'Failed to get response from Groq API' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Maharshi Chat Backend running on http://localhost:${port}`);
});
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import Groq from 'groq-sdk';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const app = express();
const port = process.env.PORT || 5000;

app.use(cors({ origin: '*' }));
app.use(bodyParser.json());

// In-memory storage for conversation history and abort controllers
const conversationHistory = new Map();
const abortControllers = new Map(); // Store AbortController for each user

// System prompt for setting the context of the bot
const systemPrompt = {
  role: 'system',
  content: 'You are MGPT, a helpful and friendly assistant created by Maharshi Desai. Your task is to assist the user in a variety of conversations and provide accurate, thoughtful responses.',
};

// Chat endpoint with streaming
app.post('/api/chat', async (req, res) => {
  const userId = req.body.userId || 'defaultUser';
  const userMessage = req.body.message;

  if (!conversationHistory.has(userId)) {
    conversationHistory.set(userId, []);
  }

  const history = conversationHistory.get(userId);
  // Add system prompt at the beginning of each conversation
  history.unshift(systemPrompt); // Add system context to the history
  history.push({ role: 'user', content: userMessage });

  const abortController = new AbortController();
  abortControllers.set(userId, abortController);

  try {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const stream = await groq.chat.completions.create(
      {
        messages: history,
        model: 'llama3-8b-8192',
        stream: true,
      },
      { signal: abortController.signal }
    );

    for await (const chunk of stream) {
      if (abortController.signal.aborted) {
        console.log('Streaming stopped by user');
        break;
      }

      const content = chunk.choices[0]?.delta?.content || '';
      res.write(`data: ${JSON.stringify({ response: content })}\n\n`);
      await new Promise((resolve) => setTimeout(resolve, 20)); // Simulate typing delay
    }

    res.end();
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log('Stream aborted');
      res.status(499).end(); // Custom abort status
    } else {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } finally {
    abortControllers.delete(userId);
  }
});

// Endpoint to stop the response generation
app.post('/api/stop', (req, res) => {
  const userId = req.body.userId || 'defaultUser';

  if (abortControllers.has(userId)) {
    abortControllers.get(userId).abort(); // Abort the request
    abortControllers.delete(userId); // Clean up
    res.status(200).json({ message: 'Streaming stopped successfully' });
  } else {
    res.status(404).json({ error: 'No active streaming to stop' });
  }
});

// Start the server
app.listen(port, () => {
  console.log('Maharshi Chat Backend running on http://localhost:' + port);
  console.log('Bot name: MGPT');
  console.log('Created by: Maharshi Desai');
});

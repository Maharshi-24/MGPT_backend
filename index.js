const express = require('express');
const { Groq } = require('groq-sdk');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
app.use(express.json());

const groq = new Groq(process.env.GROQ_API_KEY);

// Test route
app.get('/', (req, res) => {
  res.send('MaharshiChat Backend is running!');
});

// Chat route
app.post('/api/chat', async (req, res) => {
  const { message } = req.body;

  try {
    const response = await groq.complete({
      prompt: message,
      max_tokens: 150,
    });

    res.json({ response: response.choices[0].text });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});

---

# MGPT Backend - Powered by Groq and Express

**MGPT Backend** is the server-side component of the MGPT AI Chatbot, built using **Express.js**. This backend facilitates communication between the user and the AI model via the **Groq API**, handling user messages, conversation history, and dynamic model completions. It supports real-time chat with streaming responses, allowing for an engaging and interactive AI conversation experience.

## 🛠️ **Tech Stack**

- **Backend**: [Express.js](https://expressjs.com/) for creating the API endpoints.
- **AI Integration**: [Groq SDK](https://groq.com/) for interacting with state-of-the-art language models.
- **Environment Management**: [dotenv](https://www.npmjs.com/package/dotenv) for managing environment variables like API keys.
- **Real-time Communication**: Streaming responses with **Server-Sent Events (SSE)**.
- **Authentication & Storage**: **Firebase** for secure user authentication (in case of future updates).

## 🎬 **Server Activation**
![Server Activation](https://drive.google.com/uc?export=view&id=1O-BN7yEZAZ7nA8hURXaTndlVfDsKb0yO)

## 🎨 **Features**

- **Real-Time Chat**: Supports real-time AI responses with dynamic streaming.
- **Conversation History**: Stores user conversation history for context during interactions.
- **Abortible Streams**: Allows users to stop AI responses in progress with an abort controller.
- **Custom AI Persona**: Configured system prompt that defines MGPT's personality and knowledge domain.
- **Scalable Architecture**: Built to scale with **Render** cloud deployment.
- **Error Handling**: Graceful error management for failed interactions and system issues.

## 🚀 **Installation**

### Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (LTS version recommended)
- [Groq API Key](https://groq.com/) (Set up your API key in `.env`)

### Setup Steps

1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/mgpt-backend.git
   cd mgpt-backend
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Set up your **Groq API Key** in the `.env` file:
   ```env
   GROQ_API_KEY=your-groq-api-key
   ```

4. Run the server:
   ```bash
   npm start
   ```

   This will start the backend on **http://localhost:5000**.

---

## 🔧 **Dependencies**

- **Express**: Lightweight framework for creating API routes and handling HTTP requests.
- **Groq SDK**: Interact with Groq's language models.
- **Body-parser**: For parsing JSON requests.
- **Cors**: Enabling Cross-Origin Resource Sharing (CORS) for the API.
- **Dotenv**: For loading environment variables from a `.env` file.
  
These dependencies are listed in `package.json`.

---

## 📜 **Future Features**

- Integrate with **multiple AI models** to dynamically select the best model for each task.
- Expand the knowledge base to include more specific domains and provide expert-level assistance.
- Add **analytics** for tracking user interactions and improving responses.
- Support **multi-user** chat features, allowing simultaneous conversations with multiple users.
- Implement **real-time collaboration** where multiple users can interact with the same chatbot instance.
- Introduce **personalization** where the bot learns user preferences over time for a more tailored experience.
- **Voice integration** for a voice-based chatbot experience.

---

## 💬 **Contact**

For more information or any queries, feel free to reach out:

- **Email**: [maharshi2406@gmail.com](mailto:maharshi2406@gmail.com)
- **LinkedIn**: [Maharshi Desai](https://www.linkedin.com/in/maharshi-desai-30143a279/)

---

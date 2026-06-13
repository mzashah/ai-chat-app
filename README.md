# AI Chat App

A beautiful, production-ready AI chat application built with Next.js 14 and OpenAI API. Features streaming responses, conversation history, and support for multiple AI models.

![AI Chat App](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4-412991?style=for-the-badge&logo=openai)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)

## Features

- 🤖 GPT-4, GPT-3.5-turbo support
- ⚡ Real-time streaming responses
- 💾 Conversation history (localStorage)
- 🎨 Beautiful dark/light UI
- 📱 Fully responsive
- 🔄 Regenerate responses
- 📋 Copy to clipboard
- 🗑️ Delete conversations
- 🌐 Markdown rendering with syntax highlighting

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **AI**: OpenAI API (GPT-4, GPT-3.5)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Markdown**: react-markdown + highlight.js
- **Icons**: Lucide React

## Quick Start

```bash
git clone https://github.com/mzashah/ai-chat-app
cd ai-chat-app
npm install
cp .env.example .env.local
# Add your OpenAI API key to .env.local
npm run dev
```

## Environment Variables

```env
OPENAI_API_KEY=sk-your-openai-api-key
NEXT_PUBLIC_APP_NAME=AI Chat
```

## Project Structure

```
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts      # Streaming API endpoint
│   ├── page.tsx              # Main chat interface
│   └── layout.tsx
├── components/
│   ├── chat/
│   │   ├── ChatWindow.tsx    # Main chat window
│   │   ├── MessageList.tsx   # Message display
│   │   ├── MessageInput.tsx  # User input
│   │   └── ModelSelector.tsx # AI model picker
│   └── ui/
├── lib/
│   └── openai.ts
└── types/
    └── chat.ts
```

## Screenshots

The app features a clean, modern interface similar to ChatGPT with:
- Sidebar for conversation management
- Streaming message display
- Code syntax highlighting
- Model selection dropdown

## License

MIT © [Zohaib Ali Shah](https://github.com/mzashah)

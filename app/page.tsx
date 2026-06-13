'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Trash2, Plus, Copy, RefreshCw } from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface Conversation {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
}

export default function ChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeConvId, setActiveConvId] = useState<string | null>(null)
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [model, setModel] = useState('gpt-3.5-turbo')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const activeConv = conversations.find(c => c.id === activeConvId)
  const messages = activeConv?.messages || []

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  useEffect(scrollToBottom, [messages])

  const createNewConversation = () => {
    const id = crypto.randomUUID()
    const conv: Conversation = { id, title: 'New Chat', messages: [], createdAt: new Date() }
    setConversations(prev => [conv, ...prev])
    setActiveConvId(id)
  }

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return
    if (!activeConvId) createNewConversation()

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    }

    setConversations(prev => prev.map(c =>
      c.id === activeConvId
        ? { ...c, messages: [...c.messages, userMessage], title: c.messages.length === 0 ? input.slice(0, 40) : c.title }
        : c
    ))
    setInput('')
    setIsLoading(true)

    const assistantMessage: Message = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: '',
      timestamp: new Date(),
    }

    setConversations(prev => prev.map(c =>
      c.id === activeConvId ? { ...c, messages: [...c.messages, assistantMessage] } : c
    ))

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({ role: m.role, content: m.content })),
          model,
        }),
      })

      const reader = res.body!.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value)
        const lines = chunk.split('\n').filter(l => l.startsWith('data: '))
        for (const line of lines) {
          const data = line.slice(6)
          if (data === '[DONE]') break
          const { text } = JSON.parse(data)
          setConversations(prev => prev.map(c =>
            c.id === activeConvId
              ? { ...c, messages: c.messages.map(m => m.id === assistantMessage.id ? { ...m, content: m.content + text } : m) }
              : c
          ))
        }
      }
    } catch (error) {
      console.error('Chat error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 flex flex-col border-r border-gray-700">
        <div className="p-4">
          <button onClick={createNewConversation} className="w-full flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg px-4 py-2 transition">
            <Plus size={16} /> New Chat
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {conversations.map(conv => (
            <button key={conv.id} onClick={() => setActiveConvId(conv.id)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm mb-1 transition ${activeConvId === conv.id ? 'bg-gray-600' : 'hover:bg-gray-700'}`}>
              <div className="truncate">{conv.title}</div>
            </button>
          ))}
        </div>
        <div className="p-4 border-t border-gray-700">
          <select value={model} onChange={e => setModel(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm">
            <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
            <option value="gpt-4">GPT-4</option>
            <option value="gpt-4-turbo">GPT-4 Turbo</option>
          </select>
        </div>
      </div>

      {/* Main Chat */}
      <div className="flex-1 flex flex-col">
        <div className="border-b border-gray-700 p-4 flex items-center gap-2">
          <Bot size={20} className="text-purple-400" />
          <h1 className="font-semibold">AI Chat</h1>
          <span className="ml-auto text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">{model}</span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <Bot size={48} className="mb-4 text-gray-600" />
              <p className="text-xl font-medium">How can I help you today?</p>
              <p className="text-sm mt-2">Start a conversation with AI</p>
            </div>
          )}
          {messages.map(msg => (
            <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'assistant' && <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0"><Bot size={16} /></div>}
              <div className={`max-w-2xl rounded-2xl px-4 py-3 ${msg.role === 'user' ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-100'}`}>
                <p className="whitespace-pre-wrap">{msg.content}</p>
              </div>
              {msg.role === 'user' && <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center flex-shrink-0"><User size={16} /></div>}
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center"><Bot size={16} /></div>
              <div className="bg-gray-800 rounded-2xl px-4 py-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="border-t border-gray-700 p-4">
          <div className="flex gap-2 bg-gray-800 rounded-xl border border-gray-700 p-2">
            <textarea value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }}}
              placeholder="Message AI..." rows={1}
              className="flex-1 bg-transparent resize-none outline-none text-white placeholder-gray-500 px-2 py-1" />
            <button onClick={sendMessage} disabled={!input.trim() || isLoading}
              className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg p-2 transition">
              <Send size={18} />
            </button>
          </div>
          <p className="text-center text-xs text-gray-600 mt-2">AI can make mistakes. Verify important information.</p>
        </div>
      </div>
    </div>
  )
}

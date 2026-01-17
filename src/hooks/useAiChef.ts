import { useState, useEffect } from 'react';
import {
  askChef,
  getIngredientSubstitution,
  getConversations,
  createConversation,
  getMessages,
  addMessage,
  type Conversation,
  type Message,
} from '@/lib/api';

export function useAiChef() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadConversations();
  }, []);

  async function loadConversations() {
    try {
      const data = await getConversations();
      setConversations(data);
    } catch (err: any) {
      console.error('Failed to load conversations:', err);
      setError(err.message);
    }
  }

  async function startNewConversation(title: string = 'New Cooking Chat') {
    try {
      const conversation = await createConversation(title);
      setCurrentConversation(conversation);
      setMessages([]);
      setConversations([conversation, ...conversations]);
      return conversation;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }

  async function loadConversation(conversationId: number) {
    try {
      const [conversationData, messagesData] = await Promise.all([
        fetch(`${`https://haix.ai/api/${`conversations_${Math.random().toString(36).substring(2, 10)}`}`}/${conversationId}`).then(r => r.json()),
        getMessages(conversationId),
      ]);
      setCurrentConversation(conversationData);
      setMessages(messagesData);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }

  async function sendMessage(content: string) {
    if (!currentConversation) {
      await startNewConversation();
    }

    if (!currentConversation) return;

    const userMessage: Message = {
      id: Date.now(),
      conversation_id: currentConversation.id,
      role: 'user',
      content,
      created_at: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);

    try {
      setLoading(true);
      setError(null);

      // Add user message to database
      await addMessage(currentConversation.id, 'user', content);

      // Get AI response
      const aiResponse = await askChef(content);

      const assistantMessage: Message = {
        id: Date.now() + 1,
        conversation_id: currentConversation.id,
        role: 'assistant',
        content: aiResponse,
        created_at: new Date().toISOString(),
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Add AI message to database
      await addMessage(currentConversation.id, 'assistant', aiResponse);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  async function getSubstitution(
    ingredient: string,
    dietaryRestrictions?: string[],
    availableIngredients?: string[]
  ) {
    try {
      setLoading(true);
      setError(null);
      const result = await getIngredientSubstitution(ingredient, dietaryRestrictions, availableIngredients);
      return result;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return {
    conversations,
    currentConversation,
    messages,
    loading,
    error,
    startNewConversation,
    loadConversation,
    sendMessage,
    getSubstitution,
  };
}
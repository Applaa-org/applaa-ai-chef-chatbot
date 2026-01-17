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
      const messagesData = await getMessages(conversationId);
      // Create a mock conversation object since we don't have the full conversation data
      const conversation: Conversation = {
        id: conversationId,
        title: `Conversation ${conversationId}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setCurrentConversation(conversation);
      setMessages(messagesData);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }

  async function sendMessage(content: string) {
    if (!currentConversation) {
      const newConversation = await startNewConversation();
      if (!newConversation) return;
      
      // Set the current conversation after creating it
      setCurrentConversation(newConversation);
    }

    // Use the current conversation (either existing or newly created)
    const conversation = currentConversation;
    if (!conversation) return;

    const userMessage: Message = {
      id: Date.now(),
      conversation_id: conversation.id,
      role: 'user',
      content,
      created_at: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);

    try {
      setLoading(true);
      setError(null);

      // Add user message to database
      await addMessage(conversation.id, 'user', content);

      // Get AI response
      const aiResponse = await askChef(content);

      const assistantMessage: Message = {
        id: Date.now() + 1,
        conversation_id: conversation.id,
        role: 'assistant',
        content: aiResponse,
        created_at: new Date().toISOString(),
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Add AI message to database
      await addMessage(conversation.id, 'assistant', aiResponse);
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
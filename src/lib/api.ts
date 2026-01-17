const API_URL = 'https://haix.ai/api';

// Generate unique table name for conversation history
const randomString = Math.random().toString(36).substring(2, 10);
const CONVERSATIONS_TABLE = `conversations_${randomString}`;
const MESSAGES_TABLE = `messages_${randomString}`;

export interface Conversation {
  id: number;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: number;
  conversation_id: number;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

// AI Chef API calls
export async function askChef(question: string): Promise<string> {
  const response = await fetch(`${API_URL}/ai/chef/ask`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question }),
  });
  if (!response.ok) throw new Error('Failed to get AI chef response');
  const data = await response.json();
  return data.answer;
}

export async function getIngredientSubstitution(
  ingredient: string,
  dietaryRestrictions?: string[],
  availableIngredients?: string[]
): Promise<{
  substitution: string;
  ratio: string;
  notes: string;
}> {
  const response = await fetch(`${API_URL}/ai/chef/substitute`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ingredient,
      dietary_restrictions: dietaryRestrictions,
      available_ingredients: availableIngredients,
    }),
  });
  if (!response.ok) throw new Error('Failed to get substitution');
  return response.json();
}

// Conversation management
export async function getConversations(): Promise<Conversation[]> {
  const response = await fetch(`${API_URL}/${CONVERSATIONS_TABLE}`);
  if (!response.ok) throw new Error('Failed to fetch conversations');
  return response.json();
}

export async function createConversation(title: string): Promise<Conversation> {
  const response = await fetch(`${API_URL}/${CONVERSATIONS_TABLE}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title }),
  });
  if (!response.ok) throw new Error('Failed to create conversation');
  return response.json();
}

export async function getMessages(conversationId: number): Promise<Message[]> {
  const response = await fetch(`${API_URL}/${MESSAGES_TABLE}?conversation_id=${conversationId}`);
  if (!response.ok) throw new Error('Failed to fetch messages');
  return response.json();
}

export async function addMessage(
  conversationId: number,
  role: 'user' | 'assistant',
  content: string
): Promise<Message> {
  const response = await fetch(`${API_URL}/${MESSAGES_TABLE}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ conversation_id: conversationId, role, content }),
  });
  if (!response.ok) throw new Error('Failed to add message');
  return response.json();
}
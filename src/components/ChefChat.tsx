import { useState, useRef, useEffect } from 'react';
import { Send, ChefHat, User, Bot, Plus, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAiChef } from '@/hooks/useAiChef';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

export function ChefChat() {
  const [input, setInput] = useState('');
  const { messages, loading, sendMessage, currentConversation, startNewConversation } = useAiChef();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    try {
      await sendMessage(input);
      setInput('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleNewConversation = async () => {
    try {
      await startNewConversation();
    } catch (error) {
      console.error('Failed to start new conversation:', error);
    }
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-2">
          <ChefHat className="w-6 h-6 text-orange-500" />
          <h2 className="text-lg font-semibold">AI Chef Assistant</h2>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleNewConversation}
          className="flex items-center space-x-1"
        >
          <Plus className="w-4 h-4" />
          <span>New Chat</span>
        </Button>
      </div>

      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <ChefHat className="w-12 h-12 mb-4" />
            <p className="text-center">Ask me anything about cooking!</p>
            <p className="text-sm text-center mt-2">I can help with recipes, techniques, and ingredient substitutions.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  'flex space-x-3',
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                <div
                  className={cn(
                    'flex max-w-[80%] space-x-2',
                    message.role === 'user' ? 'flex-row-reverse space-x-reverse' : 'flex-row'
                  )}
                >
                  <div
                    className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center',
                      message.role === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-orange-500 text-white'
                    )}
                  >
                    {message.role === 'user' ? (
                      <User className="w-4 h-4" />
                    ) : (
                      <Bot className="w-4 h-4" />
                    )}
                  </div>
                  <div
                    className={cn(
                      'rounded-lg px-4 py-2',
                      message.role === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-900'
                    )}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <div className="flex items-center mt-1 text-xs opacity-70">
                      <Clock className="w-3 h-3 mr-1" />
                      {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex space-x-3 justify-start">
                <div className="flex space-x-2">
                  <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="rounded-lg px-4 py-2 bg-gray-100 text-gray-900">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </ScrollArea>

      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex space-x-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me about cooking, recipes, or ingredient substitutions..."
            disabled={loading}
            className="flex-1"
          />
          <Button type="submit" disabled={loading || !input.trim()}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </form>
    </Card>
  );
}
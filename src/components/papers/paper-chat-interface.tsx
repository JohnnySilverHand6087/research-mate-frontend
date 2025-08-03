import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useChatWithPaper } from '@/hooks/usePapers';
import { Paper, ChatMessage } from '@/types/papers';

interface PaperChatInterfaceProps {
  paper: Paper;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PaperChatInterface: React.FC<PaperChatInterfaceProps> = ({
  paper,
  open,
  onOpenChange,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const chatWithPaper = useChatWithPaper();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (open) {
      // Initialize with a welcome message
      setMessages([
        {
          id: '1',
          role: 'assistant',
          content: `Hello! I'm here to help you understand and discuss "${paper.title}". What would you like to know about this paper?`,
          timestamp: new Date().toISOString(),
        },
      ]);
    }
  }, [open, paper.title]);

  const handleSendMessage = async () => {
    if (!currentMessage.trim() || chatWithPaper.isPending) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: currentMessage,
      timestamp: new Date().toISOString(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setCurrentMessage('');

    try {
      const response = await chatWithPaper.mutateAsync({
        paperId: paper.id,
        message: currentMessage,
        conversationHistory: newMessages,
      });

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date().toISOString(),
      };

      setMessages([...newMessages, assistantMessage]);
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="line-clamp-2">{paper.title}</DialogTitle>
          <DialogDescription>
            Chat with AI about this research paper
          </DialogDescription>
          <div className="flex flex-wrap gap-2 mt-2">
            {paper.tags.slice(0, 5).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </DialogHeader>

        <div className="flex-1 flex flex-col min-h-0">
          {/* Paper Info */}
          <div className="bg-muted/50 p-4 rounded-lg mb-4">
            <div className="text-sm text-muted-foreground mb-2">
              <strong>Authors:</strong> {paper.authors.join(', ')}
            </div>
            {paper.journal && (
              <div className="text-sm text-muted-foreground mb-2">
                <strong>Journal:</strong> {paper.journal} ({new Date(paper.publication_date).getFullYear()})
              </div>
            )}
            <div className="text-sm text-muted-foreground">
              <strong>Abstract:</strong> {paper.abstract.length > 200 
                ? `${paper.abstract.slice(0, 200)}...` 
                : paper.abstract}
            </div>
          </div>

          {/* Chat Messages */}
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.role === 'assistant' && (
                    <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <Bot className="h-4 w-4 text-primary-foreground" />
                    </div>
                  )}
                  
                  <div
                    className={`max-w-[70%] p-3 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </p>
                  </div>

                  {message.role === 'user' && (
                    <div className="flex-shrink-0 w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-secondary-foreground" />
                    </div>
                  )}
                </div>
              ))}
              
              {chatWithPaper.isPending && (
                <div className="flex gap-3 justify-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <Bot className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <div className="bg-muted p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Message Input */}
          <div className="flex gap-2 mt-4">
            <Input
              placeholder="Ask about this paper..."
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={chatWithPaper.isPending}
            />
            <Button 
              onClick={handleSendMessage}
              disabled={!currentMessage.trim() || chatWithPaper.isPending}
              size="sm"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
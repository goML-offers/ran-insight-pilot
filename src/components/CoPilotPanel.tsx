import { useState } from "react";
import { Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { sendChatMessage, type ChatMessage } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import ReactMarkdown from "react-markdown";

interface Message extends ChatMessage {
  id: string;
  type?: "text" | "recommendation";
}

export const CoPilotPanel = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! I'm your RAN Co-pilot. I can help you diagnose network issues, analyze KPIs, and optimize cell parameters. How can I assist you today?",
      timestamp: new Date().toISOString(),
      type: "text",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date().toISOString(),
      type: "text",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      // Send message to backend API
      const response = await sendChatMessage(input);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response.content,
        timestamp: response.timestamp || new Date().toISOString(),
        type: response.recommendation ? "recommendation" : "text",
        recommendation: response.recommendation,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('Failed to send chat message:', error);
      toast({
        title: "Error",
        description: "Failed to get response from AI assistant",
        variant: "destructive",
      });
      
      // Fallback response
      const fallbackMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I'm having trouble connecting to the backend right now. Please try again later.",
        timestamp: new Date().toISOString(),
        type: "text",
      };
      setMessages((prev) => [...prev, fallbackMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full flex-col bg-card border-l border-border">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-border px-6 py-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary-glow">
          <Sparkles className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">RAN Co-pilot</h2>
          <p className="text-xs text-muted-foreground">AI Network Assistant</p>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 px-6">
        <div className="space-y-4 py-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`animate-fade-in ${
                message.role === "user" ? "flex justify-end" : "flex justify-start"
              }`}
            >
              {message.type === "recommendation" && message.recommendation ? (
                <Card className="max-w-md border-primary/20 bg-card p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary animate-pulse-glow" />
                    <h3 className="font-semibold text-primary">{message.recommendation.title}</h3>
                  </div>
                  <p className="mb-3 text-sm text-muted-foreground">
                    {message.recommendation.description}
                  </p>
                  <div className="mb-4 rounded-lg bg-muted/50 p-3">
                    <p className="text-xs font-medium text-foreground">Predicted Impact:</p>
                    <p className="text-sm text-secondary">{message.recommendation.impact}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1">
                      Approve Change
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      Export Script
                    </Button>
                  </div>
                </Card>
              ) : (
                <div
                  className={`max-w-md rounded-lg px-4 py-3 ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground"
                  }`}
                >
                  <div className={`text-sm prose prose-sm max-w-none prose-headings:mt-2 prose-headings:mb-2 prose-p:my-2 prose-ul:my-2 prose-li:my-0 ${
                    message.role === "user" 
                      ? "prose-headings:text-primary-foreground prose-strong:text-primary-foreground prose-p:text-primary-foreground prose-li:text-primary-foreground" 
                      : "prose-headings:text-foreground prose-strong:text-foreground prose-p:text-foreground prose-li:text-foreground"
                  }`}>
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                  </div>
                  <p className="mt-1 text-xs opacity-70">
                    {new Date(message.timestamp || Date.now()).toLocaleTimeString()}
                  </p>
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div className="flex justify-start animate-fade-in">
              <div className="max-w-md rounded-lg bg-muted px-4 py-3 text-foreground">
                <p className="text-sm">Thinking...</p>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="border-t border-border p-4">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !loading && handleSend()}
            placeholder="Ask about network performance..."
            className="flex-1"
            disabled={loading}
          />
          <Button onClick={handleSend} size="icon" disabled={loading}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

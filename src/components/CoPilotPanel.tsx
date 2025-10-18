import { useState } from "react";
import { Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  type?: "text" | "recommendation";
  recommendation?: {
    title: string;
    justification: string;
    impact: string;
  };
}

export const CoPilotPanel = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! I'm your RAN Co-pilot. I can help you diagnose network issues, analyze KPIs, and optimize cell parameters. How can I assist you today?",
      timestamp: new Date(),
      type: "text",
    },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
      type: "text",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I've analyzed the network data. Let me investigate that for you...",
        timestamp: new Date(),
        type: "text",
      };
      setMessages((prev) => [...prev, aiMessage]);
    }, 1000);
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
                    {message.recommendation.justification}
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
                  <p className="text-sm">{message.content}</p>
                  <p className="mt-1 text-xs opacity-70">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="border-t border-border p-4">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask about network performance..."
            className="flex-1"
          />
          <Button onClick={handleSend} size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

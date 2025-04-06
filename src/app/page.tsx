"use client";
import dynamic from "next/dynamic";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Message = {
  text: string;
  sender: "user" | "bot"; // or just string if more flexible
};

{/* Keep this out of the component to avoid SSR issues with Leaflet */}
{/* Component still re-renders, just doesn't display white flash */}
const MapWithNoSSR = dynamic(
  () => import("./components/SimpleMapComponent"),
  { ssr: false }
);

export default function Home() {
 
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [showChat, setShowChat] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
  
    const userMessage = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
  
    try {
      const response = await fetch("http://localhost:3001/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
  
      const data = await response.json();
  
      // 🧠 Extract clean text from Claude's response
      let content = "";
  
      if (Array.isArray(data.reply)) {
        content = data.reply.map((item) => item.text).join("\n");
      } else if (typeof data.reply === "object" && data.reply.text) {
        content = data.reply.text;
      } else {
        content = String(data.reply);
      }
  
      const botMessage = { text: content, sender: "bot" };
      setMessages((prev) => [...prev, botMessage]);
  
    } catch (err) {
      console.error("❌ API error:", err);
      setMessages((prev) => [
        ...prev,
        {
          text: "Sorry, there was an error talking to the assistant.",
          sender: "bot",
        },
      ]);
    }
  };
  ;
  

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {/* Map Section */}
      <div className="absolute inset-0 z-0">
        <MapWithNoSSR />
      </div>

      {/* Toggle Chat Button */}
      <div className="absolute bottom-4 right-4 z-20">
        <Button type="button" onClick={() => setShowChat(!showChat)}>
          {showChat ? "Close Chat" : "Open Chat"}
        </Button>
      </div>

      {/* ChatGPT Style Card */}
      {showChat && (
        <Card className="absolute bottom-20 right-4 w-96 p-4 z-20 shadow-lg bg-white space-y-3">
          <div className="max-h-64 overflow-y-auto space-y-2">
            {messages.map((msg, index) => (
              <div key={index} className="text-left text-sm bg-gray-100 p-2 rounded">
                {msg.text}
              </div>
            ))}
          </div>
          <div className="flex gap-2 pt-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask something..."
              className="flex-1"
            />
            <Button type="button" onClick={sendMessage}>Send</Button>
          </div>
        </Card>
      )}
    </div>
  );
}

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChat } from "@/hooks/useChat";
import { useAuth } from "@/hooks/useAuth";
import { Send, User } from "lucide-react";

interface ChatDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  receiverUnionId: string;
  receiverName: string;
  receiverAvatar?: string | null;
}

export function ChatDialog({ 
  isOpen, 
  onOpenChange, 
  receiverUnionId, 
  receiverName,
  receiverAvatar 
}: ChatDialogProps) {
  const { user } = useAuth();
  const participants = [user?.unionId, receiverUnionId].sort();
  const conversationId = participants.join("_");
  
  const { messages, sendMessage } = useChat(conversationId);
  const [content, setContent] = useState("");

  const handleSend = async () => {
    if (!content.trim()) return;
    await sendMessage(receiverUnionId, content);
    setContent("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] h-[600px] flex flex-col p-0 overflow-hidden rounded-[2rem] border-none shadow-2xl">
        <DialogHeader className="p-6 bg-[#0D5D48] text-white space-y-0">
          <div className="flex items-center gap-4">
            <img 
              src={receiverAvatar || `https://api.dicebear.com/7.x/initials/svg?seed=${receiverName}`} 
              alt="" 
              className="w-10 h-10 rounded-full border-2 border-white/20"
            />
            <DialogTitle className="text-xl font-black">{receiverName}</DialogTitle>
          </div>
        </DialogHeader>
        
        <ScrollArea className="flex-1 p-6 bg-[#FAFBF7]">
          <div className="space-y-4">
            {messages.map((msg) => {
              const isMe = msg.senderId === user?.unionId;
              return (
                <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                    isMe 
                      ? "bg-[#0D5D48] text-white rounded-br-none" 
                      : "bg-white text-[#1A1A2E] rounded-bl-none shadow-sm border border-gray-100"
                  }`}>
                    {msg.content}
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>

        <div className="p-4 bg-white border-t border-gray-100 flex gap-2">
          <Input 
            placeholder="اكتب رسالتك..." 
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="rounded-xl border-gray-200 h-11"
          />
          <Button 
            onClick={handleSend}
            className="bg-[#0D5D48] hover:bg-[#094533] rounded-xl w-11 h-11 p-0 shrink-0"
          >
            <Send className="w-4 h-4 ml-0.5" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

import React, { useState, useRef, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import {
  Send,
  Smile,
  Paperclip,
  MoreVertical,
  Phone,
  Video,
  MapPin,
  Clock,
  CheckCheck,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  Message,
  MessageThread,
  createMessage,
  formatMessageTime,
  groupMessagesByDate,
  defaultQuickReplies,
  validateMessage,
  addReaction,
} from '../../utils/messaging';

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  thread: MessageThread;
  currentUserId: string;
  onSendMessage?: (message: Message) => void;
}

export default function ChatModal({
  isOpen,
  onClose,
  thread,
  currentUserId,
  onSendMessage,
}: ChatModalProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize with some mock messages
  useEffect(() => {
    if (isOpen) {
      const mockMessages: Message[] = [
        createMessage(
          thread.id,
          thread.participants[0].id,
          thread.participants[0].name,
          "Hi! I'll be picking you up tomorrow at 8 AM. Sound good?",
          'text'
        ),
        createMessage(
          thread.id,
          currentUserId,
          'You',
          'Perfect! See you then 👍',
          'text'
        ),
        createMessage(
          thread.id,
          'system',
          'System',
          'Ride confirmed for tomorrow at 8:00 AM',
          'system'
        ),
      ];
      
      // Set timestamps to make them look older
      mockMessages[0].timestamp = new Date(Date.now() - 3600000);
      mockMessages[1].timestamp = new Date(Date.now() - 3000000);
      mockMessages[2].timestamp = new Date(Date.now() - 2400000);
      
      setMessages(mockMessages);
    }
  }, [isOpen, thread.id]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    const validation = validateMessage(inputValue);
    if (!validation.isValid) {
      toast.error(validation.error);
      return;
    }

    const newMessage = createMessage(
      thread.id,
      currentUserId,
      'You',
      inputValue,
      'text'
    );

    setMessages([...messages, newMessage]);
    setInputValue('');
    setShowQuickReplies(false);
    
    if (onSendMessage) {
      onSendMessage(newMessage);
    }

    // Simulate reply
    setTimeout(() => {
      setIsTyping(true);
    }, 1000);

    setTimeout(() => {
      setIsTyping(false);
      const reply = createMessage(
        thread.id,
        thread.participants[0].id,
        thread.participants[0].name,
        'Got it! Thanks for letting me know.',
        'text'
      );
      setMessages((prev) => [...prev, reply]);
    }, 3000);
  };

  const handleQuickReply = (text: string) => {
    setInputValue(text);
    setShowQuickReplies(false);
  };

  const handleReaction = (messageId: string, emoji: string) => {
    setMessages(
      messages.map((msg) =>
        msg.id === messageId
          ? addReaction(msg, emoji, currentUserId, 'You')
          : msg
      )
    );
  };

  const groupedMessages = groupMessagesByDate(messages);
  const otherParticipants = thread.participants.filter((p) => p.id !== currentUserId);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl h-[600px] flex flex-col p-0">
        {/* Header */}
        <DialogHeader className="p-4 border-b bg-gradient-to-r from-info-subtle to-info-subtle">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback>
                  {otherParticipants[0]?.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <DialogTitle className="text-base">{thread.name}</DialogTitle>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  {thread.type === 'ride' && thread.metadata?.rideDate && (
                    <>
                      <Clock className="h-3 w-3" />
                      <span>
                        {new Date(thread.metadata.rideDate).toLocaleDateString()}
                      </span>
                    </>
                  )}
                  {otherParticipants[0]?.isOnline && (
                    <>
                      <span className="h-2 w-2 bg-success rounded-full"></span>
                      <span>Online</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm">
                <Phone className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Video className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {Array.from(groupedMessages.entries()).map(([date, dateMessages]) => (
            <div key={date}>
              {/* Date Separator */}
              <div className="flex items-center gap-3 my-4">
                <div className="flex-1 h-px bg-muted"></div>
                <span className="text-xs text-muted-foreground font-medium px-2">{date}</span>
                <div className="flex-1 h-px bg-muted"></div>
              </div>

              {/* Messages */}
              {dateMessages.map((message) => {
                const isOwn = message.senderId === currentUserId;
                const isSystem = message.type === 'system';

                if (isSystem) {
                  return (
                    <div key={message.id} className="flex justify-center my-2">
                      <div className="bg-muted text-muted-foreground text-xs px-3 py-1 rounded-full">
                        {message.content}
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={message.id}
                    className={`flex gap-2 ${isOwn ? 'justify-end' : 'justify-start'}`}
                  >
                    {!isOwn && (
                      <Avatar className="h-8 w-8 mt-1">
                        <AvatarFallback className="text-xs">
                          {message.senderName
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </AvatarFallback>
                      </Avatar>
                    )}

                    <div className={`max-w-[70%] ${isOwn ? 'items-end' : 'items-start'} flex flex-col`}>
                      {!isOwn && (
                        <span className="text-xs text-muted-foreground mb-1 px-1">
                          {message.senderName}
                        </span>
                      )}
                      
                      <div
                        className={`group relative px-4 py-2 rounded-2xl ${
                          isOwn
                            ? 'bg-info text-white'
                            : 'bg-muted text-foreground'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        
                        {/* Reaction Button (on hover) */}
                        <div className="absolute -top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="bg-card shadow-lg rounded-full p-1 flex gap-1 border">
                            {['👍', '❤️', '😊', '🎉'].map((emoji) => (
                              <button
                                key={emoji}
                                onClick={() => handleReaction(message.id, emoji)}
                                className="hover:scale-125 transition-transform text-sm"
                              >
                                {emoji}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Reactions */}
                        {message.reactions && message.reactions.length > 0 && (
                          <div className="flex gap-1 mt-1 flex-wrap">
                            {Object.entries(
                              message.reactions.reduce((acc, r) => {
                                acc[r.emoji] = (acc[r.emoji] || 0) + 1;
                                return acc;
                              }, {} as Record<string, number>)
                            ).map(([emoji, count]) => (
                              <span
                                key={emoji}
                                className="text-xs bg-card bg-opacity-90 px-1.5 py-0.5 rounded-full border"
                              >
                                {emoji} {count}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-1 mt-1 px-1">
                        <span className="text-xs text-muted-foreground">
                          {formatMessageTime(message.timestamp)}
                        </span>
                        {isOwn && message.isRead && (
                          <CheckCheck className="h-3 w-3 text-info" />
                        )}
                      </div>
                    </div>

                    {isOwn && (
                      <Avatar className="h-8 w-8 mt-1">
                        <AvatarFallback className="text-xs bg-info text-white">
                          You
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                );
              })}
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-2 items-center">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs">
                  {otherParticipants[0]?.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </AvatarFallback>
              </Avatar>
              <div className="bg-muted px-4 py-2 rounded-2xl">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Replies */}
        {showQuickReplies && (
          <div className="px-4 pb-2">
            <div className="flex flex-wrap gap-2">
              {defaultQuickReplies.slice(0, 4).map((reply) => (
                <Button
                  key={reply.id}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickReply(reply.text)}
                  className="text-xs"
                >
                  <span className="mr-1">{reply.icon}</span>
                  {reply.text}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="p-4 border-t bg-background-subtle">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <Paperclip className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <MapPin className="h-4 w-4" />
            </Button>
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type a message..."
              className="flex-1"
            />
            <Button variant="ghost" size="sm">
              <Smile className="h-4 w-4" />
            </Button>
            <Button
              onClick={handleSend}
              disabled={!inputValue.trim()}
              className="bg-info hover:bg-info"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
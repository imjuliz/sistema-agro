'use client'

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Send, 
  Paperclip, 
  Mic, 
  Search,
  Phone,
  Video,
  MoreVertical,
  Clock,
  CheckCheck
} from 'lucide-react';

export function ChatInterface({ userType }) {
  const [selectedChat, setSelectedChat] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const conversations = [
    {
      id: 1,
      name: userType === 'supplier' ? 'Bella Vista Restaurant' : 'Fresh Valley Farms',
      role: userType === 'supplier' ? 'Restaurant Manager' : 'Sales Rep',
      lastMessage: 'Can we discuss the delivery schedule for next week?',
      timestamp: '2 min ago',
      unread: 3,
      online: true,
      avatar: 'BV'
    },
    {
      id: 2,
      name: userType === 'supplier' ? 'Grand Hotel Kitchen' : 'Premium Meats Co.',
      role: userType === 'supplier' ? 'Head Chef' : 'Account Manager',
      lastMessage: 'Thank you for the quick delivery yesterday!',
      timestamp: '1 hour ago',
      unread: 0,
      online: false,
      avatar: 'GH'
    },
    {
      id: 3,
      name: userType === 'supplier' ? 'Metro Bistro' : 'Ocean Fresh Seafood',
      role: userType === 'supplier' ? 'Owner' : 'Sales Rep',
      lastMessage: 'I need to place a large order for the weekend rush',
      timestamp: '3 hours ago',
      unread: 1,
      online: true,
      avatar: 'MB'
    }
  ];

  const messages = selectedChat ? [
    {
      id: 1,
      sender: 'other',
      text: 'Hello! I wanted to discuss our upcoming order for next week.',
      timestamp: '10:30 AM',
      type: 'text'
    },
    {
      id: 2,
      sender: 'me',
      text: 'Of course! What specific items are you looking for?',
      timestamp: '10:32 AM',
      type: 'text'
    },
    {
      id: 3,
      sender: 'other',
      text: 'We need about 50 lbs of your premium ribeye steaks and 20 cases of mixed greens.',
      timestamp: '10:35 AM',
      type: 'text'
    },
    {
      id: 4,
      sender: 'me',
      text: 'I can definitely accommodate that. The ribeye is $24.99/lb and mixed greens are $8.50/case. Would Tuesday delivery work?',
      timestamp: '10:37 AM',
      type: 'text'
    },
    {
      id: 5,
      sender: 'other',
      text: 'audio_message.mp3',
      timestamp: '10:40 AM',
      type: 'audio',
      duration: '0:45'
    },
    {
      id: 6,
      sender: 'me',
      text: 'Perfect! I\'ll prepare the order and send you the invoice. Delivery confirmed for Tuesday at 8 AM.',
      timestamp: '10:42 AM',
      type: 'text'
    }
  ] : [];

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sendMessage = () => {
    if (messageText.trim()) {
      // Add message logic here
      setMessageText('');
    }
  };

  return (
    <div className="space-y-6">
      <h3>Messages & Communication</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
        {/* Conversations List */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Conversations</CardTitle>
              <Badge variant="secondary">{conversations.filter(c => c.unread > 0).length} unread</Badge>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[480px]">
              {filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`p-4 border-b cursor-pointer hover:bg-muted/50 transition-colors ${
                    selectedChat?.id === conversation.id ? 'bg-muted' : ''
                  }`}
                  onClick={() => setSelectedChat(conversation)}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <Avatar>
                        <AvatarFallback>{conversation.avatar}</AvatarFallback>
                      </Avatar>
                      {conversation.online && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="truncate">{conversation.name}</h4>
                        <span className="text-xs text-muted-foreground">{conversation.timestamp}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{conversation.role}</p>
                      <p className="text-sm text-muted-foreground truncate">{conversation.lastMessage}</p>
                    </div>
                    
                    {conversation.unread > 0 && (
                      <Badge variant="default" className="ml-2">
                        {conversation.unread}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Chat Window */}
        <Card className="lg:col-span-2">
          {selectedChat ? (
            <>
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>{selectedChat.avatar}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4>{selectedChat.name}</h4>
                      <p className="text-sm text-muted-foreground">{selectedChat.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Video className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-0">
                <ScrollArea className="h-[400px] p-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg p-3 ${
                            message.sender === 'me'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          }`}
                        >
                          {message.type === 'audio' ? (
                            <div className="flex items-center gap-2">
                              <Mic className="h-4 w-4" />
                              <span className="text-sm">{message.text}</span>
                              <span className="text-xs opacity-70">{message.duration}</span>
                            </div>
                          ) : (
                            <p className="text-sm">{message.text}</p>
                          )}
                          <div className="flex items-center justify-end gap-1 mt-1">
                            <span className="text-xs opacity-70">{message.timestamp}</span>
                            {message.sender === 'me' && (
                              <CheckCheck className="h-3 w-3 opacity-70" />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                <div className="border-t p-4">
                  <div className="flex items-end gap-2">
                    <Button variant="ghost" size="sm">
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <Textarea
                      placeholder="Type your message..."
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      className="flex-1 min-h-[40px] max-h-[120px] resize-none"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          sendMessage();
                        }
                      }}
                    />
                    <Button variant="ghost" size="sm">
                      <Mic className="h-4 w-4" />
                    </Button>
                    <Button onClick={sendMessage} disabled={!messageText.trim()}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                {/* <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto mb-4" /> */}
                <h4>Select a conversation</h4>
                <p className="text-muted-foreground">Choose a conversation from the list to start messaging</p>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Communication Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <h4>Real-time Chat</h4>
              <p className="text-sm text-muted-foreground">Instant messaging with suppliers and customers</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4>File Sharing</h4>
              <p className="text-sm text-muted-foreground">Share documents, images, and order details</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4>Voice Messages</h4>
              <p className="text-sm text-muted-foreground">Send audio messages for complex discussions</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
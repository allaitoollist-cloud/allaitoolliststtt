'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
}

export function ChatbotWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Initialize messages on client side only to avoid hydration mismatch
    useEffect(() => {
        setMounted(true);
        setMessages([
            {
                id: '1',
                text: 'Hi! I\'m your AI assistant. How can I help you today?',
                sender: 'bot',
                timestamp: new Date(),
            }
        ]);
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const getBotResponse = (userMessage: string): string => {
        const lowerMsg = userMessage.toLowerCase();

        // Simple rule-based responses
        if (lowerMsg.includes('hello') || lowerMsg.includes('hi') || lowerMsg.includes('hey')) {
            return 'Hello! How can I assist you today?';
        }
        if (lowerMsg.includes('tool') || lowerMsg.includes('ai')) {
            return 'We have a wide range of AI tools! You can browse them on our Tools page or submit your own AI tool.';
        }
        if (lowerMsg.includes('submit') || lowerMsg.includes('add')) {
            return 'You can submit your AI tool by clicking on "Submit Tool" in the navigation menu. It\'s completely free!';
        }
        if (lowerMsg.includes('price') || lowerMsg.includes('cost') || lowerMsg.includes('free')) {
            return 'Submitting and listing your AI tool is completely free! We also have filters to show free vs paid tools.';
        }
        if (lowerMsg.includes('contact') || lowerMsg.includes('help') || lowerMsg.includes('support') || lowerMsg.includes('whatsapp')) {
            return 'You can reach us through the Contact page, email, or chat with us on WhatsApp at +1 (307) 346-4572. We typically respond quickly!';
        }
        if (lowerMsg.includes('blog') || lowerMsg.includes('article')) {
            return 'Check out our Blog for the latest articles on AI tools, tutorials, and industry insights!';
        }
        if (lowerMsg.includes('register') || lowerMsg.includes('signup') || lowerMsg.includes('account')) {
            return 'You can create an account by clicking "Sign Up" in the navigation. This lets you save favorites and submit tools!';
        }
        if (lowerMsg.includes('category') || lowerMsg.includes('type')) {
            return 'We have tools in various categories: Writing, Image Generation, Video, Audio, Coding, Marketing, and more!';
        }
        if (lowerMsg.includes('thanks') || lowerMsg.includes('thank you')) {
            return 'You\'re welcome! Feel free to ask if you need anything else! 😊';
        }
        if (lowerMsg.includes('bye') || lowerMsg.includes('goodbye')) {
            return 'Goodbye! Have a great day! Feel free to come back anytime.';
        }

        // Default response
        return 'I\'m here to help! You can ask me about:\n• Browsing AI tools\n• Submitting your tool\n• WhatsApp Support (+1 307 346 4572)\n• Contact information\n\nWhat would you like to know?';
    };

    const handleSend = () => {
        if (!input.trim()) return;

        // Add user message
        const userMessage: Message = {
            id: Date.now().toString(),
            text: input,
            sender: 'user',
            timestamp: new Date(),
        };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsTyping(true);

        // Simulate bot typing and response
        setTimeout(() => {
            const botMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: getBotResponse(input),
                sender: 'bot',
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, botMessage]);
            setIsTyping(false);
        }, 1000);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    };

    // Don't render until mounted to avoid hydration mismatch
    if (!mounted) {
        return null;
    }

    return (
        <>
            {/* Floating Chat Button */}
            {!isOpen && (
                <Button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50"
                    size="icon"
                >
                    <MessageCircle className="h-6 w-6" />
                </Button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <Card className="fixed bottom-6 right-6 w-96 h-[500px] flex flex-col shadow-2xl z-50 overflow-hidden">
                    {/* Header */}
                    <div className="bg-primary text-primary-foreground p-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Bot className="h-5 w-5" />
                            <div>
                                <h3 className="font-semibold">AI Assistant</h3>
                                <p className="text-xs opacity-90">Online</p>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsOpen(false)}
                            className="text-primary-foreground hover:bg-primary-foreground/20"
                        >
                            <X className="h-5 w-5" />
                        </Button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/10">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex gap-2 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                {message.sender === 'bot' && (
                                    <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                                        <Bot className="h-4 w-4 text-primary-foreground" />
                                    </div>
                                )}
                                <div
                                    className={`max-w-[75%] rounded-lg p-3 ${message.sender === 'user'
                                        ? 'bg-primary text-primary-foreground'
                                        : 'bg-card border'
                                        }`}
                                >
                                    <p className="text-sm whitespace-pre-line">{message.text}</p>
                                    <p className="text-xs mt-1 opacity-60">
                                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                                {message.sender === 'user' && (
                                    <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                                        <User className="h-4 w-4" />
                                    </div>
                                )}
                            </div>
                        ))}
                        {isTyping && (
                            <div className="flex gap-2 justify-start">
                                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                                    <Bot className="h-4 w-4 text-primary-foreground" />
                                </div>
                                <div className="bg-card border rounded-lg p-3">
                                    <div className="flex gap-1">
                                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-4 border-t bg-background">
                        <div className="flex gap-2">
                            <Input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Type your message..."
                                className="flex-1"
                            />
                            <Button onClick={handleSend} size="icon">
                                <Send className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </Card>
            )}
        </>
    );
}

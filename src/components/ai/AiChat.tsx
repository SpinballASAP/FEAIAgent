'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  PaperAirplaneIcon, 
  SparklesIcon, 
  TrashIcon,
  MicrophoneIcon,
  SpeakerWaveIcon
} from '@heroicons/react/24/outline';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useToast } from '@/components/ui/Toast';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  intent?: string;
  confidence?: number;
  suggestions?: string[];
}

import { PageContext } from '@/hooks/usePageContext';

interface AiChatProps {
  className?: string;
  initialMessage?: string;
  pageContext?: PageContext;
}

export const AiChat: React.FC<AiChatProps> = ({ className, initialMessage, pageContext }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { success, error: showError } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (initialMessage) {
      handleSendMessage(initialMessage);
    } else {
      // Get welcome message
      getWelcomeMessage();
    }
  }, [initialMessage]);

  // Listen for quick actions from GlobalAiAgent
  useEffect(() => {
    const handleQuickAction = (event: CustomEvent) => {
      const { message } = event.detail;
      if (message) {
        handleSendMessage(message);
      }
    };

    window.addEventListener('ai-quick-action', handleQuickAction as EventListener);
    return () => {
      window.removeEventListener('ai-quick-action', handleQuickAction as EventListener);
    };
  }, []);

  const getWelcomeMessage = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/ai/chat/welcome', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        const welcomeMessage: Message = {
          id: Date.now().toString(),
          type: 'assistant',
          content: data.message || 'สวัสดีครับ! ผมคือ AI Assistant สำหรับระบบ TMS ยินดีช่วยเหลือคุณ',
          timestamp: new Date(),
          suggestions: data.suggestions || ['ดูสถิติการขนส่ง', 'สร้างงานใหม่', 'คำนวณระยะทาง']
        };
        setMessages([welcomeMessage]);
      }
    } catch (error) {
      console.error('Failed to get welcome message:', error);
    }
  };

  const handleSendMessage = async (messageText?: string) => {
    const text = messageText || inputMessage.trim();
    if (!text) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: text,
          session_id: sessionId,
          page_context: pageContext ? {
            page_name: pageContext.pageName,
            page_name_thai: pageContext.pageNameThai,
            features: pageContext.features,
            available_tools: pageContext.aiTools.map(tool => ({
              name: tool.name,
              endpoint: tool.endpoint,
              description: tool.description
            }))
          } : undefined,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: data.response,
          timestamp: new Date(),
          intent: data.intent,
          confidence: data.confidence,
          suggestions: data.suggestions,
        };

        setMessages(prev => [...prev, assistantMessage]);
        setSessionId(data.session_id);
      } else {
        throw new Error('Failed to get AI response');
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: 'ขออภัยครับ ไม่สามารถตอบกลับได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
      showError('Chat Error', 'Unable to get AI response');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = async () => {
    try {
      await fetch('http://localhost:8000/api/ai/chat/clear', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ session_id: sessionId }),
      });
    } catch (error) {
      console.error('Failed to clear chat:', error);
    }
    
    setMessages([]);
    setSessionId(null);
    success('Chat cleared', 'Conversation history has been cleared');
    getWelcomeMessage();
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleVoiceInput = async () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      showError('Speech Recognition Not Supported', 'Your browser does not support speech recognition');
      return;
    }

    setIsListening(true);
    
    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.lang = 'th-TH';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
        showError('Voice Input Failed', 'Unable to capture voice input');
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (error) {
      setIsListening(false);
      showError('Voice Input Error', 'Failed to start voice recognition');
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    return timestamp.toLocaleTimeString('th-TH', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <Card className={`flex flex-col h-80 sm:h-96 ${className}`}>
      <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <SparklesIcon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
          <h3 className="text-sm sm:text-base font-semibold text-gray-800">AI Assistant</h3>
          {sessionId && (
            <span className="hidden sm:inline-flex text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
              Connected
            </span>
          )}
        </div>
        
        <Button
          onClick={handleClearChat}
          variant="ghost"
          size="sm"
          icon={<TrashIcon className="w-3 h-3 sm:w-4 sm:h-4" />}
          disabled={messages.length === 0}
          className="text-xs sm:text-sm"
        >
          <span className="hidden sm:inline">Clear</span>
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-3 sm:space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-xs sm:max-w-sm lg:max-w-md px-3 py-2 sm:px-4 rounded-lg ${
              message.type === 'user'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-800'
            }`}>
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              <div className="flex items-center justify-between mt-1">
                <span className={`text-xs ${
                  message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {formatTimestamp(message.timestamp)}
                </span>
                {message.intent && (
                  <span className={`text-xs px-2 py-1 rounded ${
                    message.type === 'user' ? 'bg-blue-500' : 'bg-gray-200'
                  }`}>
                    {message.intent}
                  </span>
                )}
              </div>
              
              {message.suggestions && message.suggestions.length > 0 && (
                <div className="mt-2 space-y-1">
                  <p className="text-xs text-gray-600 font-semibold">Suggestions:</p>
                  <div className="flex flex-wrap gap-1">
                    {message.suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded hover:bg-blue-100 transition-colors"
                        disabled={isLoading}
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg px-4 py-2">
              <LoadingSpinner size="sm" />
              <span className="ml-2 text-sm text-gray-600">กำลังคิด...</span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 sm:p-4 border-t border-gray-200">
        <div className="flex space-x-1 sm:space-x-2">
          <input
            ref={inputRef}
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="พิมพ์ข้อความ..."
            className="flex-1 px-2 py-2 sm:px-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            disabled={isLoading}
          />
          
          <Button
            onClick={handleVoiceInput}
            variant={isListening ? 'primary' : 'secondary'}
            size="sm"
            icon={<MicrophoneIcon className="w-3 h-3 sm:w-4 sm:h-4" />}
            disabled={isLoading || isListening}
            className={isListening ? 'animate-pulse' : ''}
          />
          
          <Button
            onClick={() => handleSendMessage()}
            variant="primary"
            size="sm"
            icon={isLoading ? <LoadingSpinner size="xs" /> : <PaperAirplaneIcon className="w-3 h-3 sm:w-4 sm:h-4" />}
            disabled={!inputMessage.trim() || isLoading}
          />
        </div>
      </div>
    </Card>
  );
};

export default AiChat;
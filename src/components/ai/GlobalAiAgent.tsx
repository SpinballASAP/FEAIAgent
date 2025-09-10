'use client';

import React, { useState, useEffect } from 'react';
import { 
  SparklesIcon, 
  XMarkIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import AiChat from './AiChat';
import AiToolDemo from './AiToolDemo';
import Button from '@/components/ui/Button';
import { usePageContext } from '@/hooks/usePageContext';

interface GlobalAiAgentProps {
  className?: string;
}

export const GlobalAiAgent: React.FC<GlobalAiAgentProps> = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const pageContext = usePageContext();

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const sendQuickAction = (message: string) => {
    const event = new CustomEvent('ai-quick-action', { 
      detail: { message }
    });
    window.dispatchEvent(event);
  };

  // Keyboard shortcut to toggle AI (Cmd+K or Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        toggleChat();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <>
      {/* Floating AI Button */}
      <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
        <Button
          onClick={toggleChat}
          variant="primary"
          size="lg"
          className="rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 p-4"
          icon={
            isOpen ? 
            <XMarkIcon className="w-6 h-6" /> :
            <div className="flex items-center space-x-1">
              <SparklesIcon className="w-6 h-6" />
              <ChatBubbleLeftRightIcon className="w-5 h-5" />
            </div>
          }
        >
          <span className="hidden sm:inline-flex ml-2 font-semibold">
            {isOpen ? 'ปิด AI' : 'AI Assistant'}
          </span>
          <span className="hidden lg:inline-flex ml-2 text-xs bg-white/20 px-2 py-1 rounded">
            ⌘K
          </span>
        </Button>
      </div>

      {/* AI Chat Modal/Panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 sm:hidden"
            onClick={toggleChat}
          />
          
          {/* Chat Panel */}
          <div className="fixed inset-x-0 bottom-0 z-50 sm:bottom-6 sm:right-6 sm:inset-x-auto sm:w-96">
            <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl border border-gray-200 max-h-[80vh] sm:max-h-[600px] flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700 rounded-t-2xl sm:rounded-t-2xl">
                <div className="flex items-center space-x-2 text-white">
                  <SparklesIcon className="w-5 h-5" />
                  <div>
                    <h3 className="font-semibold">TMS AI Assistant</h3>
                    <p className="text-xs text-blue-100">หน้า{pageContext.pageNameThai}</p>
                  </div>
                </div>
                <button
                  onClick={toggleChat}
                  className="text-white hover:text-gray-200 p-1 rounded-full hover:bg-white/20 transition-colors"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
              
              {/* Chat Content */}
              <div className="flex-1 min-h-0">
                <AiChat 
                  className="h-full border-0 bg-transparent shadow-none rounded-none"
                  initialMessage={`สวัสดีครับ! ผมคือ AI Assistant สำหรับระบบ TMS กำลังช่วยเหลือคุณในหน้า${pageContext.pageNameThai} ซึ่งมีฟีเจอร์: ${pageContext.features.join(', ')}`}
                  pageContext={pageContext}
                />
              </div>
              
              {/* AI Tools Available */}
              <div className="p-4 bg-blue-50 border-t border-blue-200">
                <div className="text-xs text-blue-700 mb-3 font-semibold">
                  🤖 AI Tools ที่ใช้ได้ในหน้านี้:
                </div>
                <div className="space-y-2">
                  {pageContext.aiTools.map((tool, index) => (
                    <AiToolDemo key={index} tool={tool} />
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="p-4 bg-gray-50 border-t border-gray-200">
                <div className="text-xs text-gray-600 mb-3 font-semibold">
                  ⚡ Quick Actions สำหรับ{pageContext.pageNameThai}:
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {pageContext.quickActions.map((action, index) => (
                    <button 
                      key={index}
                      className="bg-white border border-gray-200 rounded-lg px-3 py-2 hover:bg-blue-50 hover:border-blue-200 transition-colors text-left"
                      onClick={() => sendQuickAction(action.message)}
                    >
                      {action.emoji} {action.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default GlobalAiAgent;
'use client';

import React from 'react';
import { 
  XMarkIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClipboardDocumentIcon
} from '@heroicons/react/24/outline';
import Button from './Button';
import Card from './Card';

interface ApiResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  endpoint: string;
  method: string;
  result?: any;
  error?: string;
  loading?: boolean;
}

export const ApiResultModal: React.FC<ApiResultModalProps> = ({
  isOpen,
  onClose,
  title,
  endpoint,
  method,
  result,
  error,
  loading
}) => {
  if (!isOpen) return null;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // แสดง toast notification ได้
  };

  const formatResult = (data: any) => {
    if (typeof data === 'string') return data;
    return JSON.stringify(data, null, 2);
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={onClose} />
      
      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <Card className="max-w-2xl w-full max-h-[80vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              <p className="text-sm text-gray-600">
                <span className={`px-2 py-1 rounded text-xs font-mono ${
                  method === 'GET' ? 'bg-green-100 text-green-800' :
                  method === 'POST' ? 'bg-blue-100 text-blue-800' :
                  method === 'PUT' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {method}
                </span>
                <span className="ml-2 font-mono text-gray-700">{endpoint}</span>
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {loading && (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600">กำลังโหลด...</span>
              </div>
            )}

            {error && (
              <div className="flex items-start space-x-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                <ExclamationTriangleIcon className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-medium text-red-800">API Error</h4>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
              </div>
            )}

            {result && !loading && !error && (
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircleIcon className="w-5 h-5 text-green-500" />
                  <span className="text-sm font-medium text-green-800">API Call Successful</span>
                </div>

                {/* Formatted Result Display */}
                <div className="relative">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-gray-900">Response:</h4>
                    <Button
                      onClick={() => copyToClipboard(formatResult(result))}
                      variant="ghost"
                      size="sm"
                      icon={<ClipboardDocumentIcon className="w-4 h-4" />}
                      className="text-xs"
                    >
                      Copy
                    </Button>
                  </div>
                  
                  <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                    <pre className="text-sm text-gray-100">
                      <code>{formatResult(result)}</code>
                    </pre>
                  </div>
                </div>

                {/* Special formatting for specific API responses */}
                {result.distance && result.duration && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-900">{result.distance}</div>
                      <div className="text-sm text-blue-700">Distance</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-900">{result.duration}</div>
                      <div className="text-sm text-blue-700">Duration</div>
                    </div>
                    {result.price && (
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-900">{result.price}</div>
                        <div className="text-sm text-blue-700">Price</div>
                      </div>
                    )}
                  </div>
                )}

                {result.optimized_route && Array.isArray(result.optimized_route) && (
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <h5 className="font-medium text-green-900 mb-2">Optimized Route:</h5>
                    <div className="flex items-center space-x-2 text-sm text-green-800">
                      {result.optimized_route.map((point: string, index: number) => (
                        <React.Fragment key={index}>
                          <span className="bg-green-200 px-2 py-1 rounded">{point}</span>
                          {index < result.optimized_route.length - 1 && (
                            <span className="text-green-600">→</span>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 flex justify-end">
            <Button onClick={onClose} variant="primary">
              Close
            </Button>
          </div>
        </Card>
      </div>
    </>
  );
};

export default ApiResultModal;
'use client';

import React, { useState } from 'react';
import { 
  PlayIcon,
  SparklesIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface AiToolDemoProps {
  tool: {
    name: string;
    endpoint: string;
    description: string;
  };
  className?: string;
}

export const AiToolDemo: React.FC<AiToolDemoProps> = ({ tool, className }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDemo = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      let demoData = {};
      
      // เตรียมข้อมูลตัวอย่างตามประเภทของเครื่องมือ
      switch (tool.endpoint) {
        case '/api/ai/distance/calculate':
          demoData = {
            origin_address: "กรุงเทพมหานคร",
            destination_address: "เชียงใหม่",
            vehicle_type: "truck"
          };
          break;
        case '/api/ai/route/optimize':
          demoData = {
            waypoints: [
              "กรุงเทพมหานคร",
              "นครสวรรค์",
              "เชียงใหม่"
            ],
            vehicle_type: "truck"
          };
          break;
        case '/api/ai/voice/capabilities':
          // ไม่ต้องส่งข้อมูล
          break;
        default:
          // ข้ามการทดสอบสำหรับ tools ที่ไม่มี demo
          setError('Demo ไม่พร้อมใช้งานสำหรับเครื่องมือนี้');
          setIsLoading(false);
          return;
      }

      const response = await fetch(`http://localhost:8000${tool.endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(demoData),
      });

      if (response.ok) {
        const data = await response.json();
        setResult(data);
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Demo error:', error);
      setError(error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการทดสอบ');
    } finally {
      setIsLoading(false);
    }
  };

  const formatResult = (data: any) => {
    if (!data) return '';
    
    // แสดงผลตามประเภทข้อมูล
    if (data.distance && data.duration) {
      return `ระยะทาง: ${data.distance}, เวลา: ${data.duration}, ค่าขนส่ง: ${data.price || 'N/A'}`;
    }
    
    if (data.optimized_route) {
      return `เส้นทางที่ปรับปรุง: ${data.optimized_route.join(' → ')}`;
    }
    
    return JSON.stringify(data, null, 2);
  };

  return (
    <div className={`border border-gray-200 rounded-lg p-3 ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <SparklesIcon className="w-4 h-4 text-purple-600" />
          <span className="font-medium text-gray-800 text-sm">{tool.name}</span>
        </div>
        <Button
          onClick={handleDemo}
          variant="secondary"
          size="sm"
          icon={isLoading ? <LoadingSpinner size="xs" /> : <PlayIcon className="w-3 h-3" />}
          disabled={isLoading}
          className="text-xs"
        >
          ทดสอบ
        </Button>
      </div>
      
      <p className="text-xs text-gray-600 mb-3">{tool.description}</p>
      
      {error && (
        <div className="flex items-center space-x-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
          <XCircleIcon className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}
      
      {result && (
        <div className="flex items-start space-x-2 p-2 bg-green-50 border border-green-200 rounded text-xs">
          <CheckCircleIcon className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <div className="font-medium text-green-800 mb-1">ผลลัพธ์:</div>
            <pre className="text-green-700 whitespace-pre-wrap overflow-x-auto">
              {formatResult(result)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default AiToolDemo;
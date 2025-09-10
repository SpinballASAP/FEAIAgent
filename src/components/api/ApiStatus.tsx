'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircleIcon, XCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useToast } from '@/components/ui/Toast';

interface ApiStatusProps {
  className?: string;
}

interface ServiceStatus {
  name: string;
  status: 'healthy' | 'error' | 'warning';
  message: string;
  details?: string;
}

export const ApiStatus: React.FC<ApiStatusProps> = ({ className }) => {
  const [services, setServices] = useState<ServiceStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const { success, error: showError } = useToast();

  const checkApiStatus = async () => {
    setIsLoading(true);
    const newServices: ServiceStatus[] = [];

    try {
      // Check main health
      const healthResponse = await fetch('/api/health');
      if (healthResponse.ok) {
        const healthData = await healthResponse.json();
        newServices.push({
          name: 'Main API',
          status: healthData.status === 'healthy' ? 'healthy' : 'warning',
          message: `Status: ${healthData.status}`,
          details: `Database: ${healthData.database}, AI Services: ${healthData.ai_services}`
        });
      } else {
        newServices.push({
          name: 'Main API',
          status: 'error',
          message: 'API server unreachable',
          details: `Status: ${healthResponse.status}`
        });
      }

      // Check database
      const dbResponse = await fetch('/api/db/test');
      const dbData = await dbResponse.json();
      if (dbResponse.ok && dbData.message.includes('success')) {
        newServices.push({
          name: 'Database',
          status: 'healthy',
          message: 'Connected successfully'
        });
      } else {
        newServices.push({
          name: 'Database',
          status: 'warning',
          message: 'Tables not found',
          details: dbData.error || 'Database needs initialization'
        });
      }

      // Check AI services
      const aiResponse = await fetch('/api/ai/health');
      if (aiResponse.ok) {
        const aiData = await aiResponse.json();
        newServices.push({
          name: 'AI Services',
          status: aiData.status === 'healthy' ? 'healthy' : 'warning',
          message: `Chat: ${aiData.services?.chat_agent}, PDF: ${aiData.services?.pdf_processor}`,
          details: `Maps: ${aiData.maps_providers?.any_available ? 'Available' : 'Unavailable'}`
        });
      } else {
        newServices.push({
          name: 'AI Services',
          status: 'error',
          message: 'AI services unavailable'
        });
      }

    } catch (error) {
      console.error('API Status check failed:', error);
      newServices.push({
        name: 'API Connection',
        status: 'error',
        message: 'Unable to connect to API server',
        details: 'Check if server is running on localhost:8000'
      });
    }

    setServices(newServices);
    setLastChecked(new Date());
    setIsLoading(false);
  };

  useEffect(() => {
    checkApiStatus();
    // Auto-refresh every 30 seconds
    const interval = setInterval(checkApiStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    success('Refreshing API status...', 'Checking all services');
    checkApiStatus();
  };

  const getStatusIcon = (status: ServiceStatus['status']) => {
    switch (status) {
      case 'healthy':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />;
      case 'error':
        return <XCircleIcon className="w-5 h-5 text-red-500" />;
    }
  };

  const getStatusColor = (status: ServiceStatus['status']) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-50 border-green-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'error':
        return 'bg-red-50 border-red-200';
    }
  };

  const overallStatus = services.length === 0 ? 'loading' : 
    services.some(s => s.status === 'error') ? 'error' :
    services.some(s => s.status === 'warning') ? 'warning' : 'healthy';

  return (
    <Card className={className}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          API Status
          {overallStatus !== 'loading' && (
            <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              overallStatus === 'healthy' ? 'bg-green-100 text-green-800' :
              overallStatus === 'warning' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {overallStatus === 'healthy' ? 'All Systems Operational' :
               overallStatus === 'warning' ? 'Some Issues Detected' :
               'Service Unavailable'}
            </span>
          )}
        </h3>
        
        <div className="flex items-center space-x-2">
          {lastChecked && (
            <span className="text-xs text-gray-500">
              Last checked: {lastChecked.toLocaleTimeString()}
            </span>
          )}
          <Button
            onClick={handleRefresh}
            variant="ghost"
            size="sm"
            disabled={isLoading}
            icon={isLoading ? <LoadingSpinner size="xs" /> : undefined}
          >
            {isLoading ? 'Checking...' : 'Refresh'}
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {isLoading && services.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <LoadingSpinner />
            <span className="ml-2 text-gray-600">Checking API status...</span>
          </div>
        ) : (
          services.map((service) => (
            <div
              key={service.name}
              className={`p-3 rounded-lg border ${getStatusColor(service.status)}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(service.status)}
                  <div>
                    <h4 className="font-medium text-gray-900">{service.name}</h4>
                    <p className="text-sm text-gray-600">{service.message}</p>
                    {service.details && (
                      <p className="text-xs text-gray-500 mt-1">{service.details}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {services.some(s => s.status === 'warning' || s.status === 'error') && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-1">💡 Troubleshooting Tips:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            {services.some(s => s.status === 'error') && (
              <li>• Check if API server is running on localhost:8000</li>
            )}
            {services.some(s => s.name === 'Database' && s.status === 'warning') && (
              <li>• Database tables need to be created/migrated</li>
            )}
            {services.some(s => s.name === 'AI Services' && s.status !== 'healthy') && (
              <li>• AI services may need configuration or API keys</li>
            )}
          </ul>
        </div>
      )}
    </Card>
  );
};

export default ApiStatus;
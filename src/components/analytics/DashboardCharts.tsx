'use client';

import React from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { 
  TruckIcon, 
  ClipboardDocumentListIcon,
  CurrencyDollarIcon,
  MapIcon
} from '@heroicons/react/24/outline';
import Card from '@/components/ui/Card';

interface DashboardChartsProps {
  className?: string;
}

const DashboardCharts: React.FC<DashboardChartsProps> = ({ className }) => {
  // Sample data - in a real app, this would come from API
  const dailyTransportData = [
    { date: '01/09', deliveries: 45, revenue: 125000, distance: 850 },
    { date: '02/09', deliveries: 52, revenue: 135000, distance: 920 },
    { date: '03/09', deliveries: 48, revenue: 128000, distance: 880 },
    { date: '04/09', deliveries: 61, revenue: 155000, distance: 1050 },
    { date: '05/09', deliveries: 55, revenue: 145000, distance: 980 },
    { date: '06/09', deliveries: 67, revenue: 168000, distance: 1150 },
    { date: '07/09', deliveries: 58, revenue: 152000, distance: 1020 }
  ];

  const vehicleStatusData = [
    { name: 'Available', value: 12, color: '#10B981' },
    { name: 'In Transit', value: 18, color: '#3B82F6' },
    { name: 'Maintenance', value: 3, color: '#F59E0B' },
    { name: 'Idle', value: 5, color: '#6B7280' }
  ];

  const monthlyPerformance = [
    { month: 'Jul', jobs: 850, completed: 820, revenue: 2800000 },
    { month: 'Aug', jobs: 920, completed: 895, revenue: 3200000 },
    { month: 'Sep', jobs: 1050, completed: 1025, revenue: 3650000 },
    { month: 'Oct', jobs: 980, completed: 950, revenue: 3400000 },
    { month: 'Nov', jobs: 1120, completed: 1090, revenue: 3900000 },
    { month: 'Dec', jobs: 1200, completed: 1180, revenue: 4200000 }
  ];

  const routeEfficiencyData = [
    { route: 'BKK-CNX', trips: 45, avgTime: 8.5, satisfaction: 95 },
    { route: 'BKK-HKT', trips: 38, avgTime: 12.2, satisfaction: 92 },
    { route: 'BKK-HDY', trips: 52, avgTime: 5.8, satisfaction: 97 },
    { route: 'CNX-HKT', trips: 28, avgTime: 15.3, satisfaction: 89 },
    { route: 'BKK-URT', trips: 35, avgTime: 7.2, satisfaction: 94 }
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('th-TH').format(value);
  };

  return (
    <div className={`space-y-4 sm:space-y-6 px-2 sm:px-0 ${className}`}>
      {/* Performance Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Daily Transport Trends */}
        <Card className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 flex items-center mb-2 sm:mb-0">
              <TruckIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-600" />
              Daily Transport Trends
            </h3>
            <div className="text-xs text-gray-500">Last 7 days</div>
          </div>
          <div className="h-48 sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyTransportData}>
                <defs>
                  <linearGradient id="deliveryGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" stroke="#6B7280" fontSize={12} />
                <YAxis stroke="#6B7280" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                  formatter={(value, name) => [
                    name === 'revenue' ? formatCurrency(value as number) : formatNumber(value as number),
                    name === 'deliveries' ? 'Deliveries' : name === 'revenue' ? 'Revenue' : 'Distance (km)'
                  ]}
                />
                <Area 
                  type="monotone" 
                  dataKey="deliveries" 
                  stroke="#3B82F6" 
                  fillOpacity={1} 
                  fill="url(#deliveryGradient)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Vehicle Status Distribution */}
        <Card className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 flex items-center mb-2 sm:mb-0">
              <MapIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-green-600" />
              Vehicle Status
            </h3>
            <div className="text-xs text-gray-500">Real-time</div>
          </div>
          <div className="h-48 sm:h-64 flex flex-col sm:flex-row items-center">
            <div className="w-full sm:w-1/2 h-32 sm:h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={vehicleStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={60}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {vehicleStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [value, 'Vehicles']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full sm:w-1/2 space-y-2 sm:space-y-3 mt-4 sm:mt-0">
              {vehicleStatusData.map((item, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <div className="flex-1 text-sm">
                    <div className="font-medium text-gray-800">{item.name}</div>
                    <div className="text-gray-600">{item.value} vehicles</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Monthly Performance & Route Analysis */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        {/* Monthly Performance */}
        <Card className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 flex items-center mb-2 sm:mb-0">
              <ClipboardDocumentListIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-purple-600" />
              Monthly Performance
            </h3>
            <div className="text-xs text-gray-500">Last 6 months</div>
          </div>
          <div className="h-64 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#6B7280" fontSize={12} />
                <YAxis stroke="#6B7280" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                  formatter={(value, name) => [
                    name === 'revenue' ? formatCurrency(value as number) : formatNumber(value as number),
                    name === 'jobs' ? 'Total Jobs' : name === 'completed' ? 'Completed' : 'Revenue'
                  ]}
                />
                <Legend />
                <Bar dataKey="jobs" fill="#8B5CF6" name="Total Jobs" radius={[4, 4, 0, 0]} />
                <Bar dataKey="completed" fill="#10B981" name="Completed" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Route Efficiency */}
        <Card className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 flex items-center mb-2 sm:mb-0">
              <CurrencyDollarIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-emerald-600" />
              Route Efficiency
            </h3>
            <div className="text-xs text-gray-500">Top routes</div>
          </div>
          <div className="h-64 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={routeEfficiencyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="route" stroke="#6B7280" fontSize={12} />
                <YAxis yAxisId="left" stroke="#6B7280" fontSize={12} />
                <YAxis yAxisId="right" orientation="right" stroke="#6B7280" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                  formatter={(value, name) => [
                    name === 'avgTime' ? `${value}h` : name === 'satisfaction' ? `${value}%` : value,
                    name === 'trips' ? 'Trips' : name === 'avgTime' ? 'Avg Time' : 'Satisfaction'
                  ]}
                />
                <Legend />
                <Line 
                  yAxisId="left" 
                  type="monotone" 
                  dataKey="trips" 
                  stroke="#3B82F6" 
                  strokeWidth={3}
                  dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                  name="Trips"
                />
                <Line 
                  yAxisId="right" 
                  type="monotone" 
                  dataKey="satisfaction" 
                  stroke="#10B981" 
                  strokeWidth={3}
                  dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                  name="Satisfaction %"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Revenue Trend */}
      <Card className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 flex items-center mb-2 sm:mb-0">
            <CurrencyDollarIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-yellow-600" />
            Revenue & Distance Trends
          </h3>
          <div className="text-xs text-gray-500">Weekly overview</div>
        </div>
        <div className="h-48 sm:h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dailyTransportData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" stroke="#6B7280" fontSize={12} />
              <YAxis yAxisId="left" stroke="#6B7280" fontSize={12} />
              <YAxis yAxisId="right" orientation="right" stroke="#6B7280" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
                formatter={(value, name) => [
                  name === 'revenue' ? formatCurrency(value as number) : `${formatNumber(value as number)} km`,
                  name === 'revenue' ? 'Revenue' : 'Distance'
                ]}
              />
              <Legend />
              <Line 
                yAxisId="left" 
                type="monotone" 
                dataKey="revenue" 
                stroke="#F59E0B" 
                strokeWidth={3}
                dot={{ fill: '#F59E0B', strokeWidth: 2, r: 4 }}
                name="Revenue"
              />
              <Line 
                yAxisId="right" 
                type="monotone" 
                dataKey="distance" 
                stroke="#8B5CF6" 
                strokeWidth={3}
                dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
                name="Distance (km)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};

export default DashboardCharts;
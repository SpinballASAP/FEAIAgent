'use client';

import { 
  UsersIcon, 
  TruckIcon, 
  ClipboardDocumentListIcon,
  MapIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';
import ApiStatus from '@/components/api/ApiStatus';
import DashboardCharts from '@/components/analytics/DashboardCharts';

export default function Dashboard() {
  const stats = [
    {
      name: 'Total Customers',
      value: '2,451',
      icon: UsersIcon,
      change: '+4.75%',
      changeType: 'positive',
    },
    {
      name: 'Active Vehicles',
      value: '18',
      icon: TruckIcon,
      change: '+54',
      changeType: 'positive',
    },
    {
      name: 'Pending Jobs',
      value: '24',
      icon: ClipboardDocumentListIcon,
      change: '-1.39%',
      changeType: 'negative',
    },
    {
      name: 'Completed Trips',
      value: '405',
      icon: MapIcon,
      change: '+10.18%',
      changeType: 'positive',
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-6 px-2 sm:px-4 lg:px-0">
      {/* Header */}
      <div className="mb-8 px-2 sm:px-0">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-3">Dashboard</h1>
        <p className="text-lg sm:text-xl text-gray-600">Overview ของระบบ TMS AI Tools</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 px-2 sm:px-0">
        {stats.map((item, index) => (
          <div
            key={item.name}
            className={`relative overflow-hidden rounded-2xl px-4 py-6 sm:px-6 sm:py-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/50 text-white ${
              index === 0 ? 'bg-gradient-to-br from-blue-500 to-blue-600' :
              index === 1 ? 'bg-gradient-to-br from-blue-400 to-blue-500' :
              index === 2 ? 'bg-gradient-to-br from-blue-300 to-blue-400' :
              'bg-gradient-to-br from-slate-500 to-slate-600'
            }`}
          >
            <dt>
              <div className="absolute rounded-2xl bg-white/20 backdrop-blur-sm p-3 sm:p-4 shadow-lg">
                <item.icon className="h-6 w-6 sm:h-8 sm:w-8 text-white drop-shadow-sm" aria-hidden="true" />
              </div>
              <p className="ml-16 sm:ml-20 truncate text-xs sm:text-sm font-semibold text-white/80 tracking-wide uppercase">
                {item.name}
              </p>
            </dt>
            <dd className="ml-16 sm:ml-20 flex items-baseline mt-2">
              <p className="text-2xl sm:text-3xl font-black text-white drop-shadow-sm">{item.value}</p>
              <p
                className={`ml-2 sm:ml-3 flex items-baseline text-xs sm:text-sm font-bold drop-shadow-sm ${
                  item.changeType === 'positive'
                    ? 'text-green-200'
                    : 'text-red-200'
                }`}
              >
                {item.changeType === 'positive' ? (
                  <ArrowTrendingUpIcon
                    className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0 self-center text-green-200 mr-1"
                    aria-hidden="true"
                  />
                ) : (
                  <ArrowTrendingUpIcon
                    className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0 self-center text-red-200 rotate-180 mr-1"
                    aria-hidden="true"
                  />
                )}
                <span className="sr-only">
                  {item.changeType === 'positive' ? 'Increased' : 'Decreased'} by{' '}
                </span>
                <span className="font-black">{item.change}</span>
              </p>
            </dd>
          </div>
        ))}
      </div>

      {/* Analytics Charts */}
      <DashboardCharts />

      {/* Dashboard Content */}
      <div className="grid grid-cols-1 gap-4 lg:gap-6 lg:grid-cols-2 px-2 sm:px-0">
        {/* Recent Activity */}
        <div className="bg-white overflow-hidden shadow-lg rounded-2xl border border-gray-200/50">
          <div className="px-4 py-4 sm:px-6 sm:py-6">
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6 border-b border-gray-100 pb-3">
              Recent Activity
            </h3>
            <div className="space-y-4">
              {[
                { action: 'New customer registered', time: '2 minutes ago', status: 'success' },
                { action: 'Vehicle maintenance completed', time: '1 hour ago', status: 'info' },
                { action: 'Job #1234 completed', time: '3 hours ago', status: 'success' },
                { action: 'Transportation route optimized', time: '5 hours ago', status: 'warning' },
              ].map((activity, index) => (
                <div key={index} className="flex items-center space-x-3 p-2 sm:p-3 rounded-xl hover:bg-blue-50 transition-all duration-200">
                  <div
                    className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full flex-shrink-0 ${
                      activity.status === 'success'
                        ? 'bg-green-500'
                        : activity.status === 'warning'
                        ? 'bg-yellow-500'
                        : 'bg-blue-500'
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{activity.action}</p>
                    <p className="text-xs text-gray-600">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* API Status */}
        <ApiStatus />
      </div>
    </div>
  );
}
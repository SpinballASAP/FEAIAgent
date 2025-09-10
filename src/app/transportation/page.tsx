'use client';

import { useState } from 'react';
import { 
  MagnifyingGlassIcon, 
  PlusIcon, 
  MapIcon,
  TruckIcon,
  BanknotesIcon,
  ClockIcon,
  CalendarDaysIcon
} from '@heroicons/react/24/outline';

export default function TransportationPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');

  // Mock data - will be replaced with API calls
  const transportations = [
    {
      id: 1,
      job_id: 1,
      job: { job_number: 'JOB-2024-001' },
      vehicle_id: 1,
      vehicle: { license_plate: 'กข-1234', brand: 'Isuzu', model: 'NPR' },
      from_location: 'คลังสินค้า CP ลาดพร้าว',
      to_location: '7-Eleven สาขาอโศก',
      distance_km: 15.5,
      transport_cost: 2500.00,
      start_time: '2024-03-15T08:00:00Z',
      end_time: '2024-03-15T10:30:00Z',
      created_at: '2024-03-15T07:45:00Z',
    },
    {
      id: 2,
      job_id: 2,
      job: { job_number: 'JOB-2024-002' },
      vehicle_id: 2,
      vehicle: { license_plate: 'คง-5678', brand: 'Toyota', model: 'Hiace' },
      from_location: 'ตลาดจตุจักร',
      to_location: 'บ้านลูกค้า ถนนรัชดา',
      distance_km: 8.2,
      transport_cost: 800.00,
      start_time: '2024-03-14T14:00:00Z',
      end_time: null,
      created_at: '2024-03-14T13:30:00Z',
    },
    {
      id: 3,
      job_id: 3,
      job: { job_number: 'JOB-2024-003' },
      vehicle_id: 1,
      vehicle: { license_plate: 'กข-1234', brand: 'Isuzu', model: 'NPR' },
      from_location: 'โรงงาน Central',
      to_location: 'Central Plaza ลาดพร้าว',
      distance_km: 22.0,
      transport_cost: 4500.00,
      start_time: '2024-03-13T09:00:00Z',
      end_time: '2024-03-13T12:15:00Z',
      created_at: '2024-03-13T08:30:00Z',
    },
    {
      id: 4,
      job_id: 4,
      job: { job_number: 'JOB-2024-004' },
      vehicle_id: 3,
      vehicle: { license_plate: 'จฉ-9012', brand: 'Honda', model: 'Wave' },
      from_location: 'สำนักงาน CP',
      to_location: 'ธนาคาร กรุงเทพ',
      distance_km: 5.0,
      transport_cost: 150.00,
      start_time: '2024-03-12T11:00:00Z',
      end_time: '2024-03-12T11:45:00Z',
      created_at: '2024-03-12T10:45:00Z',
    },
  ];

  const filteredTransportations = transportations.filter(transport => {
    const matchesSearch = 
      transport.job.job_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transport.vehicle.license_plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transport.from_location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transport.to_location.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Simple date filtering - in real app would use proper date ranges
    const matchesDate = dateFilter === 'all' || true; // Implement actual date filtering
    
    return matchesSearch && matchesDate;
  });

  const getStats = () => {
    const totalTransports = transportations.length;
    const completedTransports = transportations.filter(t => t.end_time).length;
    const totalDistance = transportations.reduce((sum, t) => sum + t.distance_km, 0);
    const totalCost = transportations.reduce((sum, t) => sum + t.transport_cost, 0);
    const avgCostPerKm = totalDistance > 0 ? totalCost / totalDistance : 0;

    return {
      totalTransports,
      completedTransports,
      totalDistance,
      totalCost,
      avgCostPerKm
    };
  };

  const stats = getStats();

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB'
    }).format(amount);
  };

  const calculateDuration = (startTime, endTime) => {
    if (!endTime) return 'กำลังดำเนินการ';
    
    const start = new Date(startTime);
    const end = new Date(endTime);
    const diffMs = end - start;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${diffHours} ชม. ${diffMinutes} นาที`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-gray-800">Transportation</h1>
          <p className="text-xl text-gray-600 mt-1">จัดการการขนส่งและวิเคราะห์ต้นทุน</p>
        </div>
        <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors shadow-lg">
          <PlusIcon className="w-5 h-5" />
          <span>สร้างรายการขนส่ง</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-5 lg:grid-cols-5">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl px-6 py-6 shadow-lg">
          <div className="text-center">
            <MapIcon className="w-8 h-8 mx-auto mb-2" />
            <p className="text-sm font-semibold text-white/80 uppercase tracking-wide">Total Trips</p>
            <p className="text-3xl font-black">{stats.totalTransports}</p>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl px-6 py-6 shadow-lg">
          <div className="text-center">
            <TruckIcon className="w-8 h-8 mx-auto mb-2" />
            <p className="text-sm font-semibold text-white/80 uppercase tracking-wide">Completed</p>
            <p className="text-3xl font-black">{stats.completedTransports}</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl px-6 py-6 shadow-lg">
          <div className="text-center">
            <MapIcon className="w-8 h-8 mx-auto mb-2" />
            <p className="text-sm font-semibold text-white/80 uppercase tracking-wide">Total KM</p>
            <p className="text-3xl font-black">{stats.totalDistance.toFixed(1)}</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white rounded-2xl px-6 py-6 shadow-lg">
          <div className="text-center">
            <BanknotesIcon className="w-8 h-8 mx-auto mb-2" />
            <p className="text-sm font-semibold text-white/80 uppercase tracking-wide">Total Cost</p>
            <p className="text-2xl font-black">{formatCurrency(stats.totalCost).slice(0, -4)}K</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-500 to-slate-600 text-white rounded-2xl px-6 py-6 shadow-lg">
          <div className="text-center">
            <BanknotesIcon className="w-8 h-8 mx-auto mb-2" />
            <p className="text-sm font-semibold text-white/80 uppercase tracking-wide">Avg Cost/KM</p>
            <p className="text-3xl font-black">฿{stats.avgCostPerKm.toFixed(0)}</p>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200/50">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="ค้นหาตามเลขงาน, ทะเบียนรถ, หรือสถานที่..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          >
            <option value="all">วันที่ทั้งหมด</option>
            <option value="today">วันนี้</option>
            <option value="week">สัปดาห์นี้</option>
            <option value="month">เดือนนี้</option>
          </select>
        </div>
      </div>

      {/* Transportation Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-800">รายการการขนส่ง</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  เลขงาน
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ยานพาหนะ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  เส้นทาง
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ระยะทาง
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ค่าใช้จ่าย
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  เวลา
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  สถานะ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  การกระทำ
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTransportations.map((transport) => (
                <tr key={transport.id} className="hover:bg-blue-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-bold text-blue-600">{transport.job.job_number}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-semibold text-gray-900">{transport.vehicle.license_plate}</div>
                      <div className="text-sm text-gray-500">{transport.vehicle.brand} {transport.vehicle.model}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      <div className="flex items-center mb-1">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        <span className="line-clamp-1">{transport.from_location}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                        <span className="line-clamp-1">{transport.to_location}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transport.distance_km} กม.
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    {formatCurrency(transport.transport_cost)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>
                      <div>เริ่ม: {formatDateTime(transport.start_time)}</div>
                      {transport.end_time && (
                        <div>สิ้นสุด: {formatDateTime(transport.end_time)}</div>
                      )}
                      <div className="text-xs text-gray-500 mt-1">
                        ระยะเวลา: {calculateDuration(transport.start_time, transport.end_time)}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                      transport.end_time 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {transport.end_time ? 'เสร็จสิ้น' : 'กำลังดำเนินการ'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-800 mr-4">แก้ไข</button>
                    <button className="text-green-600 hover:text-green-800 mr-4">ดูรายละเอียด</button>
                    <button className="text-red-600 hover:text-red-800">ลบ</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredTransportations.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">ไม่พบข้อมูลการขนส่ง</p>
          </div>
        )}
      </div>
    </div>
  );
}
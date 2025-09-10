'use client';

import { useState } from 'react';
import { 
  MagnifyingGlassIcon, 
  PlusIcon, 
  TruckIcon,
  WrenchScrewdriverIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

export default function VehiclesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock data - will be replaced with API calls
  const vehicles = [
    {
      id: 1,
      license_plate: 'กข-1234',
      vehicle_type: 'truck',
      brand: 'Isuzu',
      model: 'NPR',
      status: 'available',
      driver_name: 'นายสมชาย ขับรถ',
      created_at: '2024-01-15',
    },
    {
      id: 2,
      license_plate: 'คง-5678',
      vehicle_type: 'van',
      brand: 'Toyota',
      model: 'Hiace',
      status: 'in_use',
      driver_name: 'นายสมศักดิ์ ขับแวน',
      created_at: '2024-02-01',
    },
    {
      id: 3,
      license_plate: 'จฉ-9012',
      vehicle_type: 'motorcycle',
      brand: 'Honda',
      model: 'Wave',
      status: 'maintenance',
      driver_name: 'นายสมปอง ขับมอไซค์',
      created_at: '2024-01-20',
    },
    {
      id: 4,
      license_plate: 'ชซ-3456',
      vehicle_type: 'car',
      brand: 'Toyota',
      model: 'Vios',
      status: 'out_of_service',
      driver_name: null,
      created_at: '2024-03-01',
    },
  ];

  const vehicleTypes = {
    truck: 'รถบรรทุก',
    van: 'รถตู้',
    motorcycle: 'รถจักรยานยนต์',
    car: 'รถยนต์'
  };

  const statusLabels = {
    available: 'พร้อมใช้งาน',
    in_use: 'กำลังใช้งาน',
    maintenance: 'ซ่อมบำรุง',
    out_of_service: 'ไม่พร้อมใช้งาน'
  };

  const statusColors = {
    available: 'bg-green-100 text-green-800',
    in_use: 'bg-blue-100 text-blue-800',
    maintenance: 'bg-yellow-100 text-yellow-800',
    out_of_service: 'bg-red-100 text-red-800'
  };

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = 
      vehicle.license_plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (vehicle.driver_name && vehicle.driver_name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || vehicle.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusCounts = () => {
    return {
      total: vehicles.length,
      available: vehicles.filter(v => v.status === 'available').length,
      in_use: vehicles.filter(v => v.status === 'in_use').length,
      maintenance: vehicles.filter(v => v.status === 'maintenance').length,
      out_of_service: vehicles.filter(v => v.status === 'out_of_service').length,
    };
  };

  const statusCounts = getStatusCounts();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-gray-800">Vehicles</h1>
          <p className="text-xl text-gray-600 mt-1">จัดการยานพาหนะ</p>
        </div>
        <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors shadow-lg">
          <PlusIcon className="w-5 h-5" />
          <span>เพิ่มยานพาหนะ</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-5 lg:grid-cols-5">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl px-6 py-6 shadow-lg">
          <div className="text-center">
            <TruckIcon className="w-8 h-8 mx-auto mb-2" />
            <p className="text-sm font-semibold text-white/80 uppercase tracking-wide">Total</p>
            <p className="text-3xl font-black">{statusCounts.total}</p>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl px-6 py-6 shadow-lg">
          <div className="text-center">
            <CheckCircleIcon className="w-8 h-8 mx-auto mb-2" />
            <p className="text-sm font-semibold text-white/80 uppercase tracking-wide">Available</p>
            <p className="text-3xl font-black">{statusCounts.available}</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-400 to-blue-500 text-white rounded-2xl px-6 py-6 shadow-lg">
          <div className="text-center">
            <TruckIcon className="w-8 h-8 mx-auto mb-2" />
            <p className="text-sm font-semibold text-white/80 uppercase tracking-wide">In Use</p>
            <p className="text-3xl font-black">{statusCounts.in_use}</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white rounded-2xl px-6 py-6 shadow-lg">
          <div className="text-center">
            <WrenchScrewdriverIcon className="w-8 h-8 mx-auto mb-2" />
            <p className="text-sm font-semibold text-white/80 uppercase tracking-wide">Maintenance</p>
            <p className="text-3xl font-black">{statusCounts.maintenance}</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 text-white rounded-2xl px-6 py-6 shadow-lg">
          <div className="text-center">
            <ExclamationTriangleIcon className="w-8 h-8 mx-auto mb-2" />
            <p className="text-sm font-semibold text-white/80 uppercase tracking-wide">Out of Service</p>
            <p className="text-3xl font-black">{statusCounts.out_of_service}</p>
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
              placeholder="ค้นหาตามทะเบียน, ยี่ห้อ, รุ่น, หรือชื่อคนขับ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          >
            <option value="all">สถานะทั้งหมด</option>
            <option value="available">พร้อมใช้งาน</option>
            <option value="in_use">กำลังใช้งาน</option>
            <option value="maintenance">ซ่อมบำรุง</option>
            <option value="out_of_service">ไม่พร้อมใช้งาน</option>
          </select>
        </div>
      </div>

      {/* Vehicles Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-800">รายการยานพาหนะ</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ยานพาหนะ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ประเภท
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  คนขับ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  สถานะ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  วันที่สร้าง
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  การกระทำ
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredVehicles.map((vehicle) => (
                <tr key={vehicle.id} className="hover:bg-blue-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-lg font-bold text-gray-900">{vehicle.license_plate}</div>
                      <div className="text-sm text-gray-500">{vehicle.brand} {vehicle.model}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{vehicleTypes[vehicle.vehicle_type]}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">
                      {vehicle.driver_name || '-'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${statusColors[vehicle.status]}`}>
                      {statusLabels[vehicle.status]}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(vehicle.created_at).toLocaleDateString('th-TH')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-800 mr-4">แก้ไข</button>
                    <button className="text-red-600 hover:text-red-800">ลบ</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredVehicles.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">ไม่พบข้อมูลยานพาหนะ</p>
          </div>
        )}
      </div>
    </div>
  );
}
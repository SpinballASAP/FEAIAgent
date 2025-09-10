'use client';

import { useState } from 'react';
import { 
  MagnifyingGlassIcon, 
  PlusIcon, 
  TruckIcon,
  WrenchScrewdriverIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { SkeletonStats, SkeletonTable } from '@/components/ui/Skeleton';
import { LoadingState } from '@/components/ui/LoadingSpinner';
import VehicleModal from '@/components/modals/VehicleModal';
import { useToast } from '@/components/ui/Toast';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import { Vehicle, VehicleType, VehicleStatus } from '@/types/api';

export default function VehiclesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { success, error: showError } = useToast();

  // Mock loading state for demonstration
  const [isLoadingData] = useState(false);

  // Mock data - will be replaced with API calls
  const vehicles: Vehicle[] = [
    {
      id: 1,
      licensePlate: 'กข-1234',
      type: 'truck' as VehicleType,
      capacity: 5.0,
      fuelType: 'diesel',
      year: 2022,
      driverId: 101,
      status: 'available' as VehicleStatus,
      createdAt: '2024-01-15T00:00:00Z',
      updatedAt: '2024-01-15T00:00:00Z',
    },
    {
      id: 2,
      licensePlate: 'คง-5678',
      type: 'van' as VehicleType,
      capacity: 2.0,
      fuelType: 'gasoline',
      year: 2023,
      driverId: 102,
      status: 'in_use' as VehicleStatus,
      createdAt: '2024-02-01T00:00:00Z',
      updatedAt: '2024-02-01T00:00:00Z',
    },
    {
      id: 3,
      licensePlate: 'จฉ-9012',
      type: 'motorcycle' as VehicleType,
      capacity: 0.2,
      fuelType: 'gasoline',
      year: 2021,
      driverId: 103,
      status: 'maintenance' as VehicleStatus,
      createdAt: '2024-01-20T00:00:00Z',
      updatedAt: '2024-01-20T00:00:00Z',
    },
    {
      id: 4,
      licensePlate: 'ชซ-3456',
      type: 'pickup' as VehicleType,
      capacity: 1.5,
      fuelType: 'gasoline',
      year: 2020,
      driverId: 104,
      status: 'inactive' as VehicleStatus,
      createdAt: '2024-03-01T00:00:00Z',
      updatedAt: '2024-03-01T00:00:00Z',
    },
  ];

  const vehicleTypes = {
    truck: 'รถบรรทุก',
    van: 'รถตู้',
    motorcycle: 'รถจักรยานยนต์',
    pickup: 'รถกระบะ',
    trailer: 'รถพ่วง'
  };

  const statusLabels = {
    available: 'พร้อมใช้งาน',
    in_use: 'กำลังใช้งาน',
    maintenance: 'ซ่อมบำรุง',
    inactive: 'ไม่พร้อมใช้งาน'
  };

  const statusColors = {
    available: 'bg-green-100 text-green-800',
    in_use: 'bg-blue-100 text-blue-800',
    maintenance: 'bg-yellow-100 text-yellow-800',
    inactive: 'bg-red-100 text-red-800'
  };

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = 
      vehicle.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.fuelType.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || vehicle.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusCounts = () => {
    return {
      total: vehicles.length,
      available: vehicles.filter(v => v.status === 'available').length,
      in_use: vehicles.filter(v => v.status === 'in_use').length,
      maintenance: vehicles.filter(v => v.status === 'maintenance').length,
      inactive: vehicles.filter(v => v.status === 'inactive').length,
    };
  };

  const statusCounts = getStatusCounts();

  const handleAddVehicle = () => {
    setEditingVehicle(undefined);
    setIsModalOpen(true);
  };

  const handleEditVehicle = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setIsModalOpen(true);
  };

  const handleDeleteVehicle = async (vehicle: Vehicle) => {
    if (confirm(`คุณแน่ใจหรือไม่ที่จะลบยานพาหนะ "${vehicle.licensePlate}"?`)) {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        success('Vehicle deleted successfully', `${vehicle.licensePlate} has been deleted.`);
      } catch (error) {
        showError('Failed to delete vehicle', 'Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSubmitVehicle = async (vehicleData: Partial<Vehicle>) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (editingVehicle) {
        success('Vehicle updated successfully', `${vehicleData.licensePlate} has been updated.`);
      } else {
        success('Vehicle created successfully', `${vehicleData.licensePlate} has been added.`);
      }
      
      setIsModalOpen(false);
    } catch (error) {
      showError('Operation failed', 'Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const statusOptions = [
    { value: 'all', label: 'สถานะทั้งหมด' },
    { value: 'available', label: 'พร้อมใช้งาน' },
    { value: 'in_use', label: 'กำลังใช้งาน' },
    { value: 'maintenance', label: 'ซ่อมบำรุง' },
    { value: 'inactive', label: 'ไม่พร้อมใช้งาน' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-gray-800">Vehicles</h1>
          <p className="text-xl text-gray-600 mt-1">จัดการยานพาหนะ</p>
        </div>
        <Button
          onClick={handleAddVehicle}
          variant="primary"
          icon={<PlusIcon className="w-5 h-5" />}
          disabled={isLoading}
        >
          เพิ่มยานพาหนะ
        </Button>
      </div>

      {/* Stats Cards */}
      {isLoadingData ? (
        <SkeletonStats count={5} />
      ) : (
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
              <p className="text-sm font-semibold text-white/80 uppercase tracking-wide">Inactive</p>
              <p className="text-3xl font-black">{statusCounts.inactive}</p>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200/50">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="ค้นหาตามทะเบียน, ประเภท, หรือเชื้อเพลิง..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              disabled={isLoading}
            />
          </div>
          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            options={statusOptions}
            className="lg:w-48"
          />
        </div>
      </div>

      {/* Vehicles Table */}
      <LoadingState
        isLoading={isLoadingData}
        fallback={<SkeletonTable rows={5} columns={7} />}
      >
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
                    ความจุ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    เชื้อเพลิง
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ปี
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
                {filteredVehicles.map((vehicle) => (
                  <tr key={vehicle.id} className="hover:bg-blue-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-lg font-bold text-gray-900">{vehicle.licensePlate}</div>
                        <div className="text-sm text-gray-500">Driver ID: {vehicle.driverId}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{vehicleTypes[vehicle.type] || vehicle.type}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {vehicle.capacity} ตัน
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                      {vehicle.fuelType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {vehicle.year}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${statusColors[vehicle.status]}`}>
                        {statusLabels[vehicle.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditVehicle(vehicle)}
                          disabled={isLoading}
                          icon={<PencilIcon className="w-4 h-4" />}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteVehicle(vehicle)}
                          disabled={isLoading}
                          className="text-red-600 hover:text-red-800 hover:bg-red-50"
                          icon={<TrashIcon className="w-4 h-4" />}
                        />
                      </div>
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
      </LoadingState>

      {/* Vehicle Modal */}
      <VehicleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitVehicle}
        vehicle={editingVehicle}
        isLoading={isSubmitting}
      />
    </div>
  );
}
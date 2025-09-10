'use client';

import { useState } from 'react';
import { 
  MagnifyingGlassIcon, 
  PlusIcon, 
  MapIcon,
  TruckIcon,
  BanknotesIcon,
  ClockIcon,
  CalendarDaysIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { SkeletonStats, SkeletonTable } from '@/components/ui/Skeleton';
import { LoadingState } from '@/components/ui/LoadingSpinner';
import TransportationModal from '@/components/modals/TransportationModal';
import { useToast } from '@/components/ui/Toast';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import { Transportation, TransportationStatus } from '@/types/api';

export default function TransportationPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransportation, setEditingTransportation] = useState<Transportation | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { success, error: showError } = useToast();

  // Mock loading state for demonstration
  const [isLoadingData] = useState(false);

  // Mock data - will be replaced with API calls
  const transportations: Transportation[] = [
    {
      id: 1,
      jobId: 1,
      vehicleId: 1,
      driverId: 101,
      startDate: '2024-03-15T08:00:00Z',
      endDate: '2024-03-15T10:30:00Z',
      distance: 15.5,
      fuelCost: 800,
      tollCost: 150,
      otherCosts: 300,
      status: 'delivered' as TransportationStatus,
      notes: 'ขนส่งสินค้าจากคลังสินค้า CP ลาดพร้าว ไป 7-Eleven สาขาอโศก',
      createdAt: '2024-03-15T07:45:00Z',
      updatedAt: '2024-03-15T10:30:00Z',
    },
    {
      id: 2,
      jobId: 2,
      vehicleId: 2,
      driverId: 102,
      startDate: '2024-03-14T14:00:00Z',
      endDate: undefined,
      distance: 8.2,
      fuelCost: 400,
      tollCost: 0,
      otherCosts: 100,
      status: 'in_transit' as TransportationStatus,
      notes: 'ขนส่งเฟอร์นิเจอร์จากตลาดจตุจักร ไปบ้านลูกค้า ถนนรัชดา',
      createdAt: '2024-03-14T13:30:00Z',
      updatedAt: '2024-03-14T14:00:00Z',
    },
    {
      id: 3,
      jobId: 3,
      vehicleId: 1,
      driverId: 101,
      startDate: '2024-03-13T09:00:00Z',
      endDate: '2024-03-13T12:15:00Z',
      distance: 22.0,
      fuelCost: 1200,
      tollCost: 200,
      otherCosts: 500,
      status: 'delivered' as TransportationStatus,
      notes: 'ขนส่งชุดเฟอร์นิเจอร์จากโรงงาน Central ไป Central Plaza ลาดพร้าว',
      createdAt: '2024-03-13T08:30:00Z',
      updatedAt: '2024-03-13T12:15:00Z',
    },
    {
      id: 4,
      jobId: 4,
      vehicleId: 3,
      driverId: 103,
      startDate: '2024-03-12T11:00:00Z',
      endDate: '2024-03-12T11:45:00Z',
      distance: 5.0,
      fuelCost: 100,
      tollCost: 0,
      otherCosts: 50,
      status: 'cancelled' as TransportationStatus,
      notes: 'ขนส่งเอกสารจากสำนักงาน CP ไปธนาคาร กรุงเทพ (ยกเลิกเนื่องจากปัญหาด้านเอกสาร)',
      createdAt: '2024-03-12T10:45:00Z',
      updatedAt: '2024-03-12T11:45:00Z',
    },
  ];

  const filteredTransportations = transportations.filter(transport => {
    const matchesSearch = 
      transport.id.toString().includes(searchTerm) ||
      transport.jobId.toString().includes(searchTerm) ||
      transport.vehicleId.toString().includes(searchTerm) ||
      (transport.notes && transport.notes.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Simple date filtering - in real app would use proper date ranges
    const matchesDate = dateFilter === 'all' || true; // Implement actual date filtering
    
    return matchesSearch && matchesDate;
  });

  const getStats = () => {
    const totalTransports = transportations.length;
    const completedTransports = transportations.filter(t => t.status === 'delivered').length;
    const totalDistance = transportations.reduce((sum, t) => sum + (t.distance || 0), 0);
    const totalCost = transportations.reduce((sum, t) => sum + (t.fuelCost + t.tollCost + t.otherCosts), 0);
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

  const handleAddTransportation = () => {
    setEditingTransportation(undefined);
    setIsModalOpen(true);
  };

  const handleEditTransportation = (transportation: Transportation) => {
    setEditingTransportation(transportation);
    setIsModalOpen(true);
  };

  const handleDeleteTransportation = async (transportation: Transportation) => {
    if (confirm(`คุณแน่ใจหรือไม่ที่จะลบรายการขนส่ง #${transportation.id}?`)) {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        success('Transportation deleted successfully', `Transportation #${transportation.id} has been deleted.`);
      } catch (error) {
        showError('Failed to delete transportation', 'Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSubmitTransportation = async (transportationData: Partial<Transportation>) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (editingTransportation) {
        success('Transportation updated successfully', `Transportation #${transportationData.id} has been updated.`);
      } else {
        success('Transportation created successfully', 'New transportation record has been added.');
      }
      
      setIsModalOpen(false);
    } catch (error) {
      showError('Operation failed', 'Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const dateOptions = [
    { value: 'all', label: 'วันที่ทั้งหมด' },
    { value: 'today', label: 'วันนี้' },
    { value: 'week', label: 'สัปดาห์นี้' },
    { value: 'month', label: 'เดือนนี้' },
  ];

  const statusLabels = {
    scheduled: 'กำหนดการ',
    in_transit: 'กำลังขนส่ง',
    delivered: 'ส่งแล้ว',
    cancelled: 'ยกเลิก',
  };

  const statusColors = {
    scheduled: 'bg-yellow-100 text-yellow-800',
    in_transit: 'bg-blue-100 text-blue-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB'
    }).format(amount);
  };

  const calculateDuration = (startTime: string, endTime?: string) => {
    if (!endTime) return 'กำลังดำเนินการ';
    
    const start = new Date(startTime);
    const end = new Date(endTime);
    const diffMs = end.getTime() - start.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${diffHours} ชม. ${diffMinutes} นาที`;
  };

  const getTotalCost = (transport: Transportation) => {
    return transport.fuelCost + transport.tollCost + transport.otherCosts;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-gray-800">Transportation</h1>
          <p className="text-xl text-gray-600 mt-1">จัดการการขนส่งและวิเคราะห์ต้นทุน</p>
        </div>
        <Button
          onClick={handleAddTransportation}
          variant="primary"
          icon={<PlusIcon className="w-5 h-5" />}
          disabled={isLoading}
        >
          สร้างรายการขนส่ง
        </Button>
      </div>

      {/* Stats Cards */}
      {isLoadingData ? (
        <SkeletonStats count={5} />
      ) : (
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
              <p className="text-2xl font-black">฿{(stats.totalCost / 1000).toFixed(1)}K</p>
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
      )}

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200/50">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="ค้นหาตามรหัสงาน, รหัสยานพาหนะ, หรือหมายเหตุ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              disabled={isLoading}
            />
          </div>
          <Select
            value={dateFilter}
            onChange={setDateFilter}
            options={dateOptions}
            className="lg:w-48"
          />
        </div>
      </div>

      {/* Transportation Table */}
      <LoadingState
        isLoading={isLoadingData}
        fallback={<SkeletonTable rows={5} columns={8} />}
      >
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-xl font-bold text-gray-800">รายการการขนส่ง</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    รหัส
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    รายละเอียด
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
                      <div>
                        <div className="text-sm font-bold text-blue-600">#{transport.id}</div>
                        <div className="text-xs text-gray-500">Job: {transport.jobId}</div>
                        <div className="text-xs text-gray-500">Vehicle: {transport.vehicleId}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs">
                        <div className="line-clamp-2">
                          {transport.notes || 'ไม่มีรายละเอียด'}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Driver: {transport.driverId}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {transport.distance ? `${transport.distance} กม.` : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        <div className="font-semibold text-gray-900">
                          {formatCurrency(getTotalCost(transport))}
                        </div>
                        <div className="text-xs text-gray-500">
                          เชื้อเพลิง: ฿{transport.fuelCost}
                        </div>
                        <div className="text-xs text-gray-500">
                          ค่าทางด่วน: ฿{transport.tollCost}
                        </div>
                        <div className="text-xs text-gray-500">
                          อื่นๆ: ฿{transport.otherCosts}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>
                        <div className="text-xs">เริ่ม: {formatDateTime(transport.startDate)}</div>
                        {transport.endDate && (
                          <div className="text-xs">สิ้นสุด: {formatDateTime(transport.endDate)}</div>
                        )}
                        <div className="text-xs text-gray-500 mt-1">
                          ระยะเวลา: {calculateDuration(transport.startDate, transport.endDate)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${statusColors[transport.status]}`}>
                        {statusLabels[transport.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditTransportation(transport)}
                          disabled={isLoading}
                          icon={<PencilIcon className="w-4 h-4" />}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => alert('View detail feature coming soon!')}
                          disabled={isLoading}
                          className="text-green-600 hover:text-green-800 hover:bg-green-50"
                          icon={<EyeIcon className="w-4 h-4" />}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteTransportation(transport)}
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

          {filteredTransportations.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">ไม่พบข้อมูลการขนส่ง</p>
            </div>
          )}
        </div>
      </LoadingState>

      {/* Transportation Modal */}
      <TransportationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitTransportation}
        transportation={editingTransportation}
        isLoading={isSubmitting}
      />
    </div>
  );
}
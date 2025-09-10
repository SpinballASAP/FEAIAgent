'use client';

import { useState } from 'react';
import { 
  MagnifyingGlassIcon, 
  PlusIcon, 
  ClipboardDocumentListIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationCircleIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { SkeletonStats, SkeletonTable } from '@/components/ui/Skeleton';
import { LoadingState } from '@/components/ui/LoadingSpinner';
import JobModal from '@/components/modals/JobModal';
import { useToast } from '@/components/ui/Toast';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import { Job, JobStatus, JobPriority } from '@/types/api';

export default function JobsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { success, error: showError } = useToast();

  // Mock loading state for demonstration
  const [isLoadingData] = useState(false);

  // Mock data - will be replaced with API calls
  const jobs: Job[] = [
    {
      id: 1,
      title: 'ขนส่งสินค้าจากคลังสินค้าไปยังสาขา',
      description: 'ขนส่งสินค้าประเภทอาหารแห้งจากคลังสินค้าหลักไปยังสาขา 7-Eleven ทั่วกรุงเทพฯ',
      customerId: 1,
      pickupAddress: '123 ถนนรัชดาภิเษก แขวงห้วยขวาง เขตห้วยขวาง กรุงเทพมหานคร 10310',
      deliveryAddress: '456 ถนนสุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพมหานคร 10110',
      pickupDate: '2024-03-15T08:00:00Z',
      deliveryDate: '2024-03-15T16:00:00Z',
      weight: 500.0,
      value: 50000,
      priority: 'high' as JobPriority,
      status: 'pending' as JobStatus,
      specialInstructions: 'ระวังการขนถ่ายสินค้าเสียหาย',
      createdAt: '2024-03-15T08:00:00Z',
      updatedAt: '2024-03-15T08:00:00Z',
    },
    {
      id: 2,
      title: 'ส่งของถึงบ้าน',
      description: 'ขนส่งเฟอร์นิเจอร์ไปยังบ้านลูกค้า',
      customerId: 2,
      pickupAddress: '789 ถนนพระราม 4 แขวงสุริยวงศ์ เขตบางรัก กรุงเทพมหานคร 10500',
      deliveryAddress: '321 ถนนลาดพร้าว แขวงลาดพร้าว เขตลาดพร้าว กรุงเทพมหานคร 10230',
      pickupDate: '2024-03-14T10:30:00Z',
      deliveryDate: '2024-03-14T15:00:00Z',
      weight: 200.0,
      value: 25000,
      priority: 'normal' as JobPriority,
      status: 'in_progress' as JobStatus,
      specialInstructions: 'ขนถ่ายที่ชั้น 3 ไม่มีลิฟต์',
      createdAt: '2024-03-14T10:30:00Z',
      updatedAt: '2024-03-15T09:15:00Z',
    },
    {
      id: 3,
      title: 'ขนส่งเฟอร์นิเจอร์ไปยังร้านใหม่',
      description: 'ขนส่งชุดเฟอร์นิเจอร์สำหรับการตกแต่งร้านใหม่',
      customerId: 3,
      pickupAddress: '555 ถนนพหลโยธิน แขวงสามเสนใน เขตพญาไท กรุงเทพมหานคร 10400',
      deliveryAddress: '777 ถนนสีลม แขวงสีลม เขตบางรัก กรุงเทพมหานคร 10500',
      pickupDate: '2024-03-13T14:00:00Z',
      deliveryDate: '2024-03-13T18:00:00Z',
      weight: 800.0,
      value: 100000,
      priority: 'low' as JobPriority,
      status: 'completed' as JobStatus,
      createdAt: '2024-03-13T14:00:00Z',
      updatedAt: '2024-03-14T16:30:00Z',
    },
    {
      id: 4,
      title: 'ขนส่งสินค้าเสียหาย - ยกเลิก',
      description: 'งานที่ต้องยกเลิกเนื่องจากสินค้ามีความเสียหาย',
      customerId: 1,
      pickupAddress: '123 ถนนรัชดาภิเษก แขวงห้วยขวาง เขตห้วยขวาง กรุงเทพมหานคร 10310',
      deliveryAddress: '999 ถนนเพชรบุรี แขวงมักกะสัน เขตราชเทวี กรุงเทพมหานคร 10400',
      pickupDate: '2024-03-12T11:00:00Z',
      weight: 100.0,
      value: 10000,
      priority: 'urgent' as JobPriority,
      status: 'cancelled' as JobStatus,
      specialInstructions: 'ยกเลิกเนื่องจากสินค้าเสียหาย',
      createdAt: '2024-03-12T11:00:00Z',
      updatedAt: '2024-03-12T15:00:00Z',
    },
  ];

  const statusLabels = {
    pending: 'รอดำเนินการ',
    assigned: 'มอบหมายแล้ว',
    in_progress: 'กำลังดำเนินการ',
    completed: 'เสร็จสิ้น',
    cancelled: 'ยกเลิก'
  };

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    assigned: 'bg-purple-100 text-purple-800',
    in_progress: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
  };

  const priorityLabels = {
    low: 'ต่ำ',
    normal: 'ปานกลาง',
    high: 'สูง',
    urgent: 'เร่งด่วน'
  };

  const priorityColors = {
    low: 'bg-gray-100 text-gray-800',
    normal: 'bg-blue-100 text-blue-800',
    high: 'bg-orange-100 text-orange-800',
    urgent: 'bg-red-100 text-red-800'
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.id.toString().includes(searchTerm);
    
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || job.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusCounts = () => {
    return {
      total: jobs.length,
      pending: jobs.filter(j => j.status === 'pending').length,
      in_progress: jobs.filter(j => j.status === 'in_progress').length,
      completed: jobs.filter(j => j.status === 'completed').length,
      cancelled: jobs.filter(j => j.status === 'cancelled').length,
    };
  };

  const statusCounts = getStatusCounts();

  const handleAddJob = () => {
    setEditingJob(undefined);
    setIsModalOpen(true);
  };

  const handleEditJob = (job: Job) => {
    setEditingJob(job);
    setIsModalOpen(true);
  };

  const handleDeleteJob = async (job: Job) => {
    if (confirm(`คุณแน่ใจหรือไม่ที่จะลบงาน "${job.title}"?`)) {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        success('Job deleted successfully', `${job.title} has been deleted.`);
      } catch (error) {
        showError('Failed to delete job', 'Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSubmitJob = async (jobData: Partial<Job>) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (editingJob) {
        success('Job updated successfully', `${jobData.title} has been updated.`);
      } else {
        success('Job created successfully', `${jobData.title} has been added.`);
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
    { value: 'pending', label: 'รอดำเนินการ' },
    { value: 'assigned', label: 'มอบหมายแล้ว' },
    { value: 'in_progress', label: 'กำลังดำเนินการ' },
    { value: 'completed', label: 'เสร็จสิ้น' },
    { value: 'cancelled', label: 'ยกเลิก' },
  ];

  const priorityOptions = [
    { value: 'all', label: 'ความสำคัญทั้งหมด' },
    { value: 'low', label: 'ต่ำ' },
    { value: 'normal', label: 'ปานกลาง' },
    { value: 'high', label: 'สูง' },
    { value: 'urgent', label: 'เร่งด่วน' },
  ];

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-gray-800">Jobs</h1>
          <p className="text-xl text-gray-600 mt-1">จัดการงาน/ออเดอร์</p>
        </div>
        <Button
          onClick={handleAddJob}
          variant="primary"
          icon={<PlusIcon className="w-5 h-5" />}
          disabled={isLoading}
        >
          สร้างงานใหม่
        </Button>
      </div>

      {/* Stats Cards */}
      {isLoadingData ? (
        <SkeletonStats count={5} />
      ) : (
        <div className="grid grid-cols-2 gap-5 lg:grid-cols-5">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl px-6 py-6 shadow-lg">
            <div className="text-center">
              <ClipboardDocumentListIcon className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm font-semibold text-white/80 uppercase tracking-wide">Total</p>
              <p className="text-3xl font-black">{statusCounts.total}</p>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white rounded-2xl px-6 py-6 shadow-lg">
            <div className="text-center">
              <ClockIcon className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm font-semibold text-white/80 uppercase tracking-wide">Pending</p>
              <p className="text-3xl font-black">{statusCounts.pending}</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-400 to-blue-500 text-white rounded-2xl px-6 py-6 shadow-lg">
            <div className="text-center">
              <ExclamationCircleIcon className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm font-semibold text-white/80 uppercase tracking-wide">In Progress</p>
              <p className="text-3xl font-black">{statusCounts.in_progress}</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl px-6 py-6 shadow-lg">
            <div className="text-center">
              <CheckCircleIcon className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm font-semibold text-white/80 uppercase tracking-wide">Completed</p>
              <p className="text-3xl font-black">{statusCounts.completed}</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-500 to-red-600 text-white rounded-2xl px-6 py-6 shadow-lg">
            <div className="text-center">
              <XCircleIcon className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm font-semibold text-white/80 uppercase tracking-wide">Cancelled</p>
              <p className="text-3xl font-black">{statusCounts.cancelled}</p>
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
              placeholder="ค้นหาตามชื่องาน, รายละเอียด, หรือรหัสงาน..."
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
          <Select
            value={priorityFilter}
            onChange={setPriorityFilter}
            options={priorityOptions}
            className="lg:w-48"
          />
        </div>
      </div>

      {/* Jobs Table */}
      <LoadingState
        isLoading={isLoadingData}
        fallback={<SkeletonTable rows={5} columns={7} />}
      >
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-xl font-bold text-gray-800">รายการงาน</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    งาน
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    รายละเอียด
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    น้ำหนัก/มูลค่า
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ความสำคัญ
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
                {filteredJobs.map((job) => (
                  <tr key={job.id} className="hover:bg-blue-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-bold text-blue-600">#{job.id}</div>
                        <div className="text-sm font-semibold text-gray-900">{job.title}</div>
                        <div className="text-xs text-gray-500">Customer ID: {job.customerId}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 line-clamp-2 max-w-xs">
                        {job.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div>{job.weight ? `${job.weight} kg` : '-'}</div>
                        <div className="text-xs text-gray-500">
                          {job.value ? `฿${job.value.toLocaleString()}` : '-'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${priorityColors[job.priority]}`}>
                        {priorityLabels[job.priority]}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${statusColors[job.status]}`}>
                        {statusLabels[job.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDateTime(job.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditJob(job)}
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
                          onClick={() => handleDeleteJob(job)}
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

          {filteredJobs.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">ไม่พบข้อมูลงาน</p>
            </div>
          )}
        </div>
      </LoadingState>

      {/* Job Modal */}
      <JobModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitJob}
        job={editingJob}
        isLoading={isSubmitting}
      />
    </div>
  );
}
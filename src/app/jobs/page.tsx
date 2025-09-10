'use client';

import { useState } from 'react';
import { 
  MagnifyingGlassIcon, 
  PlusIcon, 
  ClipboardDocumentListIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';

export default function JobsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  // Mock data - will be replaced with API calls
  const jobs = [
    {
      id: 1,
      job_number: 'JOB-2024-001',
      customer_id: 1,
      customer: { name: 'บริษัท ซีพี ออล จำกัด', company: 'CP ALL' },
      description: 'ขนส่งสินค้าจากคลังสินค้าไปยังสาขา',
      status: 'pending',
      priority: 'high',
      created_at: '2024-03-15T08:00:00Z',
      updated_at: '2024-03-15T08:00:00Z',
      completed_at: null,
    },
    {
      id: 2,
      job_number: 'JOB-2024-002',
      customer_id: 2,
      customer: { name: 'นายสมชาย ใจดี', company: 'บุคคลธรรมดา' },
      description: 'ส่งของถึงบ้าน',
      status: 'in_progress',
      priority: 'medium',
      created_at: '2024-03-14T10:30:00Z',
      updated_at: '2024-03-15T09:15:00Z',
      completed_at: null,
    },
    {
      id: 3,
      job_number: 'JOB-2024-003',
      customer_id: 3,
      customer: { name: 'บริษัท เซ็นทรัล รีเทล คอร์ปอเรชั่น จำกัด', company: 'Central Retail' },
      description: 'ขนส่งเฟอร์นิเจอร์ไปยังร้านใหม่',
      status: 'completed',
      priority: 'low',
      created_at: '2024-03-13T14:00:00Z',
      updated_at: '2024-03-14T16:30:00Z',
      completed_at: '2024-03-14T16:30:00Z',
    },
    {
      id: 4,
      job_number: 'JOB-2024-004',
      customer_id: 1,
      customer: { name: 'บริษัท ซีพี ออล จำกัด', company: 'CP ALL' },
      description: 'ขนส่งสินค้าเสียหาย - ยกเลิก',
      status: 'cancelled',
      priority: 'urgent',
      created_at: '2024-03-12T11:00:00Z',
      updated_at: '2024-03-12T15:00:00Z',
      completed_at: null,
    },
  ];

  const statusLabels = {
    pending: 'รอดำเนินการ',
    in_progress: 'กำลังดำเนินการ',
    completed: 'เสร็จสิ้น',
    cancelled: 'ยกเลิก'
  };

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    in_progress: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
  };

  const priorityLabels = {
    low: 'ต่ำ',
    medium: 'ปานกลาง',
    high: 'สูง',
    urgent: 'เร่งด่วน'
  };

  const priorityColors = {
    low: 'bg-gray-100 text-gray-800',
    medium: 'bg-blue-100 text-blue-800',
    high: 'bg-orange-100 text-orange-800',
    urgent: 'bg-red-100 text-red-800'
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = 
      job.job_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase());
    
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

  const formatDateTime = (dateString) => {
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
        <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors shadow-lg">
          <PlusIcon className="w-5 h-5" />
          <span>สร้างงานใหม่</span>
        </button>
      </div>

      {/* Stats Cards */}
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

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200/50">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="ค้นหาตามเลขงาน, ลูกค้า, หรือรายละเอียด..."
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
            <option value="pending">รอดำเนินการ</option>
            <option value="in_progress">กำลังดำเนินการ</option>
            <option value="completed">เสร็จสิ้น</option>
            <option value="cancelled">ยกเลิก</option>
          </select>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          >
            <option value="all">ความสำคัญทั้งหมด</option>
            <option value="low">ต่ำ</option>
            <option value="medium">ปานกลาง</option>
            <option value="high">สูง</option>
            <option value="urgent">เร่งด่วน</option>
          </select>
        </div>
      </div>

      {/* Jobs Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-800">รายการงาน</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  เลขงาน
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ลูกค้า
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  รายละเอียด
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
                    <div className="text-sm font-bold text-blue-600">{job.job_number}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-semibold text-gray-900">{job.customer.name}</div>
                      <div className="text-sm text-gray-500">{job.customer.company}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 line-clamp-2">{job.description}</div>
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
                    {formatDateTime(job.created_at)}
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

        {filteredJobs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">ไม่พบข้อมูลงาน</p>
          </div>
        )}
      </div>
    </div>
  );
}
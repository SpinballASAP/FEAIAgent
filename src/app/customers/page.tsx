'use client';

import { useState } from 'react';
import { 
  MagnifyingGlassIcon, 
  PlusIcon, 
  PhoneIcon,
  MapPinIcon,
  BuildingOfficeIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { SkeletonStats, SkeletonTable } from '@/components/ui/Skeleton';
import { LoadingState } from '@/components/ui/LoadingSpinner';
import CustomerModal from '@/components/modals/CustomerModal';
import { useToast } from '@/components/ui/Toast';
import Button from '@/components/ui/Button';
import { Customer } from '@/types/api';

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { success, error: showError } = useToast();

  // Mock loading state for demonstration
  const [isLoadingData] = useState(false);

  // Mock data - will be replaced with API calls
  const customers: Customer[] = [
    {
      id: 1,
      name: 'บริษัท ซีพี ออล จำกัด',
      email: 'contact@cpall.co.th',
      phone: '02-123-4567',
      address: '313 ถนนสีลม แขวงสีลม เขตบางรัก กรุงเทพมหานคร 10500',
      creditLimit: 1000000,
      status: 'active',
      createdAt: '2024-01-15T00:00:00Z',
      updatedAt: '2024-01-15T00:00:00Z',
    },
    {
      id: 2,
      name: 'นายสมชาย ใจดี',
      email: 'somchai@email.com',
      phone: '08-123-4567',
      address: '123 ถนนรัชดาภิเษก แขวงห้วยขวาง เขตห้วยขวาง กรุงเทพมหานคร 10310',
      creditLimit: 500000,
      status: 'active',
      createdAt: '2024-02-20T00:00:00Z',
      updatedAt: '2024-02-20T00:00:00Z',
    },
    {
      id: 3,
      name: 'บริษัท เซ็นทรัล รีเทล คอร์ปอเรชั่น จำกัด',
      email: 'info@central.co.th',
      phone: '02-987-6543',
      address: '4, 4/1-4/2, 4/4 ถนนราชดำริ แขวงลุมพินี เขตปทุมวัน กรุงเทพมหานคร 10330',
      creditLimit: 2000000,
      status: 'inactive',
      createdAt: '2024-01-10T00:00:00Z',
      updatedAt: '2024-01-10T00:00:00Z',
    },
  ];

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddCustomer = () => {
    setEditingCustomer(undefined);
    setIsModalOpen(true);
  };

  const handleEditCustomer = (customer: Customer) => {
    setEditingCustomer(customer);
    setIsModalOpen(true);
  };

  const handleDeleteCustomer = async (customer: Customer) => {
    if (confirm(`คุณแน่ใจหรือไม่ที่จะลบลูกค้า "${customer.name}"?`)) {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        success('Customer deleted successfully', `${customer.name} has been deleted.`);
      } catch (error) {
        showError('Failed to delete customer', 'Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSubmitCustomer = async (customerData: Partial<Customer>) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (editingCustomer) {
        success('Customer updated successfully', `${customerData.name} has been updated.`);
      } else {
        success('Customer created successfully', `${customerData.name} has been added.`);
      }
      
      setIsModalOpen(false);
    } catch (error) {
      showError('Operation failed', 'Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-gray-800">Customers</h1>
          <p className="text-xl text-gray-600 mt-1">จัดการข้อมูลลูกค้า</p>
        </div>
        <Button
          onClick={handleAddCustomer}
          variant="primary"
          icon={<PlusIcon className="w-5 h-5" />}
          disabled={isLoading}
        >
          เพิ่มลูกค้าใหม่
        </Button>
      </div>

      {/* Stats Cards */}
      {isLoadingData ? (
        <SkeletonStats count={3} />
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl px-6 py-6 shadow-lg">
            <div className="flex items-center">
              <div className="p-3 bg-white/20 rounded-xl">
                <BuildingOfficeIcon className="w-8 h-8" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-semibold text-white/80 uppercase tracking-wide">Total Customers</p>
                <p className="text-3xl font-black">{customers.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl px-6 py-6 shadow-lg">
            <div className="flex items-center">
              <div className="p-3 bg-white/20 rounded-xl">
                <BuildingOfficeIcon className="w-8 h-8" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-semibold text-white/80 uppercase tracking-wide">Active</p>
                <p className="text-3xl font-black">{customers.filter(c => c.status === 'active').length}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-500 to-slate-600 text-white rounded-2xl px-6 py-6 shadow-lg">
            <div className="flex items-center">
              <div className="p-3 bg-white/20 rounded-xl">
                <BuildingOfficeIcon className="w-8 h-8" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-semibold text-white/80 uppercase tracking-wide">Inactive</p>
                <p className="text-3xl font-black">{customers.filter(c => c.status === 'inactive').length}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200/50">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="ค้นหาตามชื่อ, โทรศัพท์, หรืออีเมล..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Customers Table */}
      <LoadingState
        isLoading={isLoadingData}
        fallback={<SkeletonTable rows={5} columns={6} />}
      >
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-xl font-bold text-gray-800">รายการลูกค้า</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ลูกค้า
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ติดต่อ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ที่อยู่
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    วงเงิน
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
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-blue-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-semibold text-gray-900">{customer.name}</div>
                        <div className="text-sm text-gray-500">{customer.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <PhoneIcon className="w-4 h-4 mr-2 text-gray-400" />
                        {customer.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-start text-sm text-gray-900">
                        <MapPinIcon className="w-4 h-4 mr-2 text-gray-400 mt-0.5 flex-shrink-0" />
                        <span className="line-clamp-2">{customer.address}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ฿{customer.creditLimit.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                        customer.status === 'active'
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {customer.status === 'active' ? 'ใช้งาน' : 'ไม่ใช้งาน'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditCustomer(customer)}
                          disabled={isLoading}
                          icon={<PencilIcon className="w-4 h-4" />}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteCustomer(customer)}
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

          {filteredCustomers.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">ไม่พบข้อมูลลูกค้า</p>
            </div>
          )}
        </div>
      </LoadingState>

      {/* Customer Modal */}
      <CustomerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitCustomer}
        customer={editingCustomer}
        isLoading={isSubmitting}
      />
    </div>
  );
}
'use client';

import React, { useState, useEffect } from 'react';
import { 
  Bars3Icon,
  XMarkIcon,
  UsersIcon,
  TruckIcon,
  ClipboardDocumentListIcon,
  MapIcon,
  SparklesIcon,
  MicrophoneIcon,
  DocumentTextIcon,
  CalculatorIcon,
  CogIcon,
  ChartBarIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  PhoneIcon,
  MapPinIcon,
  BellIcon
} from '@heroicons/react/24/outline';
import { usePathname, useRouter } from 'next/navigation';
import Button from './Button';
import Card from './Card';
import ApiResultModal from './ApiResultModal';
import { usePageContext } from '@/hooks/usePageContext';

interface FloatingMenuProps {
  className?: string;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  description: string;
  action: () => void;
  color: string;
  category: 'navigation' | 'ai' | 'data' | 'tools';
}

export const FloatingMenu: React.FC<FloatingMenuProps> = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState<{
    title: string;
    endpoint: string;
    method: string;
    result?: any;
    error?: string;
    loading?: boolean;
  } | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const pageContext = usePageContext();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    setActiveCategory(null);
  };

  // Keyboard shortcut to toggle menu (Alt+M)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.altKey && event.key === 'm') {
        event.preventDefault();
        toggleMenu();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
    setActiveCategory(null);
  }, [pathname]);

  const handleApiCall = async (title: string, endpoint: string, method: string = 'GET', data?: any) => {
    // เปิด modal และแสดง loading
    setModalData({
      title,
      endpoint,
      method,
      loading: true
    });
    setModalOpen(true);
    setIsOpen(false);

    try {
      const options: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
      };
      
      if (data && method !== 'GET') {
        options.body = JSON.stringify(data);
      }

      const response = await fetch(`http://localhost:8000${endpoint}`, options);
      
      let result;
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        result = await response.json();
      } else {
        result = await response.text();
      }
      
      // อัปเดต modal ด้วยผลลัพธ์
      setModalData({
        title,
        endpoint,
        method,
        result,
        loading: false
      });
    } catch (error) {
      console.error('API Error:', error);
      
      // อัปเดต modal ด้วย error
      setModalData({
        title,
        endpoint,
        method,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        loading: false
      });
    }
  };

  const menuItems: MenuItem[] = [
    // Navigation Category
    {
      id: 'nav-dashboard',
      label: 'Dashboard',
      icon: ChartBarIcon,
      description: 'ไปยังหน้าแดชบอร์ด',
      action: () => router.push('/'),
      color: 'bg-blue-500',
      category: 'navigation'
    },
    {
      id: 'nav-customers',
      label: 'Customers',
      icon: UsersIcon,
      description: 'จัดการลูกค้า',
      action: () => router.push('/customers'),
      color: 'bg-green-500',
      category: 'navigation'
    },
    {
      id: 'nav-vehicles',
      label: 'Vehicles',
      icon: TruckIcon,
      description: 'จัดการยานพาหนะ',
      action: () => router.push('/vehicles'),
      color: 'bg-orange-500',
      category: 'navigation'
    },
    {
      id: 'nav-jobs',
      label: 'Jobs',
      icon: ClipboardDocumentListIcon,
      description: 'จัดการงานขนส่ง',
      action: () => router.push('/jobs'),
      color: 'bg-purple-500',
      category: 'navigation'
    },
    {
      id: 'nav-transportation',
      label: 'Transportation',
      icon: MapIcon,
      description: 'จัดการการขนส่ง',
      action: () => router.push('/transportation'),
      color: 'bg-indigo-500',
      category: 'navigation'
    },
    {
      id: 'nav-route-planning',
      label: 'Route Planning',
      icon: MapPinIcon,
      description: 'วางแผนเส้นทางและคำนวณระยะทาง',
      action: () => router.push('/route-planning'),
      color: 'bg-teal-500',
      category: 'navigation'
    },
    {
      id: 'nav-ai-tools',
      label: 'AI Tools',
      icon: SparklesIcon,
      description: 'เครื่องมือ AI สำหรับประมวลผลเสียงและเอกสาร',
      action: () => router.push('/ai-tools'),
      color: 'bg-pink-500',
      category: 'navigation'
    },

    // AI Tools Category
    {
      id: 'ai-chat',
      label: 'AI Chat',
      icon: SparklesIcon,
      description: 'เริ่มสนทนากับ AI',
      action: () => {
        const event = new CustomEvent('ai-quick-action', { 
          detail: { message: 'สวัสดีครับ ผมต้องการความช่วยเหลือ' }
        });
        window.dispatchEvent(event);
      },
      color: 'bg-blue-600',
      category: 'ai'
    },
    {
      id: 'ai-voice',
      label: 'Voice Chat',
      icon: MicrophoneIcon,
      description: 'สนทนาด้วยเสียง',
      action: () => handleApiCall('Voice Capabilities', '/api/ai/voice/capabilities'),
      color: 'bg-red-500',
      category: 'ai'
    },
    {
      id: 'ai-distance',
      label: 'Calculate Distance',
      icon: CalculatorIcon,
      description: 'คำนวณระยะทาง',
      action: () => handleApiCall('Calculate Distance', '/api/ai/distance/calculate', 'POST', {
        origin_address: 'กรุงเทพมหานคร',
        destination_address: 'เชียงใหม่',
        vehicle_type: 'truck'
      }),
      color: 'bg-yellow-500',
      category: 'ai'
    },
    {
      id: 'ai-route',
      label: 'Optimize Route',
      icon: MapPinIcon,
      description: 'ปรับปรุงเส้นทาง',
      action: () => handleApiCall('Optimize Route', '/api/ai/route/optimize', 'POST', {
        waypoints: ['กรุงเทพมหานคร', 'นครสวรรค์', 'เชียงใหม่'],
        vehicle_type: 'truck'
      }),
      color: 'bg-emerald-500',
      category: 'ai'
    },
    {
      id: 'ai-pdf',
      label: 'Process PDF',
      icon: DocumentTextIcon,
      description: 'ประมวลผลเอกสาร PDF',
      action: () => handleApiCall('Process PDF', '/api/ai/pdf/process', 'POST', {
        action: 'analyze',
        content: 'Sample PDF content for analysis'
      }),
      color: 'bg-rose-500',
      category: 'ai'
    },

    // Data Management Category
    {
      id: 'data-add-customer',
      label: 'Add Customer',
      icon: PlusIcon,
      description: 'เพิ่มลูกค้าใหม่',
      action: () => handleApiCall('Add Customer', '/api/customers/', 'POST', {
        name: 'John Doe',
        phone: '0812345678',
        email: 'john@example.com',
        address: 'Bangkok, Thailand'
      }),
      color: 'bg-green-600',
      category: 'data'
    },
    {
      id: 'data-search-customer',
      label: 'Search Customer',
      icon: MagnifyingGlassIcon,
      description: 'ค้นหาลูกค้าด้วยเบอร์โทร',
      action: () => handleApiCall('Search Customer', '/api/customers/search/by-phone/0812345678'),
      color: 'bg-blue-600',
      category: 'data'
    },
    {
      id: 'data-add-vehicle',
      label: 'Add Vehicle',
      icon: PlusIcon,
      description: 'เพิ่มยานพาหนะใหม่',
      action: () => handleApiCall('Add Vehicle', '/api/vehicles/', 'POST', {
        license_plate: 'ABC-1234',
        vehicle_type: 'truck',
        capacity: 1000,
        status: 'available'
      }),
      color: 'bg-orange-600',
      category: 'data'
    },
    {
      id: 'data-available-vehicles',
      label: 'Available Vehicles',
      icon: TruckIcon,
      description: 'ดูรถที่ว่าง',
      action: () => handleApiCall('Available Vehicles', '/api/vehicles/available/'),
      color: 'bg-green-600',
      category: 'data'
    },
    {
      id: 'data-dashboard-stats',
      label: 'Dashboard Stats',
      icon: ChartBarIcon,
      description: 'ดูสถิติแดชบอร์ด',
      action: () => handleApiCall('Dashboard Stats', '/api/transportations/stats/dashboard'),
      color: 'bg-indigo-600',
      category: 'data'
    },

    // Tools Category
    {
      id: 'tool-health-check',
      label: 'Health Check',
      icon: BellIcon,
      description: 'ตรวจสอบสถานะระบบ',
      action: () => handleApiCall('Health Check', '/health'),
      color: 'bg-green-500',
      category: 'tools'
    },
    {
      id: 'tool-ai-capabilities',
      label: 'AI Capabilities',
      icon: CogIcon,
      description: 'ดูความสามารถ AI',
      action: () => handleApiCall('AI Capabilities', '/api/ai/capabilities'),
      color: 'bg-purple-600',
      category: 'tools'
    },
    {
      id: 'tool-voice-languages',
      label: 'Voice Languages',
      icon: MicrophoneIcon,
      description: 'ภาษาที่รองรับ Voice AI',
      action: () => handleApiCall('Voice Languages', '/api/ai/voice/languages'),
      color: 'bg-red-600',
      category: 'tools'
    },
    {
      id: 'tool-voice-voices',
      label: 'Available Voices',
      icon: MicrophoneIcon,
      description: 'เสียงที่ใช้ได้ใน Voice AI',
      action: () => handleApiCall('Available Voices', '/api/ai/voice/voices'),
      color: 'bg-pink-600',
      category: 'tools'
    },
    {
      id: 'tool-voice-health',
      label: 'Voice AI Health',
      icon: BellIcon,
      description: 'สถานะ Voice AI',
      action: () => handleApiCall('Voice AI Health', '/api/ai/voice/health'),
      color: 'bg-teal-600',
      category: 'tools'
    },
    {
      id: 'data-search-vehicle',
      label: 'Search Vehicle',
      icon: MagnifyingGlassIcon,
      description: 'ค้นหารถด้วยทะเบียน',
      action: () => handleApiCall('Search Vehicle', '/api/vehicles/search/by-license/ABC-1234'),
      color: 'bg-yellow-600',
      category: 'data'
    },
    {
      id: 'data-get-customers',
      label: 'Get All Customers',
      icon: UsersIcon,
      description: 'ดูข้อมูลลูกค้าทั้งหมด',
      action: () => handleApiCall('All Customers', '/api/customers/'),
      color: 'bg-indigo-600',
      category: 'data'
    },
    {
      id: 'data-get-vehicles',
      label: 'Get All Vehicles',
      icon: TruckIcon,
      description: 'ดูข้อมูลรถทั้งหมด',
      action: () => handleApiCall('All Vehicles', '/api/vehicles/'),
      color: 'bg-orange-600',
      category: 'data'
    },
    {
      id: 'data-get-transportations',
      label: 'Get All Jobs',
      icon: ClipboardDocumentListIcon,
      description: 'ดูงานขนส่งทั้งหมด',
      action: () => handleApiCall('All Transportation Jobs', '/api/transportations/'),
      color: 'bg-purple-600',
      category: 'data'
    },
    {
      id: 'ai-pricing-truck',
      label: 'Truck Pricing',
      icon: CalculatorIcon,
      description: 'ราคาค่าขนส่งรถบรรทุก',
      action: () => handleApiCall('Truck Pricing', '/api/ai/distance/pricing/truck'),
      color: 'bg-emerald-600',
      category: 'ai'
    }
  ];

  const categories = [
    { id: 'navigation', label: 'Navigation', icon: MapIcon, color: 'bg-blue-500' },
    { id: 'ai', label: 'AI Tools', icon: SparklesIcon, color: 'bg-purple-500' },
    { id: 'data', label: 'Data', icon: ClipboardDocumentListIcon, color: 'bg-green-500' },
    { id: 'tools', label: 'Tools', icon: CogIcon, color: 'bg-gray-500' }
  ];

  const filteredItems = activeCategory 
    ? menuItems.filter(item => item.category === activeCategory)
    : menuItems;

  return (
    <>
      {/* Floating Menu Button */}
      <div className={`fixed bottom-24 left-6 z-40 ${className}`}>
        <Button
          onClick={toggleMenu}
          variant="primary"
          size="lg"
          className="rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 p-4"
          icon={isOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
        >
          <span className="hidden sm:inline-flex ml-2 font-semibold">
            {isOpen ? 'Close' : 'Menu'}
          </span>
          <span className="hidden lg:inline-flex ml-2 text-xs bg-white/20 px-2 py-1 rounded">
            Alt+M
          </span>
        </Button>
      </div>

      {/* Menu Card */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-30"
            onClick={toggleMenu}
          />
          
          {/* Menu Panel */}
          <div className="fixed bottom-6 left-6 right-6 sm:right-auto sm:w-96 z-40">
            <Card className="max-h-[70vh] flex flex-col shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-indigo-600 to-purple-700">
                <div className="flex items-center space-x-2 text-white">
                  <Bars3Icon className="w-5 h-5" />
                  <div>
                    <h3 className="font-semibold">Quick Access Menu</h3>
                    <p className="text-xs text-indigo-100">หน้า{pageContext.pageNameThai}</p>
                  </div>
                </div>
                <button
                  onClick={toggleMenu}
                  className="text-white hover:text-gray-200 p-1 rounded-full hover:bg-white/20 transition-colors"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              {/* Category Tabs */}
              <div className="flex border-b border-gray-200 bg-gray-50">
                <button
                  onClick={() => setActiveCategory(null)}
                  className={`flex-1 px-3 py-2 text-xs font-medium transition-colors ${
                    activeCategory === null 
                      ? 'bg-white text-indigo-600 border-b-2 border-indigo-600' 
                      : 'text-gray-600 hover:text-indigo-600'
                  }`}
                >
                  All
                </button>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`flex-1 px-3 py-2 text-xs font-medium transition-colors ${
                      activeCategory === category.id
                        ? 'bg-white text-indigo-600 border-b-2 border-indigo-600'
                        : 'text-gray-600 hover:text-indigo-600'
                    }`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>

              {/* Menu Items */}
              <div className="flex-1 overflow-y-auto p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {filteredItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        item.action();
                        setIsOpen(false);
                      }}
                      className={`group flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 hover:shadow-md border border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50`}
                    >
                      <div className={`p-2 rounded-lg ${item.color} group-hover:scale-110 transition-transform`}>
                        <item.icon className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="font-medium text-gray-900 text-sm">
                          {item.label}
                        </div>
                        <div className="text-xs text-gray-600 truncate">
                          {item.description}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="p-3 bg-gray-50 border-t border-gray-200">
                <div className="text-xs text-center text-gray-500">
                  กด Alt+M เพื่อเปิด/ปิดเมนู | API: {menuItems.filter(i => i.category !== 'navigation').length} functions
                </div>
              </div>
            </Card>
          </div>
        </>
      )}

      {/* API Result Modal */}
      {modalData && (
        <ApiResultModal
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setModalData(null);
          }}
          title={modalData.title}
          endpoint={modalData.endpoint}
          method={modalData.method}
          result={modalData.result}
          error={modalData.error}
          loading={modalData.loading}
        />
      )}
    </>
  );
};

export default FloatingMenu;
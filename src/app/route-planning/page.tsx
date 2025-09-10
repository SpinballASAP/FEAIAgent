'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { FormField, FormSection, FormActions } from '@/components/forms/FormField';
import { useForm } from '@/hooks/useForm';
import { useToast } from '@/components/ui/Toast';
import { 
  MapIcon, 
  MapPinIcon, 
  CalculatorIcon,
  TruckIcon,
  ClockIcon,
  CurrencyDollarIcon,
  SparklesIcon,
  BuildingOfficeIcon,
  PlusIcon,
  TrashIcon
} from '@heroicons/react/24/outline';

interface RouteFormData {
  origin: string;
  destination: string;
  waypoints: string[];
  vehicleType: string;
  weight: string;
  priority: string;
}

interface CompanyLocation {
  id: number;
  name: string;
  address: string;
  type: 'warehouse' | 'branch' | 'customer';
}

interface DistanceResult {
  distance: number;
  duration: number;
  route?: any;
}

interface RouteResult {
  optimizedRoute: string[];
  totalDistance: number;
  totalDuration: number;
  estimated_cost?: number;
}

export default function RoutePlanningPage() {
  const toast = useToast();
  
  const [distanceResult, setDistanceResult] = useState<DistanceResult | null>(null);
  const [routeResult, setRouteResult] = useState<RouteResult | null>(null);
  const [pricingResult, setPricingResult] = useState<any | null>(null);
  const [loadingDistance, setLoadingDistance] = useState(false);
  const [loadingRoute, setLoadingRoute] = useState(false);
  const [loadingPricing, setLoadingPricing] = useState(false);
  const [loadingLocations, setLoadingLocations] = useState(false);
  const [locations, setLocations] = useState<CompanyLocation[]>([]);

  const initialValues: RouteFormData = {
    origin: '',
    destination: '',
    waypoints: [],
    vehicleType: 'truck',
    weight: '5',
    priority: 'normal',
  };

  const { values, errors, touched, handleChange, handleBlur, resetForm } = useForm<RouteFormData>({
    initialValues,
    validationSchema: null,
    validateOnBlur: false,
  });

  const vehicleTypeOptions = [
    { value: 'truck', label: 'รถบรรทุก (Truck)' },
    { value: 'van', label: 'รถตู้ (Van)' },
    { value: 'motorcycle', label: 'รถจักรยานยนต์ (Motorcycle)' },
    { value: 'pickup', label: 'รถกระบะ (Pickup)' },
  ];

  const priorityOptions = [
    { value: 'low', label: 'ต่ำ (Low)' },
    { value: 'normal', label: 'ปกติ (Normal)' },
    { value: 'high', label: 'สูง (High)' },
    { value: 'urgent', label: 'ด่วน (Urgent)' },
  ];

  // โหลดข้อมูลสถานที่จากฐานข้อมูล
  const loadCompanyLocations = async () => {
    setLoadingLocations(true);
    try {
      // จำลองการโหลดข้อมูลจากฐานข้อมูล
      const mockLocations: CompanyLocation[] = [
        {
          id: 1,
          name: 'คลังสินค้าหลัก',
          address: 'สำนักงานใหญ่ 123/456 ถ.รามคำแหง แขวงหัวหมาก เขตบางกะปิ กรุงเทพมหานคร 10240',
          type: 'warehouse'
        },
        {
          id: 2,
          name: 'สาขาพัทยา',
          address: '789/123 ถ.พัทยาใต้ ตำบลหนองปรือ อำเภอบางละมุง จังหวัดชลบุรี 20150',
          type: 'branch'
        },
        {
          id: 3,
          name: 'สาขาเชียงใหม่',
          address: '321/654 ถ.ห้วยแก้ว ตำบลสุเทพ อำเภอเมืองเชียงใหม่ จังหวัดเชียงใหม่ 50200',
          type: 'branch'
        },
        {
          id: 4,
          name: 'ลูกค้า - บริษัท ABC',
          address: 'เขตจตุจักร กรุงเทพมหานคร 10900',
          type: 'customer'
        },
        {
          id: 5,
          name: 'ลูกค้า - บริษัท XYZ',
          address: 'อำเภอเมืองนนทบุรี จังหวัดนนทบุรี 11000',
          type: 'customer'
        }
      ];
      
      setLocations(mockLocations);
      toast.success('โหลดข้อมูลสถานที่สำเร็จ', `พบ ${mockLocations.length} สถานที่`);
    } catch (error) {
      console.error('Error loading locations:', error);
      toast.error('เกิดข้อผิดพลาด', 'ไม่สามารถโหลดข้อมูลสถานที่ได้');
    } finally {
      setLoadingLocations(false);
    }
  };

  // สร้าง options สำหรับ select จาก locations
  const locationOptions = useMemo(() => {
    const options = [{ value: '', label: 'เลือกสถานที่หรือพิมพ์ที่อยู่ใหม่', disabled: true }];
    
    locations.forEach(location => {
      const typeLabel = location.type === 'warehouse' ? '📦 คลัง' : 
                       location.type === 'branch' ? '🏢 สาขา' : '👤 ลูกค้า';
      options.push({
        value: location.address,
        label: `${typeLabel} ${location.name}`,
        disabled: false
      });
    });
    
    return options;
  }, [locations]);

  // เพิ่ม waypoint ใหม่
  const addWaypoint = () => {
    const newWaypoints = [...values.waypoints, ''];
    Object.assign(values, { waypoints: newWaypoints });
    toast.info('เพิ่มจุดแวะใหม่', 'สามารถเลือกสถานที่หรือพิมพ์ที่อยู่ได้');
  };

  // ลบ waypoint
  const removeWaypoint = (index: number) => {
    const newWaypoints = values.waypoints.filter((_, i) => i !== index);
    Object.assign(values, { waypoints: newWaypoints });
    toast.info('ลบจุดแวะแล้ว', '');
  };

  // อัพเดท waypoint
  const updateWaypoint = (index: number, value: string) => {
    const newWaypoints = [...values.waypoints];
    newWaypoints[index] = value;
    Object.assign(values, { waypoints: newWaypoints });
  };

  const handleCalculateDistance = async () => {
    if (!values.origin || !values.destination) {
      toast.error('ข้อมูลไม่ครบถ้วน', 'กรุณากรอกจุดเริ่มต้นและจุดปลายทาง');
      return;
    }

    setLoadingDistance(true);
    try {
      const response = await fetch('http://localhost:8000/api/ai/distance/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          origin_address: values.origin,
          destination_address: values.destination,
          waypoints: values.waypoints.filter(w => w.trim() !== '')
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      setDistanceResult(result);
      toast.success('คำนวณระยะทางสำเร็จ', `ระยะทาง: ${result.distance} กม.`);
    } catch (error) {
      console.error('Distance calculation error:', error);
      toast.error('เกิดข้อผิดพลาด', error instanceof Error ? error.message : 'ไม่สามารถคำนวณระยะทางได้');
    } finally {
      setLoadingDistance(false);
    }
  };

  const handleOptimizeRoute = async () => {
    if (!values.origin || !values.destination) {
      toast.error('ข้อมูลไม่ครบถ้วน', 'กรุณากรอกจุดเริ่มต้นและจุดปลายทาง');
      return;
    }

    setLoadingRoute(true);
    try {
      const validWaypoints = values.waypoints.filter(w => w.trim() !== '');
      const allWaypoints = [values.origin, ...validWaypoints, values.destination];

      const response = await fetch('http://localhost:8000/api/ai/route/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          waypoints: allWaypoints,
          vehicle_type: values.vehicleType,
          priority: values.priority,
          constraints: {
            weight_limit: parseFloat(values.weight) || 5
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      setRouteResult(result);
      toast.success('เส้นทางได้รับการปรับปรุงแล้ว', `ระยะทางรวม: ${result.totalDistance} กม.`);
    } catch (error) {
      console.error('Route optimization error:', error);
      toast.error('เกิดข้อผิดพลาด', error instanceof Error ? error.message : 'ไม่สามารถปรับปรุงเส้นทางได้');
    } finally {
      setLoadingRoute(false);
    }
  };

  const handleCalculatePricing = async () => {
    if (!distanceResult && !routeResult) {
      toast.error('ข้อมูลไม่ครบถ้วน', 'กรุณาคำนวณระยะทางหรือปรับปรุงเส้นทางก่อน');
      return;
    }

    setLoadingPricing(true);
    try {
      const distance = distanceResult?.distance || routeResult?.totalDistance || 0;
      const response = await fetch('http://localhost:8000/api/ai/distance/pricing/truck', {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      setPricingResult({ ...result, calculatedFor: distance });
      toast.success('คำนวณราคาสำเร็จ', 'ได้ข้อมูลราคาขนส่งแล้ว');
    } catch (error) {
      console.error('Pricing calculation error:', error);
      toast.error('เกิดข้อผิดพลาด', error instanceof Error ? error.message : 'ไม่สามารถคำนวณราคาได้');
    } finally {
      setLoadingPricing(false);
    }
  };

  const handleClearAll = () => {
    resetForm();
    setDistanceResult(null);
    setRouteResult(null);
    setPricingResult(null);
    toast.info('ข้อมูลถูกล้างแล้ว', 'สามารถเริ่มวางแผนเส้นทางใหม่ได้');
  };

  // Page context สำหรับ Route Planning
  useEffect(() => {
    // ตั้งค่า document title สำหรับหน้านี้
    document.title = 'Route Planning - การวางแผนเส้นทาง | TMS AI Tools';
    
    // โหลดข้อมูลสถานที่เมื่อโหลดหน้า
    loadCompanyLocations();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-800 flex items-center gap-3">
            <MapIcon className="w-8 h-8 text-blue-600" />
            Route Planning
          </h1>
          <p className="text-gray-600 mt-2">การวางแผนเส้นทางและคำนวณระยะทางด้วย AI</p>
        </div>
        <Button
          variant="secondary"
          onClick={handleClearAll}
          className="flex items-center gap-2"
        >
          <SparklesIcon className="w-4 h-4" />
          ล้างข้อมูล
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <Card className="p-6">
          <div className="space-y-6">
            <FormSection
              title="ข้อมูลเส้นทาง"
              description="เลือกจุดเริ่มต้น จุดปลายทาง และจุดแวะระหว่างทาง"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-600">
                    {locations.length > 0 ? `พบ ${locations.length} สถานที่ในฐานข้อมูล` : 'กำลังโหลดข้อมูล...'}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={loadCompanyLocations}
                    loading={loadingLocations}
                    disabled={loadingLocations}
                    className="text-xs"
                  >
                    <BuildingOfficeIcon className="w-3 h-3 mr-1" />
                    รีเฟรชข้อมูล
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    type="select"
                    name="origin"
                    label="จุดเริ่มต้น"
                    value={values.origin}
                    onChange={handleChange('origin')}
                    onBlur={handleBlur('origin')}
                    error={errors.origin}
                    touched={touched.origin}
                    options={locationOptions}
                    required
                    icon={<MapPinIcon className="w-5 h-5 text-green-500" />}
                  />

                  <FormField
                    type="select"
                    name="destination"
                    label="จุดปลายทาง"
                    value={values.destination}
                    onChange={handleChange('destination')}
                    onBlur={handleBlur('destination')}
                    error={errors.destination}
                    touched={touched.destination}
                    options={locationOptions}
                    required
                    icon={<MapPinIcon className="w-5 h-5 text-red-500" />}
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-semibold text-gray-800">
                      จุดแวะระหว่างทาง (ถ้ามี)
                    </label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addWaypoint}
                      className="text-xs"
                    >
                      <PlusIcon className="w-3 h-3 mr-1" />
                      เพิ่มจุดแวะ
                    </Button>
                  </div>

                  {values.waypoints.map((waypoint, index) => (
                    <div key={index} className="flex items-end gap-2">
                      <div className="flex-1">
                        <FormField
                          type="select"
                          name={`waypoint-${index}`}
                          label={`จุดแวะที่ ${index + 1}`}
                          value={waypoint}
                          onChange={(e) => updateWaypoint(index, e.target.value)}
                          options={locationOptions}
                          icon={<MapIcon className="w-5 h-5 text-blue-500" />}
                        />
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeWaypoint(index)}
                        className="mb-2 text-red-500 hover:text-red-700"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}

                  {values.waypoints.length === 0 && (
                    <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                      <MapIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">ยังไม่มีจุดแวะระหว่างทาง</p>
                      <p className="text-xs text-gray-400">กดปุ่ม "เพิ่มจุดแวะ" เพื่อเพิ่มจุดหยุดระหว่างทาง</p>
                    </div>
                  )}
                </div>
              </div>
            </FormSection>

            <FormSection
              title="ข้อมูลยานพาหนะ"
              description="ระบุประเภทยานพาหนะและน้ำหนักบรรทุก"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  type="select"
                  name="vehicleType"
                  label="ประเภทยานพาหนะ"
                  value={values.vehicleType}
                  onChange={handleChange('vehicleType')}
                  onBlur={handleBlur('vehicleType')}
                  error={errors.vehicleType}
                  touched={touched.vehicleType}
                  options={vehicleTypeOptions}
                  required
                />

                <FormField
                  type="number"
                  name="weight"
                  label="น้ำหนักบรรทุก (ตัน)"
                  value={values.weight}
                  onChange={handleChange('weight')}
                  onBlur={handleBlur('weight')}
                  error={errors.weight}
                  touched={touched.weight}
                  placeholder="5"
                  icon={<TruckIcon className="w-5 h-5" />}
                />
              </div>

              <FormField
                type="select"
                name="priority"
                label="ความสำคัญ"
                value={values.priority}
                onChange={handleChange('priority')}
                onBlur={handleBlur('priority')}
                error={errors.priority}
                touched={touched.priority}
                options={priorityOptions}
                required
              />
            </FormSection>

            <FormActions>
              <Button
                variant="primary"
                onClick={handleCalculateDistance}
                loading={loadingDistance}
                disabled={loadingDistance}
                className="flex items-center gap-2"
              >
                <CalculatorIcon className="w-4 h-4" />
                คำนวณระยะทาง
              </Button>

              <Button
                variant="secondary"
                onClick={handleOptimizeRoute}
                loading={loadingRoute}
                disabled={loadingRoute}
                className="flex items-center gap-2"
              >
                <SparklesIcon className="w-4 h-4" />
                ปรับปรุงเส้นทาง
              </Button>

              <Button
                variant="outline"
                onClick={handleCalculatePricing}
                loading={loadingPricing}
                disabled={loadingPricing}
                className="flex items-center gap-2"
              >
                <CurrencyDollarIcon className="w-4 h-4" />
                คำนวณราคา
              </Button>
            </FormActions>
          </div>
        </Card>

        {/* Results */}
        <div className="space-y-6">
          {/* Distance Result */}
          {distanceResult && (
            <Card className="p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <CalculatorIcon className="w-5 h-5 text-blue-600" />
                ผลการคำนวณระยะทาง
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-blue-800">ระยะทาง</span>
                    <span className="text-xl font-bold text-blue-900">
                      {distanceResult.distance.toFixed(1)} กม.
                    </span>
                  </div>
                </div>
                <div className="bg-green-50 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-green-800">เวลาโดยประมาณ</span>
                    <span className="text-xl font-bold text-green-900 flex items-center gap-1">
                      <ClockIcon className="w-4 h-4" />
                      {Math.round(distanceResult.duration / 60)} นาที
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Route Optimization Result */}
          {routeResult && (
            <Card className="p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <MapIcon className="w-5 h-5 text-green-600" />
                เส้นทางที่ปรับปรุงแล้ว
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-green-50 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-green-800">ระยะทางรวม</span>
                      <span className="text-xl font-bold text-green-900">
                        {routeResult.totalDistance.toFixed(1)} กม.
                      </span>
                    </div>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-purple-800">เวลารวม</span>
                      <span className="text-xl font-bold text-purple-900 flex items-center gap-1">
                        <ClockIcon className="w-4 h-4" />
                        {Math.round(routeResult.totalDuration / 60)} นาที
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">ลำดับเส้นทางที่แนะนำ:</h4>
                  <ol className="space-y-1">
                    {routeResult.optimizedRoute.map((location, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm text-gray-700">
                        <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                          {index + 1}
                        </span>
                        {location}
                      </li>
                    ))}
                  </ol>
                </div>

                {routeResult.estimated_cost && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-yellow-800">ค่าใช้จ่ายโดยประมาณ</span>
                      <span className="text-xl font-bold text-yellow-900">
                        ฿{routeResult.estimated_cost.toLocaleString()}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Pricing Result */}
          {pricingResult && (
            <Card className="p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <CurrencyDollarIcon className="w-5 h-5 text-yellow-600" />
                ข้อมูลราคาขนส่ง
              </h3>
              <div className="bg-yellow-50 rounded-xl p-4">
                <pre className="text-sm text-gray-800 whitespace-pre-wrap">
                  {JSON.stringify(pricingResult, null, 2)}
                </pre>
              </div>
            </Card>
          )}

          {/* Empty State */}
          {!distanceResult && !routeResult && !pricingResult && (
            <Card className="p-8 text-center">
              <MapIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">ยังไม่มีข้อมูล</h3>
              <p className="text-gray-500">
                กรอกข้อมูลเส้นทางและกดปุ่มเพื่อเริ่มการวางแผนเส้นทาง
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
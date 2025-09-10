'use client';

import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

export interface PageContext {
  pageName: string;
  pageNameThai: string;
  features: string[];
  aiTools: Array<{
    name: string;
    endpoint: string;
    description: string;
  }>;
  quickActions: Array<{
    label: string;
    message: string;
    emoji: string;
  }>;
}

export const usePageContext = (): PageContext => {
  const pathname = usePathname();

  return useMemo(() => {
    switch (pathname) {
      case '/':
        return {
          pageName: 'Dashboard',
          pageNameThai: 'แดชบอร์ด',
          features: ['ดูสถิติ', 'กราฟวิเคราะห์', 'กิจกรรมล่าสุด', 'สถานะ API'],
          aiTools: [
            { name: 'Chat Agent', endpoint: '/api/ai/chat', description: 'AI สนทนาและตอบคำถามทั่วไป' },
            { name: 'Voice Chat', endpoint: '/api/ai/voice/chat', description: 'AI สนทนาด้วยเสียง' },
            { name: 'PDF Processor', endpoint: '/api/ai/pdf/process', description: 'ประมวลผลเอกสาร PDF' }
          ],
          quickActions: [
            { label: 'ดูสถิติวันนี้', message: 'แสดงสถิติการขนส่งวันนี้', emoji: '📊' },
            { label: 'วิเคราะห์ข้อมูล', message: 'วิเคราะห์ประสิทธิภาพการขนส่งเดือนนี้', emoji: '📈' },
            { label: 'ตรวจสอบสถานะ', message: 'ตรวจสอบสถานะระบบทั้งหมด', emoji: '🔍' },
            { label: 'สร้างรายงาน', message: 'สร้างรายงานสรุปประจำสัปดาห์', emoji: '📋' }
          ]
        };
      
      case '/customers':
        return {
          pageName: 'Customers',
          pageNameThai: 'จัดการลูกค้า',
          features: ['เพิ่มลูกค้า', 'แก้ไขข้อมูล', 'ค้นหาลูกค้า', 'ประวัติการใช้งาน'],
          aiTools: [
            { name: 'Chat Agent', endpoint: '/api/ai/chat', description: 'AI ช่วยจัดการข้อมูลลูกค้า' },
            { name: 'PDF Processor', endpoint: '/api/ai/pdf/process', description: 'ประมวลผลเอกสารลูกค้า' },
            { name: 'Voice Chat', endpoint: '/api/ai/voice/chat', description: 'บันทึกข้อมูลลูกค้าด้วยเสียง' }
          ],
          quickActions: [
            { label: 'เพิ่มลูกค้าใหม่', message: 'ช่วยฉันเพิ่มลูกค้าใหม่', emoji: '👥' },
            { label: 'ค้นหาลูกค้า', message: 'ค้นหาลูกค้าตามเงื่อนไข', emoji: '🔍' },
            { label: 'ดูประวัติ', message: 'แสดงประวัติการใช้งานของลูกค้า', emoji: '📜' },
            { label: 'ส่งออกข้อมูล', message: 'ส่งออกข้อมูลลูกค้าทั้งหมด', emoji: '📤' }
          ]
        };

      case '/vehicles':
        return {
          pageName: 'Vehicles',
          pageNameThai: 'จัดการยานพาหนะ',
          features: ['เพิ่มรถ', 'ตรวจสอบสถานะ', 'จัดการบำรุงรักษา', 'ติดตามตำแหน่ง'],
          aiTools: [
            { name: 'Chat Agent', endpoint: '/api/ai/chat', description: 'AI ช่วยจัดการยานพาหนะ' },
            { name: 'Voice Chat', endpoint: '/api/ai/voice/chat', description: 'รายงานสถานะรถด้วยเสียง' },
            { name: 'PDF Processor', endpoint: '/api/ai/pdf/process', description: 'ประมวลผลเอกสารทะเบียนรถ' }
          ],
          quickActions: [
            { label: 'เพิ่มรถใหม่', message: 'ช่วยฉันเพิ่มยานพาหนะใหม่', emoji: '🚛' },
            { label: 'ตรวจสอบสถานะรถ', message: 'ตรวจสอบสถานะยานพาหนะทั้งหมด', emoji: '🔧' },
            { label: 'กำหนดการบำรุง', message: 'จัดตารางการบำรุงรักษา', emoji: '📅' },
            { label: 'ติดตามตำแหน่ง', message: 'แสดงตำแหน่งรถที่กำลังเดินทาง', emoji: '📍' }
          ]
        };

      case '/jobs':
        return {
          pageName: 'Jobs',
          pageNameThai: 'จัดการงานขนส่ง',
          features: ['สร้างงาน', 'มอบหมายงาน', 'ติดตามสถานะ', 'คำนวณค่าขนส่ง'],
          aiTools: [
            { name: 'Chat Agent', endpoint: '/api/ai/chat', description: 'AI ช่วยจัดการงานขนส่ง' },
            { name: 'Distance Calculator', endpoint: '/api/ai/distance/calculate', description: 'คำนวณระยะทางและค่าขนส่ง' },
            { name: 'Route Optimizer', endpoint: '/api/ai/route/optimize', description: 'ปรับปรุงเส้นทางให้เหมาะสม' },
            { name: 'PDF Processor', endpoint: '/api/ai/pdf/process', description: 'ประมวลผลเอกสารงาน' }
          ],
          quickActions: [
            { label: 'สร้างงานใหม่', message: 'ช่วยฉันสร้างงานขนส่งใหม่', emoji: '📦' },
            { label: 'มอบหมายงาน', message: 'มอบหมายงานให้กับคนขับ', emoji: '👨‍💼' },
            { label: 'ติดตามงาน', message: 'ติดตามสถานะงานที่กำลังดำเนินการ', emoji: '🚚' },
            { label: 'คำนวณค่าขนส่ง', message: 'คำนวณค่าขนส่งสำหรับเส้นทางใหม่', emoji: '💰' }
          ]
        };

      case '/transportation':
        return {
          pageName: 'Transportation',
          pageNameThai: 'จัดการการขนส่ง',
          features: ['วางแผนเส้นทาง', 'คำนวณระยะทาง', 'ติดตามการเดินทาง', 'ปรับปรุงเส้นทาง'],
          aiTools: [
            { name: 'Route Optimizer', endpoint: '/api/ai/route/optimize', description: 'ปรับปรุงเส้นทางให้เหมาะสมที่สุด' },
            { name: 'Distance Calculator', endpoint: '/api/ai/distance/calculate', description: 'คำนวณระยะทางและเวลาเดินทาง' },
            { name: 'Chat Agent', endpoint: '/api/ai/chat', description: 'AI ช่วยวางแผนการขนส่ง' },
            { name: 'Voice Chat', endpoint: '/api/ai/voice/chat', description: 'สื่อสารกับคนขับด้วยเสียง' }
          ],
          quickActions: [
            { label: 'วางแผนเส้นทาง', message: 'ช่วยฉันวางแผนเส้นทางที่เหมาะสม', emoji: '🗺️' },
            { label: 'คำนวณระยะทาง', message: 'คำนวณระยะทางและเวลาเดินทาง', emoji: '📏' },
            { label: 'ปรับปรุงเส้นทาง', message: 'วิเคราะห์และปรับปรุงเส้นทางให้มีประสิทธิภาพ', emoji: '⚡' },
            { label: 'ติดตามการเดินทาง', message: 'ติดตามการเดินทางแบบเรียลไทม์', emoji: '📱' }
          ]
        };

      default:
        return {
          pageName: 'TMS System',
          pageNameThai: 'ระบบ TMS',
          features: ['ระบบจัดการการขนส่ง', 'AI Assistant', 'วิเคราะห์ข้อมูล', 'รายงานต่างๆ'],
          aiTools: [
            { name: 'Chat Agent', endpoint: '/api/ai/chat', description: 'AI ช่วยเหลือทั่วไป' },
            { name: 'Voice Chat', endpoint: '/api/ai/voice/chat', description: 'สนทนาด้วยเสียง' },
            { name: 'PDF Processor', endpoint: '/api/ai/pdf/process', description: 'ประมวลผลเอกสาร' }
          ],
          quickActions: [
            { label: 'ช่วยเหลือทั่วไป', message: 'ฉันต้องการความช่วยเหลือเกี่ยวกับระบบ TMS', emoji: '❓' },
            { label: 'แนะนำฟีเจอร์', message: 'แนะนำฟีเจอร์ที่น่าสนใจในระบบ', emoji: '💡' },
            { label: 'คู่มือการใช้งาน', message: 'ขอคู่มือการใช้งานระบบ', emoji: '📖' },
            { label: 'ติดต่อสนับสนุน', message: 'ฉันต้องการติดต่อทีมสนับสนุน', emoji: '📞' }
          ]
        };
    }
  }, [pathname]);
};
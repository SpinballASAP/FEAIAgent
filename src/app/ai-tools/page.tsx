'use client';

import React, { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { FormField, FormSection, FormActions } from '@/components/forms/FormField';
import { useForm } from '@/hooks/useForm';
import { useToast } from '@/components/ui/Toast';
import { 
  SparklesIcon, 
  MicrophoneIcon,
  DocumentTextIcon,
  SpeakerWaveIcon,
  LanguageIcon,
  HeartIcon,
  DocumentArrowUpIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

interface AIFormData {
  text: string;
  language: string;
  voice: string;
  pdfFile: File | null;
}

interface AICapabilities {
  voice_processing: boolean;
  pdf_processing: boolean;
  distance_calculation: boolean;
  route_optimization: boolean;
}

interface VoiceLanguage {
  code: string;
  name: string;
  available_voices: string[];
}

interface VoiceOption {
  id: string;
  name: string;
  language: string;
  gender: string;
}

export default function AIToolsPage() {
  const toast = useToast();
  
  const [capabilities, setCapabilities] = useState<AICapabilities | null>(null);
  const [languages, setLanguages] = useState<VoiceLanguage[]>([]);
  const [voices, setVoices] = useState<VoiceOption[]>([]);
  const [voiceHealth, setVoiceHealth] = useState<any | null>(null);
  const [pdfResult, setPdfResult] = useState<any | null>(null);
  
  const [loadingCapabilities, setLoadingCapabilities] = useState(false);
  const [loadingLanguages, setLoadingLanguages] = useState(false);
  const [loadingVoices, setLoadingVoices] = useState(false);
  const [loadingHealth, setLoadingHealth] = useState(false);
  const [loadingPdf, setLoadingPdf] = useState(false);

  const initialValues: AIFormData = {
    text: '',
    language: 'th',
    voice: '',
    pdfFile: null,
  };

  const { values, errors, touched, handleChange, handleBlur, resetForm } = useForm<AIFormData>({
    initialValues,
    validationSchema: null,
    validateOnBlur: false,
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    // ใช้ Object.assign เพื่ออัพเดท form values
    Object.assign(values, { pdfFile: file });
  };

  const handleGetCapabilities = async () => {
    setLoadingCapabilities(true);
    try {
      const response = await fetch('http://localhost:8000/api/ai/capabilities', {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      setCapabilities(result);
      toast.success('โหลดข้อมูล AI Capabilities สำเร็จ', 'ได้ข้อมูลความสามารถของ AI แล้ว');
    } catch (error) {
      console.error('AI Capabilities error:', error);
      toast.error('เกิดข้อผิดพลาด', error instanceof Error ? error.message : 'ไม่สามารถโหลดข้อมูล AI Capabilities ได้');
    } finally {
      setLoadingCapabilities(false);
    }
  };

  const handleGetVoiceLanguages = async () => {
    setLoadingLanguages(true);
    try {
      const response = await fetch('http://localhost:8000/api/ai/voice/languages', {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      setLanguages(result);
      toast.success('โหลดภาษาที่รองรับสำเร็จ', `มี ${result.length} ภาษาที่รองรับ`);
    } catch (error) {
      console.error('Voice Languages error:', error);
      toast.error('เกิดข้อผิดพลาด', error instanceof Error ? error.message : 'ไม่สามารถโหลดภาษาที่รองรับได้');
    } finally {
      setLoadingLanguages(false);
    }
  };

  const handleGetAvailableVoices = async () => {
    setLoadingVoices(true);
    try {
      const response = await fetch('http://localhost:8000/api/ai/voice/voices', {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      setVoices(result);
      toast.success('โหลดเสียงที่รองรับสำเร็จ', `มี ${result.length} เสียงที่รองรับ`);
    } catch (error) {
      console.error('Available Voices error:', error);
      toast.error('เกิดข้อผิดพลาด', error instanceof Error ? error.message : 'ไม่สามารถโหลดเสียงที่รองรับได้');
    } finally {
      setLoadingVoices(false);
    }
  };

  const handleCheckVoiceHealth = async () => {
    setLoadingHealth(true);
    try {
      const response = await fetch('http://localhost:8000/api/ai/voice/health', {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      setVoiceHealth(result);
      toast.success('ตรวจสอบสถานะ Voice AI สำเร็จ', 'ได้ข้อมูลสถานะ Voice AI แล้ว');
    } catch (error) {
      console.error('Voice Health error:', error);
      toast.error('เกิดข้อผิดพลาด', error instanceof Error ? error.message : 'ไม่สามารถตรวจสอบสถานะ Voice AI ได้');
    } finally {
      setLoadingHealth(false);
    }
  };

  const handleProcessPDF = async () => {
    if (!values.pdfFile) {
      toast.error('ข้อมูลไม่ครบถ้วน', 'กรุณาเลือกไฟล์ PDF ที่ต้องการประมวลผล');
      return;
    }

    setLoadingPdf(true);
    try {
      const formData = new FormData();
      formData.append('file', values.pdfFile);
      
      if (values.text) {
        formData.append('query', values.text);
      }

      const response = await fetch('http://localhost:8000/api/ai/pdf/process', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      setPdfResult(result);
      toast.success('ประมวลผล PDF สำเร็จ', 'ได้ข้อมูลจากไฟล์ PDF แล้ว');
    } catch (error) {
      console.error('PDF Processing error:', error);
      toast.error('เกิดข้อผิดพลาด', error instanceof Error ? error.message : 'ไม่สามารถประมวลผล PDF ได้');
    } finally {
      setLoadingPdf(false);
    }
  };

  const handleClearAll = () => {
    resetForm();
    setCapabilities(null);
    setLanguages([]);
    setVoices([]);
    setVoiceHealth(null);
    setPdfResult(null);
    toast.info('ข้อมูลถูกล้างแล้ว', 'สามารถเริ่มใช้งาน AI Tools ใหม่ได้');
  };

  // Page context สำหรับ AI Tools
  React.useEffect(() => {
    // ตั้งค่า document title สำหรับหน้านี้
    document.title = 'AI Tools - เครื่องมือ AI | TMS AI Tools';
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-800 flex items-center gap-3">
            <SparklesIcon className="w-8 h-8 text-blue-600" />
            AI Tools
          </h1>
          <p className="text-gray-600 mt-2">เครื่องมือ AI สำหรับประมวลผลเสียง, เอกสาร และการวิเคราะห์ข้อมูล</p>
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
        {/* AI Capabilities & Voice Tools */}
        <div className="space-y-6">
          <Card className="p-6">
            <FormSection
              title="ความสามารถของ AI"
              description="ตรวจสอบความสามารถที่ AI รองรับ"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  variant="primary"
                  onClick={handleGetCapabilities}
                  loading={loadingCapabilities}
                  disabled={loadingCapabilities}
                  className="flex items-center gap-2"
                >
                  <InformationCircleIcon className="w-4 h-4" />
                  AI Capabilities
                </Button>

                <Button
                  variant="secondary"
                  onClick={handleCheckVoiceHealth}
                  loading={loadingHealth}
                  disabled={loadingHealth}
                  className="flex items-center gap-2"
                >
                  <HeartIcon className="w-4 h-4" />
                  Voice AI Health
                </Button>
              </div>
            </FormSection>

            {capabilities && (
              <div className="mt-6 bg-blue-50 rounded-xl p-4">
                <h4 className="font-semibold text-blue-800 mb-3">ความสามารถที่รองรับ:</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className={`flex items-center gap-2 ${capabilities.voice_processing ? 'text-green-600' : 'text-gray-400'}`}>
                    <MicrophoneIcon className="w-4 h-4" />
                    <span className="text-sm">Voice Processing</span>
                  </div>
                  <div className={`flex items-center gap-2 ${capabilities.pdf_processing ? 'text-green-600' : 'text-gray-400'}`}>
                    <DocumentTextIcon className="w-4 h-4" />
                    <span className="text-sm">PDF Processing</span>
                  </div>
                  <div className={`flex items-center gap-2 ${capabilities.distance_calculation ? 'text-green-600' : 'text-gray-400'}`}>
                    <SparklesIcon className="w-4 h-4" />
                    <span className="text-sm">Distance Calculation</span>
                  </div>
                  <div className={`flex items-center gap-2 ${capabilities.route_optimization ? 'text-green-600' : 'text-gray-400'}`}>
                    <SparklesIcon className="w-4 h-4" />
                    <span className="text-sm">Route Optimization</span>
                  </div>
                </div>
              </div>
            )}

            {voiceHealth && (
              <div className="mt-4 bg-green-50 rounded-xl p-4">
                <h4 className="font-semibold text-green-800 mb-2">สถานะ Voice AI:</h4>
                <pre className="text-sm text-green-700 whitespace-pre-wrap">
                  {JSON.stringify(voiceHealth, null, 2)}
                </pre>
              </div>
            )}
          </Card>

          <Card className="p-6">
            <FormSection
              title="Voice Processing"
              description="จัดการเสียงและภาษา"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  onClick={handleGetVoiceLanguages}
                  loading={loadingLanguages}
                  disabled={loadingLanguages}
                  className="flex items-center gap-2"
                >
                  <LanguageIcon className="w-4 h-4" />
                  ภาษาที่รองรับ
                </Button>

                <Button
                  variant="outline"
                  onClick={handleGetAvailableVoices}
                  loading={loadingVoices}
                  disabled={loadingVoices}
                  className="flex items-center gap-2"
                >
                  <SpeakerWaveIcon className="w-4 h-4" />
                  เสียงที่รองรับ
                </Button>
              </div>
            </FormSection>

            {languages.length > 0 && (
              <div className="mt-6 bg-purple-50 rounded-xl p-4">
                <h4 className="font-semibold text-purple-800 mb-3">ภาษาที่รองรับ:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {languages.map((lang, index) => (
                    <div key={index} className="text-sm text-purple-700">
                      <strong>{lang.code}:</strong> {lang.name} ({lang.available_voices.length} เสียง)
                    </div>
                  ))}
                </div>
              </div>
            )}

            {voices.length > 0 && (
              <div className="mt-4 bg-indigo-50 rounded-xl p-4">
                <h4 className="font-semibold text-indigo-800 mb-3">เสียงที่รองรับ:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {voices.map((voice, index) => (
                    <div key={index} className="text-sm text-indigo-700">
                      <strong>{voice.name}</strong> ({voice.language} - {voice.gender})
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* PDF Processing */}
        <div className="space-y-6">
          <Card className="p-6">
            <FormSection
              title="PDF Processing"
              description="ประมวลผลและวิเคราะห์เอกสาร PDF"
            >
              <div className="space-y-4">
                <FormField
                  type="textarea"
                  name="text"
                  label="คำถามสำหรับ PDF (ถ้ามี)"
                  value={values.text}
                  onChange={handleChange('text')}
                  onBlur={handleBlur('text')}
                  error={errors.text}
                  touched={touched.text}
                  placeholder="เช่น: สรุปเนื้อหาหลักในเอกสารนี้"
                  rows={3}
                  helperText="กรอกคำถามเพื่อให้ AI วิเคราะห์เอกสารตามที่ต้องการ"
                />

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    อัปโหลดไฟล์ PDF
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
                    <DocumentArrowUpIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="hidden"
                      id="pdf-upload"
                    />
                    <label
                      htmlFor="pdf-upload"
                      className="cursor-pointer text-blue-600 hover:text-blue-800 font-medium"
                    >
                      คลิกเพื่อเลือกไฟล์ PDF
                    </label>
                    {values.pdfFile && (
                      <p className="mt-2 text-sm text-gray-600">
                        ไฟล์: {values.pdfFile.name} ({Math.round(values.pdfFile.size / 1024)} KB)
                      </p>
                    )}
                  </div>
                </div>

                <FormActions>
                  <Button
                    variant="primary"
                    onClick={handleProcessPDF}
                    loading={loadingPdf}
                    disabled={loadingPdf || !values.pdfFile}
                    className="flex items-center gap-2 w-full"
                  >
                    <DocumentTextIcon className="w-4 h-4" />
                    ประมวลผล PDF
                  </Button>
                </FormActions>
              </div>
            </FormSection>

            {pdfResult && (
              <div className="mt-6 bg-yellow-50 rounded-xl p-4">
                <h4 className="font-semibold text-yellow-800 mb-3">ผลการประมวลผล PDF:</h4>
                <div className="bg-white rounded-lg p-4 max-h-64 overflow-y-auto">
                  <pre className="text-sm text-gray-800 whitespace-pre-wrap">
                    {JSON.stringify(pdfResult, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </Card>

          {/* Empty State when no results */}
          {!capabilities && !languages.length && !voices.length && !voiceHealth && !pdfResult && (
            <Card className="p-8 text-center">
              <SparklesIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">เริ่มใช้งาน AI Tools</h3>
              <p className="text-gray-500">
                กดปุ่มเพื่อเริ่มสำรวจความสามารถของ AI และใช้งานเครื่องมือต่างๆ
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
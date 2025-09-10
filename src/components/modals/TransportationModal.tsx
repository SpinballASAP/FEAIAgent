'use client';

import React, { useMemo } from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { FormField, FormSection, FormActions, FormErrorSummary } from '@/components/forms/FormField';
import { useForm } from '@/hooks/useForm';
import { transportationValidationSchema } from '@/lib/validation';
import { Transportation, TransportationStatus } from '@/types/api';
import { 
  TruckIcon, 
  UserIcon, 
  BriefcaseIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  CalendarIcon 
} from '@heroicons/react/24/outline';

interface TransportationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (transportation: Partial<Transportation>) => void;
  transportation?: Transportation;
  isLoading?: boolean;
}

interface TransportationFormData {
  jobId: string;
  vehicleId: string;
  driverId: string;
  startDate: string;
  endDate: string;
  distance: string;
  fuelCost: string;
  tollCost: string;
  otherCosts: string;
  status: TransportationStatus;
  notes: string;
}

const TransportationModal: React.FC<TransportationModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  transportation,
  isLoading = false,
}) => {
  const isEdit = !!transportation;
  
  const initialValues: TransportationFormData = {
    jobId: transportation?.jobId?.toString() || '',
    vehicleId: transportation?.vehicleId?.toString() || '',
    driverId: transportation?.driverId?.toString() || '',
    startDate: transportation?.startDate || '',
    endDate: transportation?.endDate || '',
    distance: transportation?.distance?.toString() || '',
    fuelCost: transportation?.fuelCost?.toString() || '0',
    tollCost: transportation?.tollCost?.toString() || '0',
    otherCosts: transportation?.otherCosts?.toString() || '0',
    status: transportation?.status || 'scheduled',
    notes: transportation?.notes || '',
  };

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
  } = useForm<TransportationFormData>({
    initialValues,
    validationSchema: transportationValidationSchema,
    validateOnBlur: true,
    onSubmit: async (formData) => {
      const transportationData: Partial<Transportation> = {
        jobId: parseInt(formData.jobId) || 0,
        vehicleId: parseInt(formData.vehicleId) || 0,
        driverId: parseInt(formData.driverId) || 0,
        startDate: formData.startDate || undefined,
        endDate: formData.endDate || undefined,
        distance: parseFloat(formData.distance) || undefined,
        fuelCost: parseFloat(formData.fuelCost) || 0,
        tollCost: parseFloat(formData.tollCost) || 0,
        otherCosts: parseFloat(formData.otherCosts) || 0,
        status: formData.status,
        notes: formData.notes || undefined,
      };
      
      if (isEdit) {
        transportationData.id = transportation.id;
      }
      
      await onSubmit(transportationData);
    },
  });

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const statusOptions = [
    { value: 'scheduled', label: 'Scheduled' },
    { value: 'in_transit', label: 'In Transit' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  const today = useMemo(() => new Date().toISOString().split('T')[0], []);
  const totalCost = (
    parseFloat(values.fuelCost || '0') +
    parseFloat(values.tollCost || '0') +
    parseFloat(values.otherCosts || '0')
  ).toFixed(2);

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEdit ? `Edit Transportation - #${transportation?.id}` : 'Add New Transportation'}
      size="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormErrorSummary errors={errors} />
        
        <FormSection
          title="Assignment Details"
          description="Specify job, vehicle, and driver assignment"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              type="number"
              name="jobId"
              label="Job ID"
              value={values.jobId}
              onChange={handleChange('jobId')}
              onBlur={handleBlur('jobId')}
              error={errors.jobId}
              touched={touched.jobId}
              required
              placeholder="Enter job ID"
              icon={<BriefcaseIcon className="w-5 h-5" />}
            />

            <FormField
              type="number"
              name="vehicleId"
              label="Vehicle ID"
              value={values.vehicleId}
              onChange={handleChange('vehicleId')}
              onBlur={handleBlur('vehicleId')}
              error={errors.vehicleId}
              touched={touched.vehicleId}
              required
              placeholder="Enter vehicle ID"
              icon={<TruckIcon className="w-5 h-5" />}
            />

            <FormField
              type="number"
              name="driverId"
              label="Driver ID"
              value={values.driverId}
              onChange={handleChange('driverId')}
              onBlur={handleBlur('driverId')}
              error={errors.driverId}
              touched={touched.driverId}
              required
              placeholder="Enter driver ID"
              icon={<UserIcon className="w-5 h-5" />}
            />
          </div>

          <FormField
            type="select"
            name="status"
            label="Status"
            value={values.status}
            onChange={handleChange('status')}
            onBlur={handleBlur('status')}
            error={errors.status}
            touched={touched.status}
            options={statusOptions}
            required
          />
        </FormSection>

        <FormSection
          title="Schedule & Route"
          description="Set transportation dates and route information"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              type="datetime-local"
              name="startDate"
              label="Start Date & Time"
              value={values.startDate}
              onChange={handleChange('startDate')}
              onBlur={handleBlur('startDate')}
              error={errors.startDate}
              touched={touched.startDate}
              required
              min={`${today}T00:00`}
            />

            <FormField
              type="datetime-local"
              name="endDate"
              label="End Date & Time"
              value={values.endDate}
              onChange={handleChange('endDate')}
              onBlur={handleBlur('endDate')}
              error={errors.endDate}
              touched={touched.endDate}
              min={values.startDate || `${today}T00:00`}
            />
          </div>

          <FormField
            type="number"
            name="distance"
            label="Distance (km)"
            value={values.distance}
            onChange={handleChange('distance')}
            onBlur={handleBlur('distance')}
            error={errors.distance}
            touched={touched.distance}
            placeholder="0.0"
            icon={<MapPinIcon className="w-5 h-5" />}
            helperText="Total distance for the route"
          />
        </FormSection>

        <FormSection
          title="Cost Breakdown"
          description="Enter transportation costs and expenses"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              type="number"
              name="fuelCost"
              label="Fuel Cost (THB)"
              value={values.fuelCost}
              onChange={handleChange('fuelCost')}
              onBlur={handleBlur('fuelCost')}
              error={errors.fuelCost}
              touched={touched.fuelCost}
              placeholder="0.00"
              icon={<CurrencyDollarIcon className="w-5 h-5" />}
            />

            <FormField
              type="number"
              name="tollCost"
              label="Toll Cost (THB)"
              value={values.tollCost}
              onChange={handleChange('tollCost')}
              onBlur={handleBlur('tollCost')}
              error={errors.tollCost}
              touched={touched.tollCost}
              placeholder="0.00"
              icon={<CurrencyDollarIcon className="w-5 h-5" />}
            />

            <FormField
              type="number"
              name="otherCosts"
              label="Other Costs (THB)"
              value={values.otherCosts}
              onChange={handleChange('otherCosts')}
              onBlur={handleBlur('otherCosts')}
              error={errors.otherCosts}
              touched={touched.otherCosts}
              placeholder="0.00"
              icon={<CurrencyDollarIcon className="w-5 h-5" />}
            />
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-blue-800">Total Cost:</span>
              <span className="text-lg font-bold text-blue-900">฿{totalCost}</span>
            </div>
          </div>
        </FormSection>

        <FormSection
          title="Additional Information"
          description="Add notes or special requirements"
        >
          <FormField
            type="textarea"
            name="notes"
            label="Notes"
            value={values.notes}
            onChange={handleChange('notes')}
            onBlur={handleBlur('notes')}
            error={errors.notes}
            touched={touched.notes}
            placeholder="Enter any additional notes or special requirements (optional)"
            rows={3}
          />
        </FormSection>

        <FormActions>
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          
          <Button
            type="submit"
            variant="primary"
            loading={isLoading}
            disabled={isLoading}
          >
            {isEdit ? 'Update Transportation' : 'Create Transportation'}
          </Button>
        </FormActions>
      </form>
    </Modal>
  );
};

export default TransportationModal;
'use client';

import React from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { FormField, FormSection, FormActions, FormErrorSummary } from '@/components/forms/FormField';
import { useForm } from '@/hooks/useForm';
import { vehicleValidationSchema } from '@/lib/validation';
import { Vehicle, VehicleType, VehicleStatus } from '@/types/api';
import { TruckIcon, CalendarIcon, UserIcon } from '@heroicons/react/24/outline';

interface VehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (vehicle: Partial<Vehicle>) => void;
  vehicle?: Vehicle;
  isLoading?: boolean;
}

interface VehicleFormData {
  licensePlate: string;
  type: VehicleType | '';
  capacity: string;
  fuelType: string;
  year: string;
  driverId: string;
  status: VehicleStatus;
}

const VehicleModal: React.FC<VehicleModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  vehicle,
  isLoading = false,
}) => {
  const isEdit = !!vehicle;
  
  const initialValues: VehicleFormData = {
    licensePlate: vehicle?.licensePlate || '',
    type: vehicle?.type || '',
    capacity: vehicle?.capacity?.toString() || '',
    fuelType: vehicle?.fuelType || '',
    year: vehicle?.year?.toString() || '',
    driverId: vehicle?.driverId?.toString() || '',
    status: vehicle?.status || 'available',
  };

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
  } = useForm<VehicleFormData>({
    initialValues,
    validationSchema: vehicleValidationSchema,
    validateOnBlur: true,
    onSubmit: async (formData) => {
      const vehicleData: Partial<Vehicle> = {
        ...formData,
        type: formData.type as VehicleType,
        capacity: parseFloat(formData.capacity) || 0,
        year: parseInt(formData.year) || new Date().getFullYear(),
        driverId: parseInt(formData.driverId) || undefined,
      };
      
      if (isEdit) {
        vehicleData.id = vehicle.id;
      }
      
      await onSubmit(vehicleData);
    },
  });

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const vehicleTypeOptions = [
    { value: '', label: 'Select vehicle type', disabled: true },
    { value: 'truck', label: 'Truck' },
    { value: 'van', label: 'Van' },
    { value: 'motorcycle', label: 'Motorcycle' },
    { value: 'pickup', label: 'Pickup' },
    { value: 'trailer', label: 'Trailer' },
  ];

  const statusOptions = [
    { value: 'available', label: 'Available' },
    { value: 'in_use', label: 'In Use' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'inactive', label: 'Inactive' },
  ];

  const fuelTypeOptions = [
    { value: '', label: 'Select fuel type', disabled: true },
    { value: 'gasoline', label: 'Gasoline' },
    { value: 'diesel', label: 'Diesel' },
    { value: 'electric', label: 'Electric' },
    { value: 'hybrid', label: 'Hybrid' },
    { value: 'cng', label: 'CNG' },
    { value: 'lng', label: 'LNG' },
  ];

  const currentYear = new Date().getFullYear();

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEdit ? `Edit Vehicle - ${vehicle?.licensePlate}` : 'Add New Vehicle'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormErrorSummary errors={errors} />
        
        <FormSection
          title="Vehicle Information"
          description="Enter the vehicle's basic details"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              type="text"
              name="licensePlate"
              label="License Plate"
              value={values.licensePlate}
              onChange={handleChange('licensePlate')}
              onBlur={handleBlur('licensePlate')}
              error={errors.licensePlate}
              touched={touched.licensePlate}
              required
              placeholder="ABC-1234"
              icon={<TruckIcon className="w-5 h-5" />}
            />

            <FormField
              type="select"
              name="type"
              label="Vehicle Type"
              value={values.type}
              onChange={handleChange('type')}
              onBlur={handleBlur('type')}
              error={errors.type}
              touched={touched.type}
              options={vehicleTypeOptions}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              type="number"
              name="capacity"
              label="Capacity (tons)"
              value={values.capacity}
              onChange={handleChange('capacity')}
              onBlur={handleBlur('capacity')}
              error={errors.capacity}
              touched={touched.capacity}
              required
              placeholder="5.0"
            />

            <FormField
              type="select"
              name="fuelType"
              label="Fuel Type"
              value={values.fuelType}
              onChange={handleChange('fuelType')}
              onBlur={handleBlur('fuelType')}
              error={errors.fuelType}
              touched={touched.fuelType}
              options={fuelTypeOptions}
              required
            />

            <FormField
              type="number"
              name="year"
              label="Year"
              value={values.year}
              onChange={handleChange('year')}
              onBlur={handleBlur('year')}
              error={errors.year}
              touched={touched.year}
              required
              placeholder={currentYear.toString()}
              icon={<CalendarIcon className="w-5 h-5" />}
            />
          </div>
        </FormSection>

        <FormSection
          title="Assignment & Status"
          description="Set driver assignment and vehicle status"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              helperText="Enter the ID of the assigned driver"
            />

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
          </div>
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
            {isEdit ? 'Update Vehicle' : 'Create Vehicle'}
          </Button>
        </FormActions>
      </form>
    </Modal>
  );
};

export default VehicleModal;
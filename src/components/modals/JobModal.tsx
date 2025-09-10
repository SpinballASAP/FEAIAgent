'use client';

import React, { useMemo } from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { FormField, FormSection, FormActions, FormErrorSummary } from '@/components/forms/FormField';
import { useForm } from '@/hooks/useForm';
import { jobValidationSchema } from '@/lib/validation';
import { Job, JobStatus, JobPriority } from '@/types/api';
import { 
  BriefcaseIcon, 
  UserIcon, 
  MapPinIcon, 
  CurrencyDollarIcon,
  ScaleIcon,
  ExclamationTriangleIcon 
} from '@heroicons/react/24/outline';

interface JobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (job: Partial<Job>) => void;
  job?: Job;
  isLoading?: boolean;
}

interface JobFormData {
  title: string;
  description: string;
  customerId: string;
  pickupAddress: string;
  deliveryAddress: string;
  pickupDate: string;
  deliveryDate: string;
  weight: string;
  value: string;
  priority: JobPriority | '';
  status: JobStatus;
  specialInstructions: string;
}

const JobModal: React.FC<JobModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  job,
  isLoading = false,
}) => {
  const isEdit = !!job;
  
  const initialValues: JobFormData = {
    title: job?.title || '',
    description: job?.description || '',
    customerId: job?.customerId?.toString() || '',
    pickupAddress: job?.pickupAddress || '',
    deliveryAddress: job?.deliveryAddress || '',
    pickupDate: job?.pickupDate || '',
    deliveryDate: job?.deliveryDate || '',
    weight: job?.weight?.toString() || '',
    value: job?.value?.toString() || '',
    priority: job?.priority || '',
    status: job?.status || 'pending',
    specialInstructions: job?.specialInstructions || '',
  };

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
  } = useForm<JobFormData>({
    initialValues,
    validationSchema: jobValidationSchema,
    validateOnBlur: true,
    onSubmit: async (formData) => {
      const jobData: Partial<Job> = {
        ...formData,
        customerId: parseInt(formData.customerId) || 0,
        weight: parseFloat(formData.weight) || undefined,
        value: parseFloat(formData.value) || undefined,
        priority: formData.priority as JobPriority,
        pickupDate: formData.pickupDate || undefined,
        deliveryDate: formData.deliveryDate || undefined,
        specialInstructions: formData.specialInstructions || undefined,
      };
      
      if (isEdit) {
        jobData.id = job.id;
      }
      
      await onSubmit(jobData);
    },
  });

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const priorityOptions = [
    { value: '', label: 'Select priority', disabled: true },
    { value: 'low', label: 'Low Priority' },
    { value: 'normal', label: 'Normal Priority' },
    { value: 'high', label: 'High Priority' },
    { value: 'urgent', label: 'Urgent' },
  ];

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'assigned', label: 'Assigned' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  const today = useMemo(() => new Date().toISOString().split('T')[0], []);

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEdit ? `Edit Job - ${job?.title}` : 'Add New Job'}
      size="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormErrorSummary errors={errors} />
        
        <FormSection
          title="Job Details"
          description="Enter the basic job information"
        >
          <FormField
            type="text"
            name="title"
            label="Job Title"
            value={values.title}
            onChange={handleChange('title')}
            onBlur={handleBlur('title')}
            error={errors.title}
            touched={touched.title}
            required
            placeholder="Enter job title"
            icon={<BriefcaseIcon className="w-5 h-5" />}
          />

          <FormField
            type="textarea"
            name="description"
            label="Description"
            value={values.description}
            onChange={handleChange('description')}
            onBlur={handleBlur('description')}
            error={errors.description}
            touched={touched.description}
            placeholder="Enter job description (optional)"
            rows={3}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              type="number"
              name="customerId"
              label="Customer ID"
              value={values.customerId}
              onChange={handleChange('customerId')}
              onBlur={handleBlur('customerId')}
              error={errors.customerId}
              touched={touched.customerId}
              required
              placeholder="Enter customer ID"
              icon={<UserIcon className="w-5 h-5" />}
            />

            <FormField
              type="select"
              name="priority"
              label="Priority"
              value={values.priority}
              onChange={handleChange('priority')}
              onBlur={handleBlur('priority')}
              error={errors.priority}
              touched={touched.priority}
              options={priorityOptions}
              required
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

        <FormSection
          title="Pickup & Delivery"
          description="Specify pickup and delivery details"
        >
          <div className="space-y-4">
            <FormField
              type="textarea"
              name="pickupAddress"
              label="Pickup Address"
              value={values.pickupAddress}
              onChange={handleChange('pickupAddress')}
              onBlur={handleBlur('pickupAddress')}
              error={errors.pickupAddress}
              touched={touched.pickupAddress}
              required
              placeholder="Enter pickup address"
              rows={2}
            />

            <FormField
              type="textarea"
              name="deliveryAddress"
              label="Delivery Address"
              value={values.deliveryAddress}
              onChange={handleChange('deliveryAddress')}
              onBlur={handleBlur('deliveryAddress')}
              error={errors.deliveryAddress}
              touched={touched.deliveryAddress}
              required
              placeholder="Enter delivery address"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              type="date"
              name="pickupDate"
              label="Pickup Date"
              value={values.pickupDate}
              onChange={handleChange('pickupDate')}
              onBlur={handleBlur('pickupDate')}
              error={errors.pickupDate}
              touched={touched.pickupDate}
              min={today}
            />

            <FormField
              type="date"
              name="deliveryDate"
              label="Delivery Date"
              value={values.deliveryDate}
              onChange={handleChange('deliveryDate')}
              onBlur={handleBlur('deliveryDate')}
              error={errors.deliveryDate}
              touched={touched.deliveryDate}
              min={values.pickupDate || today}
            />
          </div>
        </FormSection>

        <FormSection
          title="Cargo Information"
          description="Specify weight, value, and special requirements"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              type="number"
              name="weight"
              label="Weight (kg)"
              value={values.weight}
              onChange={handleChange('weight')}
              onBlur={handleBlur('weight')}
              error={errors.weight}
              touched={touched.weight}
              placeholder="0.0"
              icon={<ScaleIcon className="w-5 h-5" />}
            />

            <FormField
              type="number"
              name="value"
              label="Cargo Value (THB)"
              value={values.value}
              onChange={handleChange('value')}
              onBlur={handleBlur('value')}
              error={errors.value}
              touched={touched.value}
              placeholder="0.00"
              icon={<CurrencyDollarIcon className="w-5 h-5" />}
            />
          </div>

          <FormField
            type="textarea"
            name="specialInstructions"
            label="Special Instructions"
            value={values.specialInstructions}
            onChange={handleChange('specialInstructions')}
            onBlur={handleBlur('specialInstructions')}
            error={errors.specialInstructions}
            touched={touched.specialInstructions}
            placeholder="Enter any special handling requirements (optional)"
            rows={3}
            helperText="Include fragile items, temperature requirements, etc."
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
            {isEdit ? 'Update Job' : 'Create Job'}
          </Button>
        </FormActions>
      </form>
    </Modal>
  );
};

export default JobModal;
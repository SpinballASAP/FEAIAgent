'use client';

import React from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { FormField, FormSection, FormActions, FormErrorSummary } from '@/components/forms/FormField';
import { useForm } from '@/hooks/useForm';
import { customerValidationSchema } from '@/lib/validation';
import { Customer } from '@/types/api';
import { UserIcon, EnvelopeIcon, PhoneIcon, MapPinIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';

interface CustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (customer: Partial<Customer>) => void;
  customer?: Customer;
  isLoading?: boolean;
}

interface CustomerFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  creditLimit: string;
  status: 'active' | 'inactive';
}

const CustomerModal: React.FC<CustomerModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  customer,
  isLoading = false,
}) => {
  const isEdit = !!customer;
  
  const initialValues: CustomerFormData = {
    name: customer?.name || '',
    email: customer?.email || '',
    phone: customer?.phone || '',
    address: customer?.address || '',
    creditLimit: customer?.creditLimit?.toString() || '0',
    status: customer?.status || 'active',
  };

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
  } = useForm<CustomerFormData>({
    initialValues,
    validationSchema: customerValidationSchema,
    validateOnBlur: true,
    onSubmit: async (formData) => {
      const customerData: Partial<Customer> = {
        ...formData,
        creditLimit: parseFloat(formData.creditLimit) || 0,
      };
      
      if (isEdit) {
        customerData.id = customer.id;
      }
      
      await onSubmit(customerData);
    },
  });

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEdit ? `Edit Customer - ${customer?.name}` : 'Add New Customer'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormErrorSummary errors={errors} />
        
        <FormSection
          title="Basic Information"
          description="Enter the customer's basic details"
        >
          <FormField
            type="text"
            name="name"
            label="Customer Name"
            value={values.name}
            onChange={handleChange('name')}
            onBlur={handleBlur('name')}
            error={errors.name}
            touched={touched.name}
            required
            placeholder="Enter customer name"
            icon={<UserIcon className="w-5 h-5" />}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              type="email"
              name="email"
              label="Email Address"
              value={values.email}
              onChange={handleChange('email')}
              onBlur={handleBlur('email')}
              error={errors.email}
              touched={touched.email}
              required
              placeholder="customer@example.com"
              icon={<EnvelopeIcon className="w-5 h-5" />}
            />

            <FormField
              type="tel"
              name="phone"
              label="Phone Number"
              value={values.phone}
              onChange={handleChange('phone')}
              onBlur={handleBlur('phone')}
              error={errors.phone}
              touched={touched.phone}
              required
              placeholder="+66 xx xxx xxxx"
              icon={<PhoneIcon className="w-5 h-5" />}
            />
          </div>

          <FormField
            type="textarea"
            name="address"
            label="Address"
            value={values.address}
            onChange={handleChange('address')}
            onBlur={handleBlur('address')}
            error={errors.address}
            touched={touched.address}
            required
            placeholder="Enter full address"
            rows={3}
          />
        </FormSection>

        <FormSection
          title="Account Settings"
          description="Configure customer account preferences"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              type="number"
              name="creditLimit"
              label="Credit Limit (THB)"
              value={values.creditLimit}
              onChange={handleChange('creditLimit')}
              onBlur={handleBlur('creditLimit')}
              error={errors.creditLimit}
              touched={touched.creditLimit}
              placeholder="0.00"
              icon={<CurrencyDollarIcon className="w-5 h-5" />}
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
            {isEdit ? 'Update Customer' : 'Create Customer'}
          </Button>
        </FormActions>
      </form>
    </Modal>
  );
};

export default CustomerModal;
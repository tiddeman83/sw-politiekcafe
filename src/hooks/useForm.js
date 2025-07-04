import { useState } from 'react';

const initialFormData = {
  naam: '',
  email: '',
  lidVanSamenwerkt: '',
  komtNaarCafe: '',
  telefoonnummer: '',
  opmerkingen: ''
};

export const useForm = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.naam.trim()) {
      newErrors.naam = 'Naam is verplicht';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'E-mailadres is verplicht';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Geldig e-mailadres is verplicht';
    }
    
    if (!formData.lidVanSamenwerkt) {
      newErrors.lidVanSamenwerkt = 'Geef aan of u lid bent van SamenWerkt';
    }
    
    if (!formData.komtNaarCafe) {
      newErrors.komtNaarCafe = 'Geef aan of u naar het politiek café komt';
    }
    
    if (!formData.telefoonnummer.trim()) {
      newErrors.telefoonnummer = 'Telefoonnummer is verplicht';
    } else if (!/^\d{8,}$/.test(formData.telefoonnummer.replace(/\s/g, ''))) {
      newErrors.telefoonnummer = 'Geldig telefoonnummer is verplicht (minimaal 8 cijfers)';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setErrors({});
  };

  return {
    formData,
    isSubmitting,
    setIsSubmitting,
    errors,
    handleChange,
    validateForm,
    resetForm,
  };
};
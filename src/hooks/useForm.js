import { useState } from 'react';
import { validateFormData, hasErrors } from '../utils/validation';

const initialFormData = {
  naam: '',
  adres: '',
  geboortedatum: '',
  telefoon: '',
  email: '',
  lidmaatschap: 'vrijwillig',
  vrijwilligeBijdrage: '',
  opleidingsachtergrond: '',
  studerend: '',
  studierichting: '',
  professie: '',
  gepensioneerd: '',
  vrijwilligerswerk: '',
  politiekeErvaring: '',
  interessegebied: '',
  activiteiten: {
    communicatie: false,
    ict: false,
    bestuurswerk: false,
    fractielidmaatschap: false,
    professioneleKennis: false,
    campagne: false,
    anders: false,
  },
  andereActiviteiten: '',
};

export const useForm = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.startsWith('activiteiten.')) {
      const activity = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        activiteiten: {
          ...prev.activiteiten,
          [activity]: checked,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = validateFormData(formData);
    setErrors(newErrors);
    return !hasErrors(newErrors);
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
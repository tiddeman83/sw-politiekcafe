export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone) => {
  const phoneRegex = /^[+]?[\d\s\-()]{8,}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

export const validateFormData = (formData) => {
  const errors = {};
  
  if (!formData.naam || formData.naam.trim().length < 2) {
    errors.naam = 'Naam is verplicht en moet minimaal 2 karakters bevatten.';
  }
  
  if (!formData.adres || formData.adres.trim().length < 5) {
    errors.adres = 'Adres is verplicht en moet minimaal 5 karakters bevatten.';
  }
  
  if (!formData.geboortedatum) {
    errors.geboortedatum = 'Geboortedatum is verplicht.';
  } else {
    const birthDate = new Date(formData.geboortedatum);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    if (age < 16 || age > 120) {
      errors.geboortedatum = 'Geboortedatum lijkt niet correct.';
    }
  }
  
  if (!formData.telefoon || !validatePhone(formData.telefoon)) {
    errors.telefoon = 'Een geldig telefoonnummer is verplicht.';
  }
  
  if (!formData.email || !validateEmail(formData.email)) {
    errors.email = 'Een geldig e-mailadres is verplicht.';
  }
  
  if (!formData.lidmaatschap) {
    errors.lidmaatschap = 'Selecteer een lidmaatschapstype.';
  }
  
  if (formData.lidmaatschap === 'vrijwillig' && formData.vrijwilligeBijdrage && isNaN(parseFloat(formData.vrijwilligeBijdrage))) {
    errors.vrijwilligeBijdrage = 'Voer een geldig bedrag in.';
  }
  
  return errors;
};

export const hasErrors = (errors) => {
  return Object.keys(errors).length > 0;
};
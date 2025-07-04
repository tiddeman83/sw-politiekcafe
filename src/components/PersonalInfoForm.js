import React from 'react';
import { TextField, Box } from '@mui/material';

const PersonalInfoForm = ({ formData, handleChange, errors = {} }) => {
  return (
    <>
      <Box sx={{ width: '100%', mb: 2 }}>
        <TextField
          name="naam"
          label="Naam"
          fullWidth
          required
          value={formData.naam}
          onChange={handleChange}
          error={!!errors.naam}
          helperText={errors.naam}
        />
      </Box>
      
      <Box sx={{ width: '100%', mb: 2 }}>
        <TextField
          name="adres"
          label="Adres"
          fullWidth
          required
          value={formData.adres}
          onChange={handleChange}
          error={!!errors.adres}
          helperText={errors.adres}
        />
      </Box>
      
      <Box sx={{ width: '100%', mb: 2 }}>
        <TextField
          name="geboortedatum"
          label="Geboortedatum"
          type="date"
          fullWidth
          required
          InputLabelProps={{ shrink: true }}
          value={formData.geboortedatum}
          onChange={handleChange}
          error={!!errors.geboortedatum}
          helperText={errors.geboortedatum}
        />
      </Box>
      
      <Box sx={{ width: '100%', mb: 2 }}>
        <TextField
          name="telefoon"
          label="Telefoon"
          fullWidth
          required
          value={formData.telefoon}
          onChange={handleChange}
          error={!!errors.telefoon}
          helperText={errors.telefoon}
        />
      </Box>
      
      <Box sx={{ width: '100%', mb: 2 }}>
        <TextField
          name="email"
          label="E-mail"
          type="email"
          fullWidth
          required
          value={formData.email}
          onChange={handleChange}
          error={!!errors.email}
          helperText={errors.email}
        />
      </Box>
    </>
  );
};

export default PersonalInfoForm;
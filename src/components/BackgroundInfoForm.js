import React from 'react';
import {
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  FormControlLabel,
  Box
} from '@mui/material';

const BackgroundInfoForm = ({ formData, handleChange, errors = {} }) => {
  return (
    <>
      <Box sx={{ width: '100%', mb: 2 }}>
        <TextField
          name="opleidingsachtergrond"
          label="Opleidingsachtergrond"
          fullWidth
          value={formData.opleidingsachtergrond}
          onChange={handleChange}
        />
      </Box>

      <Box sx={{ width: '100%', mb: 2 }}>
        <FormControl component="fieldset" fullWidth>
          <FormLabel component="legend" sx={{ mb: 2 }}>Studerend?</FormLabel>
          <RadioGroup 
            row 
            name="studerend" 
            value={formData.studerend} 
            onChange={handleChange}
            sx={{ mb: 2 }}
          >
            <FormControlLabel value="ja" control={<Radio />} label="Ja" />
            <FormControlLabel value="nee" control={<Radio />} label="Nee" />
          </RadioGroup>
          
          {formData.studerend === 'ja' && (
            <TextField
              name="studierichting"
              label="Welke studierichting?"
              fullWidth
              value={formData.studierichting}
              onChange={handleChange}
              sx={{ mt: 2 }}
            />
          )}
        </FormControl>
      </Box>

      <Box sx={{ width: '100%', mb: 2 }}>
        <TextField
          name="professie"
          label="Professie"
          fullWidth
          value={formData.professie}
          onChange={handleChange}
        />
      </Box>

      <Box sx={{ width: '100%', mb: 2 }}>
        <FormControl component="fieldset" fullWidth>
          <FormLabel component="legend" sx={{ mb: 2 }}>Gepensioneerd?</FormLabel>
          <RadioGroup 
            row 
            name="gepensioneerd" 
            value={formData.gepensioneerd} 
            onChange={handleChange}
          >
            <FormControlLabel value="ja" control={<Radio />} label="Ja" />
            <FormControlLabel value="nee" control={<Radio />} label="Nee" />
          </RadioGroup>
        </FormControl>
      </Box>

      <Box sx={{ width: '100%', mb: 2 }}>
        <TextField
          name="vrijwilligerswerk"
          label="Vrijwilligerswerk of nevenfuncties"
          fullWidth
          multiline
          rows={3}
          value={formData.vrijwilligerswerk}
          onChange={handleChange}
        />
      </Box>

      <Box sx={{ width: '100%', mb: 2 }}>
        <TextField
          name="politiekeErvaring"
          label="Politieke ervaring"
          fullWidth
          multiline
          rows={3}
          value={formData.politiekeErvaring}
          onChange={handleChange}
        />
      </Box>

      <Box sx={{ width: '100%', mb: 2 }}>
        <TextField
          name="interessegebied"
          label="Interessegebied"
          fullWidth
          multiline
          rows={3}
          value={formData.interessegebied}
          onChange={handleChange}
        />
      </Box>
    </>
  );
};

export default BackgroundInfoForm;
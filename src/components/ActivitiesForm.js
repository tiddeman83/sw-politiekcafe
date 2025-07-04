import React from 'react';
import {
  TextField,
  FormControl,
  FormLabel,
  FormControlLabel,
  Checkbox,
  Box
} from '@mui/material';

const ActivitiesForm = ({ formData, handleChange, errors = {} }) => {
  return (
    <>
      <Box sx={{ width: '100%', mb: 2 }}>
        <FormControl component="fieldset" fullWidth>
          <FormLabel component="legend" sx={{ mb: 3, fontSize: '1.1rem', fontWeight: 600 }}>
            Welke activiteiten of werkzaamheden zou u (eventueel) willen uitoefenen voor de plaatselijke politiek?
          </FormLabel>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControlLabel 
              control={
                <Checkbox 
                  checked={formData.activiteiten.communicatie} 
                  onChange={handleChange} 
                  name="activiteiten.communicatie" 
                />
              } 
              label="Communicatie/marketing" 
              sx={{ alignItems: 'flex-start' }}
            />
            
            <FormControlLabel 
              control={
                <Checkbox 
                  checked={formData.activiteiten.ict} 
                  onChange={handleChange} 
                  name="activiteiten.ict" 
                />
              } 
              label="Werkzaamheden op het gebied van ICT" 
              sx={{ alignItems: 'flex-start' }}
            />
            
            <FormControlLabel 
              control={
                <Checkbox 
                  checked={formData.activiteiten.bestuurswerk} 
                  onChange={handleChange} 
                  name="activiteiten.bestuurswerk" 
                />
              } 
              label="Bestuurswerk" 
              sx={{ alignItems: 'flex-start' }}
            />
            
            <FormControlLabel 
              control={
                <Checkbox 
                  checked={formData.activiteiten.fractielidmaatschap} 
                  onChange={handleChange} 
                  name="activiteiten.fractielidmaatschap" 
                />
              } 
              label="(Steun)fractielidmaatschap" 
              sx={{ alignItems: 'flex-start' }}
            />
            
            <FormControlLabel 
              control={
                <Checkbox 
                  checked={formData.activiteiten.professioneleKennis} 
                  onChange={handleChange} 
                  name="activiteiten.professioneleKennis" 
                />
              } 
              label="Mijn professionele kennis inbrengen op aanvraag van de fractie" 
              sx={{ alignItems: 'flex-start' }}
            />
            
            <FormControlLabel 
              control={
                <Checkbox 
                  checked={formData.activiteiten.campagne} 
                  onChange={handleChange} 
                  name="activiteiten.campagne" 
                />
              } 
              label="Meedoen met activiteiten, bijv. tijdens campagne" 
              sx={{ alignItems: 'flex-start' }}
            />
            
            <Box>
              <FormControlLabel 
                control={
                  <Checkbox 
                    checked={formData.activiteiten.anders} 
                    onChange={handleChange} 
                    name="activiteiten.anders" 
                  />
                } 
                label="Iets anders?" 
                sx={{ alignItems: 'flex-start', mb: 1 }}
              />
              
              {formData.activiteiten.anders && (
                <Box sx={{ ml: 4, mt: 2, width: '50%', maxWidth: '250px' }}>
                  <TextField
                    name="andereActiviteiten"
                    label="Beschrijf andere activiteiten"
                    fullWidth
                    multiline
                    rows={2}
                    value={formData.andereActiviteiten}
                    onChange={handleChange}
                    placeholder="Beschrijf hier welke andere activiteiten u zou willen doen..."
                  />
                </Box>
              )}
            </Box>
          </Box>
        </FormControl>
      </Box>
    </>
  );
};

export default ActivitiesForm;
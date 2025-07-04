import React from 'react';
import {
  TextField,
  FormControl,
  RadioGroup,
  Radio,
  FormControlLabel,
  Typography,
  Box
} from '@mui/material';

const MembershipForm = ({ formData, handleChange, errors = {} }) => {
  return (
    <>
      <Box sx={{ width: '100%', mb: 2 }}>
        <FormControl component="fieldset" error={!!errors.lidmaatschap} fullWidth>
          <RadioGroup
            name="lidmaatschap"
            value={formData.lidmaatschap}
            onChange={handleChange}
            sx={{ gap: 2 }}
          >
            <Box>
              <FormControlLabel
                value="vrijwillig"
                control={<Radio />}
                label="Ik ben tevens lid van PvdA en/of GroenLinks en ik betaal daarom een vrijwillige ledenbijdrage per jaar."
                sx={{ mb: 1, alignItems: 'flex-start' }}
              />
              {formData.lidmaatschap === 'vrijwillig' && (
                <Box sx={{ ml: 4, mt: 2, width: '50%', maxWidth: '250px' }}>
                  <TextField
                    name="vrijwilligeBijdrage"
                    label="Jaarbijdrage"
                    value={formData.vrijwilligeBijdrage}
                    onChange={handleChange}
                    fullWidth
                    placeholder="0"
                    error={!!errors.vrijwilligeBijdrage}
                    helperText={errors.vrijwilligeBijdrage || "Dit mag ook €0,- zijn"}
                    InputProps={{
                      startAdornment: <Typography sx={{ mr: 1, color: 'text.secondary' }}>€</Typography>,
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: 'rgba(76, 175, 80, 0.05)',
                      },
                    }}
                  />
                </Box>
              )}
            </Box>
            
            <FormControlLabel
              value="standaard"
              control={<Radio />}
              label="Ik betaal de jaarlijkse ledenbijdrage van €35,-. Bij lidmaatschappen die ingaan na 1 juli is de ledenbijdrage €17,50 voor het lopende jaar."
              sx={{ alignItems: 'flex-start' }}
            />
            
            <FormControlLabel
              value="korting"
              control={<Radio />}
              label="Ik maak gebruik van de leeftijdskorting tot 18 jaar en betaal €20 voor een heel jaar en per 1 juli €10,-"
              sx={{ alignItems: 'flex-start' }}
            />
          </RadioGroup>
        </FormControl>
      </Box>

      <Box sx={{ width: '100%', mb: 2 }}>
        <Typography 
          variant="body1" 
          sx={{ 
            p: 3, 
            backgroundColor: 'rgba(76, 175, 80, 0.08)', 
            borderRadius: 2,
            border: '1px solid rgba(76, 175, 80, 0.2)'
          }}
        >
          💳 <strong>Betaalinformatie:</strong> Ik betaal mijn bijdrage op banknummer <strong>NL69TRIO0320770036</strong> t.n.v. SamenWerkt Wijk bij Duurstede met vermelding van uw naam + contributie 2025.
        </Typography>
      </Box>
    </>
  );
};

export default MembershipForm;
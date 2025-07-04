import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  FormLabel,
  Alert,
  CircularProgress,
  Fade,
  Slide
} from '@mui/material';
import {
  CoffeeTwoTone as CafeIcon,
  Send as SendIcon,
  CheckCircle as CheckIcon
} from '@mui/icons-material';
import Header from './components/Header';
import SuccessModal from './components/SuccessModal';

function App() {
  const [formData, setFormData] = useState({
    naam: '',
    email: '',
    lidVanSamenwerkt: '',
    komtNaarCafe: '',
    telefoonnummer: '',
    opmerkingen: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setSubmitStatus({ 
        type: 'error', 
        message: 'Controleer de verplichte velden en probeer opnieuw.' 
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus({ type: '', message: '' });

    try {
      const response = await fetch('http://localhost:3001/api/cafe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Er is een fout opgetreden');
      }

      const result = await response.json();
      
      if (result.success) {
        setSubmitStatus({ type: '', message: '' });
        setShowSuccessModal(true);
        
        // Reset form
        setTimeout(() => {
          setFormData({
            naam: '',
            email: '',
            lidVanSamenwerkt: '',
            komtNaarCafe: '',
            telefoonnummer: '',
            opmerkingen: ''
          });
          setErrors({});
        }, 100);
      } else {
        throw new Error(result.message || 'Er is een fout opgetreden');
      }
      
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitStatus({ 
        type: 'error', 
        message: error.message || 'Er is een onbekende fout opgetreden.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh' }}>
      <Header />
      
      <Container maxWidth="md" sx={{ py: { xs: 4, md: 8 }, px: { xs: 2, sm: 3 } }}>
        <Fade in timeout={800}>
          <Box>
            {submitStatus.message && !showSuccessModal && (
              <Slide direction="down" in={!!submitStatus.message} mountOnEnter unmountOnExit>
                <Alert 
                  severity={submitStatus.type} 
                  sx={{ 
                    mb: 4,
                    borderRadius: '12px',
                    fontSize: '1.1rem',
                    fontWeight: 500,
                  }}
                  onClose={() => setSubmitStatus({ type: '', message: '' })}
                >
                  {submitStatus.message}
                </Alert>
              </Slide>
            )}

            <Paper 
              elevation={0}
              sx={{
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(20px)',
                borderRadius: '20px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 16px 40px rgba(0, 0, 0, 0.1)',
                overflow: 'hidden',
                p: { xs: 3, sm: 4, md: 6 }
              }}
            >
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <CafeIcon sx={{ fontSize: 60, color: '#8B4513', mb: 2 }} />
                <Typography 
                  variant="h3" 
                  component="h1" 
                  sx={{ 
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, #e53935, #4caf50)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: 2
                  }}
                >
                  Politiek Café
                </Typography>
                <Typography variant="h6" color="text.secondary">
                  Aanmelden voor het politiek café van SamenWerkt
                </Typography>
              </Box>

              <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <TextField
                    name="naam"
                    label="Naam"
                    value={formData.naam}
                    onChange={handleChange}
                    error={!!errors.naam}
                    helperText={errors.naam}
                    fullWidth
                    required
                    variant="outlined"
                    sx={{ 
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      }
                    }}
                  />

                  <TextField
                    name="email"
                    label="E-mailadres"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    error={!!errors.email}
                    helperText={errors.email}
                    fullWidth
                    required
                    variant="outlined"
                    sx={{ 
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      }
                    }}
                  />

                  <FormControl error={!!errors.lidVanSamenwerkt}>
                    <FormLabel sx={{ fontWeight: 600, color: '#333', mb: 1 }}>
                      Ik ben lid van SamenWerkt
                    </FormLabel>
                    <RadioGroup
                      name="lidVanSamenwerkt"
                      value={formData.lidVanSamenwerkt}
                      onChange={handleChange}
                      row
                    >
                      <FormControlLabel value="ja" control={<Radio />} label="Ja" />
                      <FormControlLabel value="nee" control={<Radio />} label="Nee" />
                    </RadioGroup>
                    {errors.lidVanSamenwerkt && (
                      <Typography color="error" variant="caption" sx={{ mt: 1 }}>
                        {errors.lidVanSamenwerkt}
                      </Typography>
                    )}
                  </FormControl>

                  <FormControl error={!!errors.komtNaarCafe}>
                    <FormLabel sx={{ fontWeight: 600, color: '#333', mb: 1 }}>
                      Ik kom graag op het politiek café
                    </FormLabel>
                    <RadioGroup
                      name="komtNaarCafe"
                      value={formData.komtNaarCafe}
                      onChange={handleChange}
                      row
                    >
                      <FormControlLabel value="ja" control={<Radio />} label="Ja" />
                      <FormControlLabel value="nee" control={<Radio />} label="Nee" />
                    </RadioGroup>
                    {errors.komtNaarCafe && (
                      <Typography color="error" variant="caption" sx={{ mt: 1 }}>
                        {errors.komtNaarCafe}
                      </Typography>
                    )}
                  </FormControl>

                  <TextField
                    name="telefoonnummer"
                    label="Telefoonnummer"
                    value={formData.telefoonnummer}
                    onChange={handleChange}
                    error={!!errors.telefoonnummer}
                    helperText={errors.telefoonnummer}
                    fullWidth
                    required
                    variant="outlined"
                    sx={{ 
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      }
                    }}
                  />

                  <TextField
                    name="opmerkingen"
                    label="Opmerkingen"
                    value={formData.opmerkingen}
                    onChange={handleChange}
                    fullWidth
                    multiline
                    rows={4}
                    variant="outlined"
                    placeholder="Eventuele opmerkingen of vragen..."
                    sx={{ 
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      }
                    }}
                  />

                  <Box sx={{ textAlign: 'center', mt: 4 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      disabled={isSubmitting}
                      startIcon={isSubmitting ? <CircularProgress size={20} /> : <SendIcon />}
                      sx={{
                        px: 6,
                        py: 2,
                        borderRadius: '12px',
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        background: 'linear-gradient(135deg, #e53935, #4caf50)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #d32f2f, #388e3c)',
                        }
                      }}
                    >
                      {isSubmitting ? 'Verzenden...' : 'Aanmelden'}
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Paper>
          </Box>
        </Fade>
      </Container>
      
      {/* Footer */}
      <Box
        sx={{
          background: 'rgba(44, 62, 80, 0.95)',
          color: 'white',
          py: 4,
          textAlign: 'center',
          backdropFilter: 'blur(10px)',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            2025 SamenWerkt Wijk bij Duurstede • Lokale politiek die ertoe doet
          </Typography>
        </Container>
      </Box>
      
      {/* Success Modal */}
      <SuccessModal 
        open={showSuccessModal} 
        onClose={() => setShowSuccessModal(false)}
        title="Aanmelding Ontvangen!"
        message="Bedankt voor uw aanmelding voor het politiek café. U ontvangt een bevestigingsmail met meer informatie."
      />
    </Box>
  );
}

export default App;
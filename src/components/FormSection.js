import React from 'react';
import { Box, Typography, Divider } from '@mui/material';

const FormSection = ({ title, subtitle, icon, children, color = 'primary.main' }) => {
  return (
    <Box
      sx={{
        background: 'rgba(255, 255, 255, 0.7)',
        borderRadius: '20px',
        p: { xs: 3, sm: 4, md: 5 },
        mb: { xs: 3, md: 4 },
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.8)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.06)',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.1)',
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: { xs: 3, md: 4 } }}>
        {icon && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 52,
              height: 52,
              borderRadius: '12px',
              background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
              color: 'white',
              mr: 2,
              fontSize: '1.6rem',
            }}
          >
            {icon}
          </Box>
        )}
        <Box>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              fontSize: '1.4rem',
              color: 'text.primary',
              mb: subtitle ? 0.5 : 0,
            }}
          >
            {title}
          </Typography>
          {subtitle && (
            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
                fontWeight: 400,
              }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>
      </Box>
      
      <Divider sx={{ mb: 4, opacity: 0.3 }} />
      
      {children}
    </Box>
  );
};

export default FormSection;
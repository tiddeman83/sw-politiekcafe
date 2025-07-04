import React from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import './index.css';
import App from './App';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2c3e50', // Dark slate for better readability
      light: '#34495e',
      dark: '#1a252f',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#4caf50', // GroenLinks green  
      light: '#80e27e',
      dark: '#087f23',
      contrastText: '#ffffff',
    },
    background: {
      default: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      paper: '#ffffff',
    },
    success: {
      main: '#4caf50',
      light: '#80e27e',
      dark: '#087f23',
    },
    error: {
      main: '#f44336',
      light: '#ff7961',
      dark: '#ba000d',
    },
    text: {
      primary: '#2c3e50',
      secondary: '#546e7a',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
      fontSize: '2.5rem',
      color: '#2c3e50',
      marginBottom: '0.5rem',
      letterSpacing: '-0.02em',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.5rem',
      color: '#e53935',
      marginBottom: '1rem',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.25rem',
      color: '#2c3e50',
      marginBottom: '1rem',
    },
    subtitle1: {
      fontSize: '1.1rem',
      color: '#546e7a',
      fontWeight: 400,
      lineHeight: 1.6,
    },
    body1: {
      lineHeight: 1.7,
      fontSize: '1rem',
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
      fontSize: '1rem',
    },
  },
  shape: {
    borderRadius: 16,
  },
  shadows: [
    'none',
    '0px 2px 4px rgba(0,0,0,0.05)',
    '0px 4px 8px rgba(0,0,0,0.08)',
    '0px 8px 16px rgba(0,0,0,0.1)',
    '0px 12px 24px rgba(0,0,0,0.12)',
    '0px 16px 32px rgba(0,0,0,0.15)',
    ...Array(20).fill('0px 24px 48px rgba(0,0,0,0.2)'),
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          minHeight: '100vh',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#ffffff',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.08), 0 8px 25px rgba(0, 0, 0, 0.06)',
          border: '1px solid rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(10px)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '1rem',
          borderRadius: '12px',
          padding: '12px 32px',
          boxShadow: 'none',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
          },
        },
        contained: {
          background: 'linear-gradient(135deg, #e53935 0%, #d32f2f 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #d32f2f 0%, #b71c1c 100%)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '12px',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            transition: 'all 0.3s ease',
            fontSize: '1.1rem',
            minHeight: '56px',
            '& .MuiOutlinedInput-input': {
              padding: '18px 16px',
              fontSize: '1.1rem',
              lineHeight: 1.5,
            },
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#4caf50',
                borderWidth: '2px',
              },
            },
            '&.Mui-focused': {
              backgroundColor: '#ffffff',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#e53935',
                borderWidth: '2px',
              },
            },
          },
          '& .MuiInputLabel-root': {
            fontWeight: 500,
            fontSize: '1.1rem',
            '&.Mui-focused': {
              color: '#e53935',
            },
            '&.MuiInputLabel-shrink': {
              fontSize: '1rem',
            },
          },
          '& .MuiFormHelperText-root': {
            fontSize: '0.95rem',
            marginTop: '8px',
            marginLeft: '2px',
            fontWeight: 500,
          },
          '& .MuiOutlinedInput-multiline': {
            padding: '0',
            '& .MuiOutlinedInput-input': {
              padding: '18px 16px',
              fontSize: '1.1rem',
              lineHeight: 1.6,
            },
          },
        },
      },
    },
    MuiFormControl: {
      styleOverrides: {
        root: {
          '& .MuiFormLabel-root': {
            fontWeight: 600,
            color: '#2c3e50',
            marginBottom: '8px',
            '&.Mui-focused': {
              color: '#e53935',
            },
          },
        },
      },
    },
    MuiRadio: {
      styleOverrides: {
        root: {
          color: '#4caf50',
          '&.Mui-checked': {
            color: '#e53935',
          },
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: '#4caf50',
          '&.Mui-checked': {
            color: '#e53935',
          },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          fontWeight: 500,
        },
      },
    },
    MuiGrid: {
      styleOverrides: {
        item: {
          '&.form-section': {
            backgroundColor: 'rgba(255, 255, 255, 0.4)',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '16px',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.6)',
          },
        },
      },
    },
  },
});

// Add Inter font to head
const link = document.createElement('link');
link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap';
link.rel = 'stylesheet';
document.head.appendChild(link);

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>
);

import { createTheme } from '@mui/material/styles';

// 科技风格主题
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00e5ff', // 霓虹蓝
      light: '#33eaff',
      dark: '#00a0b2',
    },
    secondary: {
      main: '#ff00e5', // 霓虹粉
      light: '#ff33ea',
      dark: '#b200a0',
    },
    background: {
      default: '#121212', // 深色背景
      paper: '#1e1e1e',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b0b0b0',
    },
  },
  typography: {
    fontFamily: '"Orbitron", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      letterSpacing: '0.05em',
    },
    h2: {
      fontWeight: 700,
      letterSpacing: '0.05em',
    },
    h3: {
      fontWeight: 600,
      letterSpacing: '0.04em',
    },
    h4: {
      fontWeight: 600,
      letterSpacing: '0.03em',
    },
    h5: {
      fontWeight: 500,
      letterSpacing: '0.02em',
    },
    h6: {
      fontWeight: 500,
      letterSpacing: '0.02em',
    },
    button: {
      fontWeight: 500,
      letterSpacing: '0.05em',
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 4,
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(90deg, #121212 0%, #1e1e1e 100%)',
          boxShadow: '0 4px 20px rgba(0, 229, 255, 0.15)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '4px',
          textTransform: 'none',
          padding: '8px 16px',
        },
        contained: {
          boxShadow: '0 0 10px rgba(0, 229, 255, 0.5)',
          '&:hover': {
            boxShadow: '0 0 15px rgba(0, 229, 255, 0.8)',
          },
        },
        outlined: {
          borderColor: '#00e5ff',
          '&:hover': {
            boxShadow: '0 0 10px rgba(0, 229, 255, 0.3)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'linear-gradient(135deg, rgba(18, 18, 18, 0.8) 0%, rgba(30, 30, 30, 0.9) 100%)',
          boxShadow: '0 8px 20px rgba(0, 0, 0, 0.5)',
          border: '1px solid rgba(0, 229, 255, 0.1)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'rgba(0, 229, 255, 0.3)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(0, 229, 255, 0.5)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#00e5ff',
              boxShadow: '0 0 5px rgba(0, 229, 255, 0.3)',
            },
          },
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: 'rgba(0, 229, 255, 0.2)',
        },
      },
    },
  },
});

export default theme;
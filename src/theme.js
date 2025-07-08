import { createTheme } from '@mui/material/styles';

// 现代化科技风格主题
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1890ff', // 腾讯云蓝色主调
      light: '#40a9ff',
      dark: '#096dd9',
    },
    secondary: {
      main: '#52c41a', // 绿色辅助色
      light: '#73d13d',
      dark: '#389e0d',
    },
    background: {
      default: '#ffffff', // 纯白背景
      paper: '#f8fafc',   // 浅灰白纸张背景
    },
    text: {
      primary: '#1e293b',   // 深灰文本
      secondary: '#64748b', // 中灰文本
    },
    success: {
      main: '#10b981', // 保持绿色
      light: '#34d399',
      dark: '#059669',
    },
    warning: {
      main: '#f59e0b', // 保持橙色
      light: '#fbbf24',
      dark: '#d97706',
    },
    error: {
      main: '#ef4444', // 保持红色
      light: '#f87171',
      dark: '#dc2626',
    },
  },
  typography: {
    fontFamily: '"Inter", "SF Pro Display", "Segoe UI", "Roboto", sans-serif',
    h1: {
      fontWeight: 800,
      letterSpacing: '-0.02em',
      background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #06b6d4 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    h2: {
      fontWeight: 700,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontWeight: 600,
      letterSpacing: '-0.005em',
    },
    h4: {
      fontWeight: 600,
      letterSpacing: '0em',
    },
    h5: {
      fontWeight: 500,
      letterSpacing: '0.01em',
    },
    h6: {
      fontWeight: 500,
      letterSpacing: '0.01em',
    },
    button: {
      fontWeight: 600,
      letterSpacing: '0.02em',
      textTransform: 'none',
    },
    body1: {
      lineHeight: 1.6,
    },
    body2: {
      lineHeight: 1.5,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 50%, #f1f5f9 100%)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(99, 102, 241, 0.15)',
          boxShadow: '0 2px 20px rgba(99, 102, 241, 0.08)',
          color: '#1e293b',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          textTransform: 'none',
          padding: '10px 20px',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        },
        contained: {
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
          boxShadow: '0 4px 20px rgba(99, 102, 241, 0.4)',
          '&:hover': {
            background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
            boxShadow: '0 8px 30px rgba(99, 102, 241, 0.6)',
            transform: 'translateY(-2px)',
          },
        },
        outlined: {
          borderColor: '#6366f1',
          borderWidth: '2px',
          '&:hover': {
            borderColor: '#8b5cf6',
            background: 'rgba(99, 102, 241, 0.1)',
            boxShadow: '0 4px 20px rgba(99, 102, 241, 0.2)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 4px 20px rgba(99, 102, 241, 0.08), 0 0 0 1px rgba(99, 102, 241, 0.05)',
          border: '1px solid rgba(99, 102, 241, 0.1)',
          borderRadius: '12px',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '& fieldset': {
              borderColor: 'rgba(99, 102, 241, 0.2)',
              borderWidth: '2px',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(99, 102, 241, 0.4)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#6366f1',
              boxShadow: '0 0 15px rgba(99, 102, 241, 0.2)',
            },
          },
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: 'rgba(99, 102, 241, 0.2)',
          background: 'linear-gradient(90deg, transparent 0%, rgba(99, 102, 241, 0.3) 50%, transparent 100%)',
          height: '1px',
          border: 'none',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.8) 100%)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(99, 102, 241, 0.08)',
          borderRadius: '16px',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 30px rgba(99, 102, 241, 0.12)',
            border: '1px solid rgba(99, 102, 241, 0.2)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
          border: '1px solid rgba(99, 102, 241, 0.2)',
          color: '#1e293b',
          fontWeight: 500,
          '&:hover': {
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%)',
          },
        },
      },
    },
  },
});

export default theme;
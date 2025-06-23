import React, { useState, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Container, Button, Box, useTheme, IconButton, Menu, MenuItem } from '@mui/material';
import CodeIcon from '@mui/icons-material/Code';
import TranslateIcon from '@mui/icons-material/Translate';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Home from './pages/Home';
import About from './pages/About';
import Portfolio from './pages/Portfolio';
import Contact from './pages/Contact';
import Resources from './pages/Resources';
import ArticleDetail from './pages/ArticleDetail';
import Admin from './pages/Admin';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Database from './pages/Database';
import Footer from './components/Footer';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import VipZone from './pages/VipZone';

// 创建语言上下文
export const LanguageContext = createContext();

// 用户菜单组件
function UserMenu() {
  const navigate = useNavigate();
  const { language } = useContext(LanguageContext);
  const { currentUser, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  
  // 处理用户菜单打开
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  // 处理用户菜单关闭
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  // 处理登出
  const handleLogout = () => {
    logout();
    handleMenuClose();
  };
  
  if (currentUser) {
    return (
      <>
        <IconButton 
          color="primary"
          onClick={handleMenuOpen}
          sx={{ 
            mx: 0.8,
            border: '1px solid rgba(0, 229, 255, 0.3)',
            '&:hover': { backgroundColor: 'rgba(0, 229, 255, 0.1)' }
          }}
        >
          <AccountCircleIcon />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          PaperProps={{
            sx: {
              background: 'rgba(30, 30, 30, 0.9)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(0, 229, 255, 0.2)',
              color: 'white',
            }
          }}
        >
          <MenuItem onClick={handleMenuClose}>
            <Typography variant="body2">
              {language === 'zh' ? '你好，' : 'Hello, '}{currentUser.username}
            </Typography>
          </MenuItem>
          <MenuItem onClick={() => { handleMenuClose(); navigate('/profile'); }}>
            <AccountCircleIcon fontSize="small" sx={{ mr: 1, color: 'rgba(0, 229, 255, 0.7)' }} />
            <Typography variant="body2">
              {language === 'zh' ? '个人中心' : 'Profile'}
            </Typography>
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            <LogoutIcon fontSize="small" sx={{ mr: 1, color: 'rgba(0, 229, 255, 0.7)' }} />
            <Typography variant="body2">
              {language === 'zh' ? '登出' : 'Logout'}
            </Typography>
          </MenuItem>
        </Menu>
      </>
    );
  }
  
  return (
    <Button 
      color="primary" 
      href="/login"
      startIcon={<PersonIcon />}
      sx={{ 
        mx: 0.8,
        border: '1px solid rgba(0, 229, 255, 0.3)',
        '&:hover': { backgroundColor: 'rgba(0, 229, 255, 0.1)' }
      }}
    >
      {language === 'zh' ? '登录' : 'Login'}
    </Button>
  );
}

// 导航栏组件
function NavigationBar() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { language, toggleLanguage } = useContext(LanguageContext);
  
  return (
    <AppBar position="static" elevation={0} sx={{ 
      background: 'linear-gradient(90deg, rgba(18,18,18,0.9) 0%, rgba(30,30,30,0.9) 100%)',
      borderBottom: '1px solid rgba(0, 229, 255, 0.2)'
    }}>
      <Toolbar>
        <CodeIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
        <Typography variant="h6" component="div" sx={{ 
          flexGrow: 1, 
          fontFamily: '"Orbitron", sans-serif',
          letterSpacing: '0.05em',
          background: 'linear-gradient(90deg, #00e5ff, #33eaff)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: '0 0 10px rgba(0, 229, 255, 0.5)'
        }}>
          CR Studio
        </Typography>
        <Button color="primary" onClick={() => navigate('/')} sx={{ mx: 0.8 }}>{language === 'zh' ? '首页' : 'Home'}</Button>
        <Button color="primary" onClick={() => navigate('/about')} sx={{ mx: 0.8 }}>{language === 'zh' ? '关于我' : 'About'}</Button>
        <Button color="primary" onClick={() => navigate('/portfolio')} sx={{ mx: 0.8 }}>{language === 'zh' ? '作品集' : 'Portfolio'}</Button>
        <Button color="primary" onClick={() => navigate('/resources')} sx={{ mx: 0.8 }}>{language === 'zh' ? '资料分享' : 'Resources'}</Button>
        <Button color="primary" onClick={() => navigate('/database')} sx={{ mx: 0.8 }}>{language === 'zh' ? '数据库' : 'Database'}</Button>
        <Button color="primary" onClick={() => navigate('/vip-zone')} sx={{ mx: 0.8, color: '#FFD700', '&:hover': { backgroundColor: 'rgba(255, 215, 0, 0.1)' } }}>{language === 'zh' ? '会员专区' : 'VIP Zone'}</Button>
        <Button color="primary" onClick={() => navigate('/contact')} sx={{ mx: 0.8 }}>{language === 'zh' ? '联系方式' : 'Contact'}</Button>
        
        <UserMenu />
        
        <IconButton 
          color="primary" 
          onClick={toggleLanguage}
          sx={{ 
            ml: 1, 
            border: '1px solid rgba(0, 229, 255, 0.3)',
            '&:hover': { backgroundColor: 'rgba(0, 229, 255, 0.1)' }
          }}
        >
          <TranslateIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}

function App() {
  const theme = useTheme();
  const [language, setLanguage] = useState('zh'); // 默认中文
  
  // 切换语言函数
  const toggleLanguage = () => {
    setLanguage(prev => prev === 'zh' ? 'en' : 'zh');
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage }}>
      <AuthProvider>
        <Router>
          <Box sx={{ 
            background: 'linear-gradient(to right, #121212, #1e1e1e)',
            minHeight: '100vh',
            backgroundSize: 'cover',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'radial-gradient(circle at 50% 50%, rgba(0, 229, 255, 0.05) 0%, rgba(0, 0, 0, 0) 70%)',
              pointerEvents: 'none',
            }
          }}>
            <NavigationBar />
        <Container maxWidth="md" sx={{ 
          mt: 4,
          position: 'relative',
          zIndex: 1,
          flex: '1 0 auto',
          mb: 4
        }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/database" element={<Database />} />
            <Route path="/article/:category/:id" element={<ArticleDetail />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/vip-zone" element={<VipZone />} />
          </Routes>
        </Container>
        <Footer />
      </Box>
    </Router>
    </AuthProvider>
    </LanguageContext.Provider>
  );
}

export default App;

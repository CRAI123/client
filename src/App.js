import React, { useState, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Container, Button, Box, useTheme, IconButton, Menu, MenuItem } from '@mui/material';

import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Home from './pages/Home';
import About from './pages/About';

import Contact from './pages/Contact';
import Resources from './pages/Resources';
import ArticleDetail from './pages/ArticleDetail';
import Admin from './pages/Admin';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Download from './pages/Download';
import PriceList from './pages/PriceList';
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
            border: '1px solid rgba(99, 102, 241, 0.3)',
            '&:hover': { backgroundColor: 'rgba(99, 102, 241, 0.1)' }
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
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(99, 102, 241, 0.2)',
              color: '#1e293b',
            }
          }}
        >
          <MenuItem onClick={handleMenuClose}>
            <Typography variant="body2">
              {language === 'zh' ? '你好，' : 'Hello, '}{currentUser.username}
            </Typography>
          </MenuItem>
          <MenuItem onClick={() => { handleMenuClose(); navigate('/profile'); }}>
            <AccountCircleIcon fontSize="small" sx={{ mr: 1, color: 'rgba(99, 102, 241, 0.7)' }} />
            <Typography variant="body2">
              {language === 'zh' ? '个人中心' : 'Profile'}
            </Typography>
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            <LogoutIcon fontSize="small" sx={{ mr: 1, color: 'rgba(99, 102, 241, 0.7)' }} />
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
        border: '1px solid rgba(99, 102, 241, 0.3)',
        '&:hover': { backgroundColor: 'rgba(99, 102, 241, 0.1)' }
      }}
    >
      {language === 'zh' ? '登录' : 'Login'}
    </Button>
  );
}

// 导航栏组件
function NavigationBar() {
  const navigate = useNavigate();
  const { language, toggleLanguage } = useContext(LanguageContext);
  const [languageMenuAnchor, setLanguageMenuAnchor] = useState(null);
  
  return (
    <AppBar position="static" elevation={0}>
      <Toolbar>
        <img 
          src="/favicon.ico" 
          alt="CR Studio Logo" 
          style={{ 
            width: 32, 
            height: 32, 
            marginRight: 8, 
            objectFit: 'contain' 
          }} 
        />
        <Typography variant="h6" component="div" sx={{ 
          flexGrow: 1, 
          fontFamily: '"Inter", sans-serif',
          letterSpacing: '0.02em',
          background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 700
        }}>
          CR Studio
        </Typography>
        <Button color="primary" onClick={() => navigate('/')} sx={{ mx: 0.8 }}>{language === 'zh' ? '首页' : 'Home'}</Button>
        <Button color="primary" onClick={() => navigate('/about')} sx={{ mx: 0.8 }}>{language === 'zh' ? '关于我' : 'About'}</Button>

        <Button color="primary" onClick={() => navigate('/resources')} sx={{ mx: 0.8 }}>{language === 'zh' ? '资料分享' : 'Resources'}</Button>
        <Button color="primary" onClick={() => navigate('/price-list')} sx={{ mx: 0.8 }}>{language === 'zh' ? '价格表' : 'Price List'}</Button>
        <Button color="primary" onClick={() => navigate('/download')} sx={{ mx: 0.8 }}>{language === 'zh' ? '应用下载' : 'Download'}</Button>
        <Button color="primary" onClick={() => navigate('/vip-zone')} sx={{ mx: 0.8, color: '#FFD700', '&:hover': { backgroundColor: 'rgba(255, 215, 0, 0.1)' } }}>{language === 'zh' ? '会员专区' : 'VIP Zone'}</Button>
        <Button color="primary" onClick={() => navigate('/contact')} sx={{ mx: 0.8 }}>{language === 'zh' ? '联系方式' : 'Contact'}</Button>
        
        <UserMenu />
        
        <Button
          color="primary"
          onClick={(event) => setLanguageMenuAnchor(event.currentTarget)}
          sx={{ 
            ml: 1, 
            border: '1px solid rgba(99, 102, 241, 0.3)',
            '&:hover': { backgroundColor: 'rgba(99, 102, 241, 0.1)' },
            minWidth: 'auto',
            px: 2
          }}
        >
          {language === 'zh' ? '中文' : 'English'}
        </Button>
        <Menu
          anchorEl={languageMenuAnchor}
          open={Boolean(languageMenuAnchor)}
          onClose={() => setLanguageMenuAnchor(null)}
          PaperProps={{
            sx: {
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(99, 102, 241, 0.2)',
              color: '#1e293b',
            }
          }}
        >
          <MenuItem 
            onClick={() => {
              if (language !== 'zh') toggleLanguage();
              setLanguageMenuAnchor(null);
            }}
            sx={{ 
              backgroundColor: language === 'zh' ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
              '&:hover': { backgroundColor: 'rgba(99, 102, 241, 0.1)' }
            }}
          >
            中文
          </MenuItem>
          <MenuItem 
            onClick={() => {
              if (language !== 'en') toggleLanguage();
              setLanguageMenuAnchor(null);
            }}
            sx={{ 
              backgroundColor: language === 'en' ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
              '&:hover': { backgroundColor: 'rgba(99, 102, 241, 0.1)' }
            }}
          >
            English
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}

function App() {
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
            background: 'linear-gradient(to right, #ffffff, #f8fafc)',
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
              background: 'radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.03) 0%, rgba(255, 255, 255, 0) 70%)',
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

            <Route path="/contact" element={<Contact />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/price-list" element={<PriceList />} />
            <Route path="/download" element={<Download />} />
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

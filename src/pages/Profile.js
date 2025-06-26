import React, { useState, useContext, useEffect } from 'react';
import { Box, Typography, Paper, List, ListItem, ListItemText, Divider, IconButton, Chip, Tab, Tabs, Alert, Avatar, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Badge, Tooltip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { LanguageContext } from '../App';
import { useAuth } from '../contexts/AuthContext';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import PersonIcon from '@mui/icons-material/Person';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EditIcon from '@mui/icons-material/Edit';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import DiamondIcon from '@mui/icons-material/Diamond';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

export default function Profile() {
  const navigate = useNavigate();
  const { language } = useContext(LanguageContext);
  const { currentUser, isAuthenticated, removeFavorite, updateUser } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [resources, setResources] = useState([]);
  const [avatarDialogOpen, setAvatarDialogOpen] = useState(false);
  const [signatureDialogOpen, setSignatureDialogOpen] = useState(false);
  const [usernameDialogOpen, setUsernameDialogOpen] = useState(false);
  const [newSignature, setNewSignature] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [avatarPreview, setAvatarPreview] = useState(null);
  
  // 如果用户未登录，重定向到登录页面
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);
  
  // 加载所有资源数据
  useEffect(() => {
    const loadResourcesData = () => {
      try {
        // 从localStorage获取资源数据
        const storedResources = localStorage.getItem('resourceData');
        
        if (storedResources) {
          // 解析存储的数据
          const parsedResources = JSON.parse(storedResources);
          setResources(parsedResources);
        } else {
          setResources([]);
        }
      } catch (error) {
        console.error('加载资源数据时出错:', error);
        setResources([]);
      }
    };
    
    loadResourcesData();
  }, []);
  
  // 处理标签页变化
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // 处理资源点击事件
  const handleResourceClick = (link) => {
    window.open(link, '_blank');
  };
  
  // 处理取消收藏
  const handleRemoveFavorite = (resourceId) => {
    removeFavorite(resourceId);
  };
  
  // 获取用户收藏的资源
  const getFavoriteResources = () => {
    if (!currentUser || !currentUser.favorites || !resources.length) {
      return [];
    }
    
    return resources.filter(resource => 
      currentUser.favorites.includes(resource.id)
    );
  };
  
  // 获取用户收藏的资源
  const favoriteResources = getFavoriteResources();

  // 获取会员等级信息
  const getMembershipInfo = () => {
    if (!currentUser) return { level: 'basic', isVip: false, color: '#666', icon: PersonIcon };
    
    const vipLevel = currentUser.vipLevel || 'basic';
    const isVip = currentUser.vipStatus || false;
    
    const levelConfig = {
      basic: { 
        name: language === 'zh' ? '普通用户' : 'Basic User', 
        color: '#666', 
        icon: PersonIcon,
        bgColor: 'rgba(102, 102, 102, 0.1)'
      },
      silver: { 
        name: language === 'zh' ? '银牌会员' : 'Silver Member', 
        color: '#C0C0C0', 
        icon: WorkspacePremiumIcon,
        bgColor: 'rgba(192, 192, 192, 0.1)'
      },
      gold: { 
        name: language === 'zh' ? '金牌会员' : 'Gold Member', 
        color: '#FFD700', 
        icon: EmojiEventsIcon,
        bgColor: 'rgba(255, 215, 0, 0.1)'
      },
      diamond: { 
        name: language === 'zh' ? '钻石会员' : 'Diamond Member', 
        color: '#B9F2FF', 
        icon: DiamondIcon,
        bgColor: 'rgba(185, 242, 255, 0.1)'
      }
    };
    
    return { ...levelConfig[vipLevel], level: vipLevel, isVip };
  };

  // 处理头像上传
  const handleAvatarUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // 保存头像
  const handleSaveAvatar = () => {
    if (avatarPreview && updateUser) {
      const updatedUser = {
        ...currentUser,
        avatar: avatarPreview
      };
      updateUser(updatedUser);
      setAvatarDialogOpen(false);
      setAvatarPreview(null);
    }
  };

  // 打开个性签名编辑对话框
  const handleEditSignature = () => {
    setNewSignature(currentUser?.signature || '');
    setSignatureDialogOpen(true);
  };

  // 保存个性签名
  const handleSaveSignature = () => {
    if (updateUser) {
      const updatedUser = {
        ...currentUser,
        signature: newSignature
      };
      updateUser(updatedUser);
      setSignatureDialogOpen(false);
    }
  };

  // 打开用户名编辑对话框
  const handleEditUsername = () => {
    setNewUsername(currentUser?.username || '');
    setUsernameDialogOpen(true);
  };

  // 保存用户名
  const handleSaveUsername = () => {
    if (updateUser && newUsername.trim()) {
      const updatedUser = {
        ...currentUser,
        username: newUsername.trim()
      };
      updateUser(updatedUser);
      setUsernameDialogOpen(false);
    }
  };

  // 获取会员到期时间
  const getVipExpiryDate = () => {
    if (!currentUser?.vipExpiresAt) return null;
    const date = new Date(currentUser.vipExpiresAt);
    return date.toLocaleDateString(language === 'zh' ? 'zh-CN' : 'en-US');
  };

  const membershipInfo = getMembershipInfo();
  
  // 分类名称映射
  const categoryNames = {
    article: language === 'zh' ? '技术文章' : 'Technical Articles',
    note: language === 'zh' ? '学习笔记' : 'Study Notes'
  };
  
  // 用户注册时间
  const getRegistrationDate = () => {
    if (!currentUser || !currentUser.createdAt) return '';
    
    const date = new Date(currentUser.createdAt);
    return date.toLocaleDateString(language === 'zh' ? 'zh-CN' : 'en-US');
  };
  
  if (!isAuthenticated) {
    return null; // 未登录时不渲染内容，等待重定向
  }
  
  return (
    <Box sx={{ mt: 4 }}>
      <Typography 
        variant="h4" 
        gutterBottom
        sx={{ 
          display: 'flex',
          alignItems: 'center',
          fontFamily: '"Orbitron", sans-serif',
          background: 'linear-gradient(90deg, #00e5ff, #33eaff)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: '0 0 10px rgba(0, 229, 255, 0.5)'
        }}
      >
        <AccountCircleIcon sx={{ mr: 1, color: '#00e5ff' }} />
        {language === 'zh' ? '个人中心' : 'Profile'}
      </Typography>
      <Divider sx={{ mb: 3 }} />
      
      {/* 用户信息卡片 */}
      <Paper 
        elevation={3} 
        sx={{ 
          p: 3, 
          mb: 3,
          background: 'rgba(30, 30, 30, 0.8)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(0, 229, 255, 0.2)',
          borderRadius: '8px',
        }}
      >
        {/* 头像和基本信息 */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
          <Box sx={{ position: 'relative', mr: 3 }}>
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              badgeContent={
                <Tooltip title={language === 'zh' ? '更换头像' : 'Change Avatar'}>
                  <IconButton
                    size="small"
                    onClick={() => setAvatarDialogOpen(true)}
                    sx={{
                      backgroundColor: 'rgba(0, 229, 255, 0.8)',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: 'rgba(0, 229, 255, 1)',
                      },
                      width: 28,
                      height: 28
                    }}
                  >
                    <PhotoCameraIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </Tooltip>
              }
            >
              <Avatar
                src={currentUser?.avatar}
                sx={{
                  width: 80,
                  height: 80,
                  border: `3px solid ${membershipInfo.color}`,
                  boxShadow: `0 0 15px ${membershipInfo.color}40`
                }}
              >
                {currentUser?.username?.charAt(0).toUpperCase()}
              </Avatar>
            </Badge>
          </Box>
          
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Typography variant="h5" sx={{ mr: 1 }}>{currentUser.username}</Typography>
              <Tooltip title={language === 'zh' ? '编辑用户名' : 'Edit Username'}>
                <IconButton
                  size="small"
                  onClick={handleEditUsername}
                  sx={{
                    color: 'rgba(0, 229, 255, 0.7)',
                    '&:hover': {
                      color: '#00e5ff',
                      backgroundColor: 'rgba(0, 229, 255, 0.1)'
                    },
                    mr: 1
                  }}
                >
                  <EditIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </Tooltip>
              <Chip
                icon={React.createElement(membershipInfo.icon, { sx: { fontSize: 16 } })}
                label={membershipInfo.name}
                sx={{
                  backgroundColor: membershipInfo.bgColor,
                  color: membershipInfo.color,
                  border: `1px solid ${membershipInfo.color}`,
                  fontWeight: 'bold'
                }}
              />
            </Box>
            
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {currentUser.email}
            </Typography>
            
            {/* 个性签名 */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography 
                variant="body2" 
                sx={{ 
                  fontStyle: 'italic',
                  color: 'text.secondary',
                  flex: 1,
                  mr: 1
                }}
              >
                {currentUser?.signature || (language === 'zh' ? '这个人很懒，什么都没留下...' : 'No signature yet...')}
              </Typography>
              <Tooltip title={language === 'zh' ? '编辑个性签名' : 'Edit Signature'}>
                <IconButton
                  size="small"
                  onClick={handleEditSignature}
                  sx={{ color: 'rgba(0, 229, 255, 0.7)' }}
                >
                  <EditIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </Tooltip>
            </Box>
            
            {/* 会员信息 */}
            {membershipInfo.isVip && (
              <Box sx={{ 
                p: 1.5, 
                borderRadius: 1, 
                background: `linear-gradient(135deg, ${membershipInfo.color}20, ${membershipInfo.color}10)`,
                border: `1px solid ${membershipInfo.color}40`,
                mb: 2
              }}>
                <Typography variant="body2" sx={{ color: membershipInfo.color, fontWeight: 'bold' }}>
                  {language === 'zh' ? '会员特权' : 'VIP Privileges'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {getVipExpiryDate() && (
                    `${language === 'zh' ? '到期时间' : 'Expires'}: ${getVipExpiryDate()}`
                  )}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        {/* 统计信息 */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <Box sx={{ mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              {language === 'zh' ? '注册时间' : 'Registered on'}: {getRegistrationDate()}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <StarIcon sx={{ color: 'rgba(0, 229, 255, 0.7)', mr: 1, fontSize: 20 }} />
            <Typography variant="body2" color="text.secondary">
              {language === 'zh' ? '收藏数量' : 'Favorites'}: {favoriteResources.length}
            </Typography>
          </Box>
        </Box>
      </Paper>
      
      {/* 头像更换对话框 */}
      <Dialog open={avatarDialogOpen} onClose={() => setAvatarDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{language === 'zh' ? '更换头像' : 'Change Avatar'}</DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <Avatar
              src={avatarPreview || currentUser?.avatar}
              sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }}
            >
              {currentUser?.username?.charAt(0).toUpperCase()}
            </Avatar>
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="avatar-upload"
              type="file"
              onChange={handleAvatarUpload}
            />
            <label htmlFor="avatar-upload">
              <Button
                variant="outlined"
                component="span"
                startIcon={<PhotoCameraIcon />}
                sx={{ mt: 1 }}
              >
                {language === 'zh' ? '选择图片' : 'Choose Image'}
              </Button>
            </label>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAvatarDialogOpen(false)}>
            {language === 'zh' ? '取消' : 'Cancel'}
          </Button>
          <Button onClick={handleSaveAvatar} variant="contained" disabled={!avatarPreview}>
            {language === 'zh' ? '保存' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* 个性签名编辑对话框 */}
      <Dialog open={signatureDialogOpen} onClose={() => setSignatureDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{language === 'zh' ? '编辑个性签名' : 'Edit Signature'}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={3}
            value={newSignature}
            onChange={(e) => setNewSignature(e.target.value)}
            placeholder={language === 'zh' ? '写下你的个性签名...' : 'Write your signature...'}
            sx={{ mt: 1 }}
            inputProps={{ maxLength: 100 }}
          />
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            {newSignature.length}/100
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSignatureDialogOpen(false)}>
            {language === 'zh' ? '取消' : 'Cancel'}
          </Button>
          <Button onClick={handleSaveSignature} variant="contained">
            {language === 'zh' ? '保存' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* 用户名编辑对话框 */}
      <Dialog open={usernameDialogOpen} onClose={() => setUsernameDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{language === 'zh' ? '编辑用户名' : 'Edit Username'}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            placeholder={language === 'zh' ? '输入新的用户名...' : 'Enter new username...'}
            sx={{ mt: 1 }}
            inputProps={{ maxLength: 20 }}
          />
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            {newUsername.length}/20
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUsernameDialogOpen(false)}>
            {language === 'zh' ? '取消' : 'Cancel'}
          </Button>
          <Button onClick={handleSaveUsername} variant="contained" disabled={!newUsername.trim()}>
            {language === 'zh' ? '保存' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* 标签页 */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab 
            label={language === 'zh' ? '收藏的资源' : 'Favorites'} 
            sx={{ 
              '&.Mui-selected': {
                color: '#00e5ff',
              }
            }}
          />
        </Tabs>
      </Box>
      
      {/* 收藏的资源列表 */}
      {tabValue === 0 && (
        <Box>
          {favoriteResources.length > 0 ? (
            <Paper 
              elevation={3} 
              sx={{ 
                p: 3,
                background: 'rgba(30, 30, 30, 0.8)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(0, 229, 255, 0.2)',
                borderRadius: '8px',
              }}
            >
              <List>
                {favoriteResources.map((resource) => (
                  <React.Fragment key={resource.id}>
                    <ListItem 
                      sx={{ 
                        display: 'flex', 
                        flexDirection: { xs: 'column', sm: 'row' },
                        alignItems: { xs: 'flex-start', sm: 'center' },
                        py: 2
                      }}
                    >
                      <Box 
                        onClick={() => handleResourceClick(resource.link)}
                        sx={{ 
                          flex: 1, 
                          cursor: 'pointer',
                          '&:hover': { color: '#00e5ff' }
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                          <Typography variant="subtitle1">{resource.title}</Typography>
                          <Chip 
                            label={categoryNames[resource.category] || resource.category} 
                            size="small" 
                            sx={{ 
                              ml: 1, 
                              backgroundColor: 'rgba(0, 229, 255, 0.1)',
                              border: '1px solid rgba(0, 229, 255, 0.3)',
                              color: '#00e5ff'
                            }} 
                          />
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          {resource.description}
                        </Typography>
                      </Box>
                      <IconButton 
                        onClick={() => handleRemoveFavorite(resource.id)}
                        sx={{ 
                          color: '#00e5ff',
                          ml: { xs: 0, sm: 2 },
                          mt: { xs: 1, sm: 0 },
                          alignSelf: { xs: 'flex-end', sm: 'center' }
                        }}
                      >
                        <StarIcon />
                      </IconButton>
                    </ListItem>
                    {resource.id !== favoriteResources[favoriteResources.length - 1].id && 
                      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />}
                  </React.Fragment>
                ))}
              </List>
            </Paper>
          ) : (
            <Alert 
              severity="info" 
              sx={{ 
                background: 'rgba(30, 30, 30, 0.8)',
                color: 'white',
                border: '1px solid rgba(0, 229, 255, 0.2)'
              }}
            >
              {language === 'zh' ? '你还没有收藏任何资源' : 'You haven\'t favorited any resources yet'}
            </Alert>
          )}
        </Box>
      )}
    </Box>
  );
}
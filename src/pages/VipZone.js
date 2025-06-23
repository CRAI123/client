import React, { useContext, useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, Grid, Button, Chip, Avatar, Divider, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Alert, CircularProgress, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LanguageContext } from '../App';
import StarIcon from '@mui/icons-material/Star';
import DiamondIcon from '@mui/icons-material/Diamond';
import VipIcon from '@mui/icons-material/WorkspacePremium';
import ExclusiveIcon from '@mui/icons-material/AutoAwesome';
import DownloadIcon from '@mui/icons-material/Download';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import SchoolIcon from '@mui/icons-material/School';
import SupportIcon from '@mui/icons-material/Support';
import LockIcon from '@mui/icons-material/Lock';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import StorageIcon from '@mui/icons-material/Storage';
import WarningIcon from '@mui/icons-material/Warning';
import MemberService from '../db/services/MemberService';

function VipZone() {
  const { language } = useContext(LanguageContext);
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  
  // VIP密钥验证状态
  const [isVipVerified, setIsVipVerified] = useState(false);
  const [showKeyDialog, setShowKeyDialog] = useState(true);
  const [vipKey, setVipKey] = useState('');
  const [keyError, setKeyError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // 数据库服务
  const [memberService] = useState(() => new MemberService());
  const [dbInitialized, setDbInitialized] = useState(false);
  const [loading, setLoading] = useState(false);
  const [memberData, setMemberData] = useState(null);
  
  // VIP状态计算
  const vipStatus = memberData?.vip_status === 'active' || memberData?.vip_status === 'permanent';

  // 监听localStorage变化，确保数据同步
  const handleStorageChange = (e) => {
    if (e.key === 'vipKeyData') {
      console.log('VIP密钥数据已更新，重新加载...');
      // 如果当前有验证的密钥，重新验证其有效性
      const currentVerifiedKey = localStorage.getItem('verifiedVipKey');
      if (currentVerifiedKey) {
        const newVipKeysData = localStorage.getItem('vipKeyData');
        if (newVipKeysData) {
          try {
            const newVipKeys = JSON.parse(newVipKeysData);
            const stillValid = newVipKeys.find(key => 
              key.key === currentVerifiedKey && (key.status === 'active' || key.status === 'permanent')
            );
            if (!stillValid) {
              // 密钥不再有效，重置验证状态
              localStorage.removeItem('verifiedVipKey');
              setIsVipVerified(false);
              setShowKeyDialog(true);
              setVipKey('');
            }
          } catch (error) {
            console.error('解析VIP密钥数据失败:', error);
          }
        }
      }
    }
  };

  // 初始化数据库和加载会员数据
  useEffect(() => {
    const initializeAndLoadData = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        // 初始化数据库表
        const initResult = await memberService.initializeTables();
        if (initResult.success) {
          setDbInitialized(true);
          console.log('数据库初始化成功:', initResult.message);
          if (initResult.serverInfo) {
            console.log('数据库服务器信息:', initResult.serverInfo);
          }
          
          // 尝试获取会员数据
          const memberResult = await memberService.getMemberByUsername(user.username || user.email);
          if (memberResult.success && memberResult.data) {
            setMemberData(memberResult.data);
          } else {
            // 如果会员不存在，创建新会员记录
            const registerResult = await memberService.registerMember({
              username: user.username || user.email,
              email: user.email,
              password: 'oauth_user' // OAuth用户的占位密码
            });
            if (registerResult.success) {
              setMemberData(registerResult.data);
            }
          }
        }
      } catch (error) {
        console.error('初始化失败:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAndLoadData();
  }, [user, memberService]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
    // 检查是否已经验证过VIP密钥
    const verifiedKey = localStorage.getItem('verifiedVipKey');
    if (verifiedKey) {
      setIsVipVerified(true);
      setShowKeyDialog(false);
    }
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  // 验证VIP密钥
  const verifyVipKey = async () => {
    setIsLoading(true);
    setKeyError('');
    
    try {
      if (dbInitialized && memberData) {
        // 使用数据库验证VIP密钥
        const result = await memberService.activateVipKey(memberData.id, vipKey.trim());
        
        if (result.success) {
          // 更新会员数据
          const updatedMemberResult = await memberService.getMemberByUsername(memberData.username);
          if (updatedMemberResult.success) {
            setMemberData(updatedMemberResult.data);
          }
          
          setIsVipVerified(true);
          setShowKeyDialog(false);
          localStorage.setItem('verifiedVipKey', vipKey.trim());
        } else {
          setKeyError(result.error || (language === 'zh' ? '无效的VIP密钥' : 'Invalid VIP key'));
        }
      } else {
        // 回退到localStorage验证（如果数据库不可用）
        const vipKeysData = localStorage.getItem('vipKeyData');
        if (!vipKeysData) {
          setKeyError(language === 'zh' ? '系统中没有可用的VIP密钥' : 'No VIP keys available in system');
          setIsLoading(false);
          return;
        }
        
        const vipKeys = JSON.parse(vipKeysData);
        console.log('当前存储的VIP密钥:', vipKeys);
        console.log('输入的密钥:', vipKey.trim());
        
        // 检查密钥是否存在且状态有效
        const validKey = vipKeys.find(key => 
          key.key === vipKey.trim() && (key.status === 'active' || key.status === 'permanent')
        );
        
        console.log('找到的有效密钥:', validKey);
        
        if (validKey) {
          // 密钥验证成功
          setIsVipVerified(true);
          setShowKeyDialog(false);
          localStorage.setItem('verifiedVipKey', vipKey.trim());
          
          // 更新密钥使用信息
          const updatedKeys = vipKeys.map(key => {
            if (key.key === vipKey.trim()) {
              if (key.status === 'permanent') {
                // 永久密钥：只更新使用次数和最后使用信息
                return {
                  ...key,
                  usedBy: user?.username || 'Unknown',
                  usedDate: new Date().toISOString().split('T')[0],
                  usageCount: (key.usageCount || 0) + 1
                };
              } else {
                // 普通密钥：标记为已使用
                return {
                  ...key,
                  status: 'used',
                  usedBy: user?.username || 'Unknown',
                  usedDate: new Date().toISOString().split('T')[0],
                  usageCount: (key.usageCount || 0) + 1
                };
              }
            }
            return key;
          });
          localStorage.setItem('vipKeyData', JSON.stringify(updatedKeys));
          window.dispatchEvent(new StorageEvent('storage', {
            key: 'vipKeyData',
            newValue: localStorage.getItem('vipKeyData'),
            storageArea: localStorage
          }));
          // 兼容本标签页，主动触发 handleStorageChange
          handleStorageChange({ key: 'vipKeyData', newValue: localStorage.getItem('vipKeyData') });
        } else {
          // 提供更详细的错误信息
          const keyExists = vipKeys.find(key => key.key === vipKey.trim());
          if (keyExists) {
            setKeyError(language === 'zh' ? `密钥状态无效: ${keyExists.status}` : `Invalid key status: ${keyExists.status}`);
          } else {
            setKeyError(language === 'zh' ? '密钥不存在或格式错误' : 'Key does not exist or format error');
          }
        }
      }
    } catch (error) {
      console.error('VIP密钥验证失败:', error);
      setKeyError(language === 'zh' ? '验证过程中出现错误' : 'Error occurred during verification');
    }
    
    setIsLoading(false);
  };

  // 重置VIP验证（用于测试）
  const resetVipVerification = () => {
    localStorage.removeItem('verifiedVipKey');
    setIsVipVerified(false);
    setShowKeyDialog(true);
    setVipKey('');
    setKeyError('');
  };

  // 如果还未验证VIP密钥，显示验证对话框
  if (!isVipVerified) {
    return (
      <Box sx={{ py: 4 }}>
        <Dialog 
          open={showKeyDialog} 
          onClose={() => {}} 
          maxWidth="sm" 
          fullWidth
          disableEscapeKeyDown
        >
          <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
            <VpnKeyIcon sx={{ fontSize: 40, color: '#FFD700', mb: 1 }} />
            <Typography variant="h5" component="div">
              {language === 'zh' ? 'VIP密钥验证' : 'VIP Key Verification'}
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Typography variant="body1" sx={{ mb: 3, textAlign: 'center', color: 'text.secondary' }}>
              {language === 'zh' 
                ? '请输入您的VIP密钥以访问会员专区的独家内容和特权功能。'
                : 'Please enter your VIP key to access exclusive content and premium features in the member zone.'}
            </Typography>
            
            {keyError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {keyError}
              </Alert>
            )}
            
            <TextField
              fullWidth
              label={language === 'zh' ? 'VIP密钥' : 'VIP Key'}
              value={vipKey}
              onChange={(e) => setVipKey(e.target.value)}
              placeholder={language === 'zh' ? '请输入16位VIP密钥' : 'Enter 16-digit VIP key'}
              variant="outlined"
              sx={{ mb: 2 }}
              InputProps={{
                style: { fontFamily: 'monospace' }
              }}
            />
            
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', textAlign: 'center' }}>
              {language === 'zh' 
                ? '密钥格式：XXXX-XXXX-XXXX-XXXX'
                : 'Key format: XXXX-XXXX-XXXX-XXXX'}
            </Typography>
            
            {/* VIP服务成就展示 */}
            <Box sx={{ mt: 3, mb: 2 }}>
              <Typography variant="subtitle2" sx={{ 
                textAlign: 'center', 
                color: '#FFD700', 
                fontWeight: 'bold',
                mb: 2
              }}>
                {language === 'zh' ? '🏆 我们的成就' : '🏆 Our Achievements'}
              </Typography>
              
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center', p: 1.5, bgcolor: 'rgba(255, 215, 0, 0.1)', borderRadius: 1 }}>
                    <Typography variant="h6" sx={{ color: '#FFD700', fontWeight: 'bold' }}>500+</Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      {language === 'zh' ? '成功项目' : 'Projects'}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center', p: 1.5, bgcolor: 'rgba(255, 107, 107, 0.1)', borderRadius: 1 }}>
                    <Typography variant="h6" sx={{ color: '#FF6B6B', fontWeight: 'bold' }}>98%</Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      {language === 'zh' ? '成功率' : 'Success Rate'}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
              
              {/* 精选案例 */}
              <Typography variant="subtitle2" sx={{ 
                textAlign: 'center', 
                color: '#FFD700', 
                fontWeight: 'bold',
                mb: 1.5
              }}>
                {language === 'zh' ? '💡 精选案例' : '💡 Featured Cases'}
              </Typography>
              
              <Box sx={{ 
                p: 2, 
                border: '1px solid rgba(255, 215, 0, 0.3)', 
                borderRadius: 2,
                bgcolor: 'rgba(255, 215, 0, 0.05)',
                mb: 2
              }}>
                <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                  {language === 'zh' ? '🚀 AI智能推荐系统' : '🚀 AI Recommendation System'}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  {language === 'zh' 
                    ? '为客户带来40%转化率提升，获得行业技术创新奖'
                    : '40% conversion rate improvement, industry innovation award'}
                </Typography>
              </Box>
              
              <Box sx={{ 
                 p: 2, 
                 border: '1px solid rgba(78, 205, 196, 0.3)', 
                 borderRadius: 2,
                 bgcolor: 'rgba(78, 205, 196, 0.05)'
               }}>
                 <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                   {language === 'zh' ? '🔬 科技工作室平台' : '🔬 Tech Studio Platform'}
                 </Typography>
                 <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                   {language === 'zh' 
                     ? '集成项目管理、代码协作、自动化部署于一体的现代化开发环境'
                     : 'Modern development environment integrating project management, code collaboration, and automated deployment'}
                 </Typography>
               </Box>
            </Box>
            
            {/* 微信二维码和获取密钥信息 */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              mt: 3, 
              p: 2, 
              border: '1px dashed #FFD700', 
              borderRadius: 2,
              backgroundColor: 'rgba(255, 215, 0, 0.05)'
            }}>
              <Box sx={{ textAlign: 'center', mr: 2 }}>
                <img 
                  src="/images/wechat_2025-06-20_202513_860.png" 
                  alt="微信二维码" 
                  style={{ 
                    width: '80px', 
                    height: '80px', 
                    borderRadius: '8px',
                    border: '2px solid #FFD700'
                  }} 
                />
              </Box>
              <Box sx={{ textAlign: 'left' }}>
                <Typography variant="body2" sx={{ 
                  color: '#FFD700', 
                  fontWeight: 'bold',
                  mb: 0.5
                }}>
                  {language === 'zh' ? '获取密钥' : 'Get Key'}
                </Typography>
                <Typography variant="caption" sx={{ 
                  color: 'text.secondary',
                  display: 'block'
                }}>
                  {language === 'zh' 
                    ? '请扫码找工作人员获取密钥，$1/月  $8/年'
                    : 'Scan QR code to contact staff for key, $1/month  $8/year'}
                </Typography>
              </Box>
            </Box>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button 
              onClick={() => navigate('/')} 
              color="secondary"
            >
              {language === 'zh' ? '返回首页' : 'Back to Home'}
            </Button>
            <Button 
              onClick={verifyVipKey}
              variant="contained"
              disabled={!vipKey.trim() || isLoading}
              sx={{ 
                background: 'linear-gradient(45deg, #FFD700, #FFA500)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #FFA500, #FF8C00)'
                }
              }}
            >
              {isLoading 
                ? (language === 'zh' ? '验证中...' : 'Verifying...') 
                : (language === 'zh' ? '验证密钥' : 'Verify Key')}
            </Button>
          </DialogActions>
        </Dialog>
        
        {/* 背景内容（模糊显示） */}
        <Box sx={{ 
          filter: 'blur(5px)', 
          pointerEvents: 'none',
          opacity: 0.3
        }}>
          <Box sx={{ 
            textAlign: 'center', 
            mb: 6,
            background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(255, 107, 107, 0.1) 100%)',
            borderRadius: 3,
            p: 4,
            border: '1px solid rgba(255, 215, 0, 0.3)'
          }}>
            <Avatar sx={{ 
              width: 80, 
              height: 80, 
              mx: 'auto', 
              mb: 2,
              background: 'linear-gradient(45deg, #FFD700, #FFA500)'
            }}>
              <LockIcon sx={{ fontSize: 40 }} />
            </Avatar>
            <Typography variant="h3" sx={{ 
              mb: 2,
              background: 'linear-gradient(45deg, #FFD700, #FFA500)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 'bold'
            }}>
              {language === 'zh' ? '会员专区' : 'VIP Zone'}
            </Typography>
            <Typography variant="h6" sx={{ color: 'text.secondary' }}>
              {language === 'zh' ? '需要VIP密钥验证' : 'VIP Key Verification Required'}
            </Typography>
          </Box>
        </Box>
      </Box>
    );
  }

  const vipFeatures = [
    {
      icon: <DownloadIcon sx={{ fontSize: 40, color: '#FFD700' }} />,
      title: language === 'zh' ? '独家资源下载' : 'Exclusive Downloads',
      description: language === 'zh' ? '访问高质量的独家技术资源、源码和工具' : 'Access high-quality exclusive tech resources, source code and tools'
    },
    {
      icon: <VideoLibraryIcon sx={{ fontSize: 40, color: '#FF6B6B' }} />,
      title: language === 'zh' ? '专属视频教程' : 'Exclusive Video Tutorials',
      description: language === 'zh' ? '观看深度技术讲解和项目实战视频' : 'Watch in-depth technical explanations and project practice videos'
    },
    {
      icon: <SchoolIcon sx={{ fontSize: 40, color: '#4ECDC4' }} />,
      title: language === 'zh' ? '在线技术咨询' : 'Online Tech Consultation',
      description: language === 'zh' ? '一对一技术指导和问题解答服务' : 'One-on-one technical guidance and Q&A service'
    },
    {
      icon: <SupportIcon sx={{ fontSize: 40, color: '#45B7D1' }} />,
      title: language === 'zh' ? '优先技术支持' : 'Priority Tech Support',
      description: language === 'zh' ? '享受优先级技术支持和快速响应' : 'Enjoy priority technical support and fast response'
    }
  ];

  const exclusiveContent = [
    {
      title: language === 'zh' ? 'React高级实战项目' : 'Advanced React Projects',
      type: language === 'zh' ? '项目源码' : 'Source Code',
      level: language === 'zh' ? '高级' : 'Advanced'
    },
    {
      title: language === 'zh' ? 'Node.js微服务架构' : 'Node.js Microservices',
      type: language === 'zh' ? '视频教程' : 'Video Tutorial',
      level: language === 'zh' ? '专家' : 'Expert'
    },
    {
      title: language === 'zh' ? 'AI算法实现详解' : 'AI Algorithm Implementation',
      type: language === 'zh' ? '技术文档' : 'Documentation',
      level: language === 'zh' ? '高级' : 'Advanced'
    },
    {
      title: language === 'zh' ? '全栈开发工具包' : 'Full-Stack Toolkit',
      type: language === 'zh' ? '工具集' : 'Toolkit',
      level: language === 'zh' ? '中级' : 'Intermediate'
    }
  ];

  return (
    <Box sx={{ py: 4 }}>
      {/* 头部欢迎区域 */}
      <Grid container spacing={3} sx={{ mb: 6 }}>
        {/* VIP状态卡片 */}
        <Grid item xs={12} md={6}>
          <Card sx={{ 
            background: vipStatus ? 
              'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)' : 
              'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)',
            color: vipStatus ? '#000' : theme.palette.text.primary,
            transition: 'all 0.3s ease'
          }}>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2 }}>
                <StarIcon sx={{ fontSize: 60, mr: 1, color: vipStatus ? '#000' : '#ccc' }} />
                {loading && <CircularProgress size={20} />}
              </Box>
              <Typography variant="h4" gutterBottom fontWeight="bold">
                {vipStatus ? 
                  (language === 'zh' ? 'VIP会员' : 'VIP Member') : 
                  (language === 'zh' ? '普通用户' : 'Regular User')
                }
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 2 }}>
                <Chip 
                  label={vipStatus ? 
                    (language === 'zh' ? '已激活' : 'Activated') : 
                    (language === 'zh' ? '未激活' : 'Not Activated')
                  }
                  color={vipStatus ? 'success' : 'default'}
                  sx={{ fontSize: '1rem', px: 2, py: 1 }}
                />
                <Chip 
                  icon={<StorageIcon />}
                  label={memberService ? memberService.getStorageType() : 'LocalStorage'}
                  color={dbInitialized ? 'primary' : 'warning'}
                  size="small"
                  title={dbInitialized ? 
                    (language === 'zh' ? '使用数据库存储' : 'Using Database Storage') :
                    (language === 'zh' ? '使用本地存储' : 'Using Local Storage')
                  }
                />
              </Box>
              {memberData && (
                <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>
                  {language === 'zh' ? '会员ID' : 'Member ID'}: {memberData.id}
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
        
        {/* 会员信息卡片 */}
        <Grid item xs={12} md={6}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, rgba(78, 205, 196, 0.1) 0%, rgba(69, 183, 209, 0.1) 100%)',
            border: '1px solid rgba(78, 205, 196, 0.3)',
            height: '100%'
          }}>
            <CardContent sx={{ py: 4 }}>
              <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ textAlign: 'center', mb: 3 }}>
                {language === 'zh' ? '会员信息' : 'Member Info'}
              </Typography>
              
              {memberData ? (
                <Box sx={{ space: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      {language === 'zh' ? '用户名' : 'Username'}:
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {memberData.username}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      {language === 'zh' ? '邮箱' : 'Email'}:
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {memberData.email}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      {language === 'zh' ? '注册时间' : 'Registered'}:
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {new Date(memberData.created_at).toLocaleDateString()}
                    </Typography>
                  </Box>
                  
                  {memberData.vip_activated_at && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        {language === 'zh' ? 'VIP激活时间' : 'VIP Activated'}:
                      </Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {new Date(memberData.vip_activated_at).toLocaleDateString()}
                      </Typography>
                    </Box>
                  )}
                  
                  {memberData.vip_expires_at && memberData.vip_status !== 'permanent' && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        {language === 'zh' ? 'VIP到期时间' : 'VIP Expires'}:
                      </Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {new Date(memberData.vip_expires_at).toLocaleDateString()}
                      </Typography>
                    </Box>
                  )}
                </Box>
              ) : (
                <Box sx={{ textAlign: 'center', py: 2 }}>
                  <CircularProgress size={24} sx={{ mb: 2 }} />
                  <Typography variant="body2" color="text.secondary">
                    {language === 'zh' ? '加载会员信息中...' : 'Loading member info...'}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      <Box sx={{ 
        textAlign: 'center', 
        mb: 6,
        background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(255, 107, 107, 0.1) 100%)',
        borderRadius: 3,
        p: 4,
        border: '1px solid rgba(255, 215, 0, 0.3)'
      }}>
        <Avatar sx={{ 
          width: 80, 
          height: 80, 
          mx: 'auto', 
          mb: 2,
          background: 'linear-gradient(45deg, #FFD700, #FFA500)'
        }}>
          <VipIcon sx={{ fontSize: 40 }} />
        </Avatar>
        <Typography variant="h3" sx={{ 
          mb: 2,
          background: 'linear-gradient(45deg, #FFD700, #FFA500)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 'bold'
        }}>
          {language === 'zh' ? '会员专区' : 'VIP Zone'}
        </Typography>
        <Typography variant="h6" sx={{ color: 'text.secondary', mb: 3 }}>
          {language === 'zh' ? `欢迎回来，${user?.username || memberData?.username || '会员'}！` : `Welcome back, ${user?.username || memberData?.username || 'Member'}!`}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
          <Chip 
            icon={<DiamondIcon />}
            label={vipStatus ? 
              (language === 'zh' ? '尊贵会员' : 'Premium Member') :
              (language === 'zh' ? '普通会员' : 'Regular Member')
            }
            sx={{ 
              background: vipStatus ? 
                'linear-gradient(45deg, #FFD700, #FFA500)' :
                'linear-gradient(45deg, #ccc, #999)',
              color: 'white',
              fontWeight: 'bold'
            }}
          />
          <Button
            size="small"
            variant="outlined"
            onClick={resetVipVerification}
            sx={{ 
              borderColor: 'rgba(255, 215, 0, 0.5)',
              color: '#FFD700',
              '&:hover': {
                borderColor: '#FFD700',
                backgroundColor: 'rgba(255, 215, 0, 0.1)'
              }
            }}
          >
            {language === 'zh' ? '重新验证' : 'Re-verify'}
          </Button>
        </Box>
      </Box>

      {/* VIP特权功能 */}
      <Typography variant="h4" sx={{ mb: 4, textAlign: 'center' }}>
        <ExclusiveIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
        {language === 'zh' ? 'VIP专属特权' : 'VIP Exclusive Benefits'}
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 6 }}>
        {vipFeatures.map((feature, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Card sx={{ 
              height: '100%',
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
              border: '1px solid rgba(255, 215, 0, 0.2)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 10px 30px rgba(255, 215, 0, 0.3)'
              }
            }}>
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <Box sx={{ mb: 2 }}>
                  {feature.icon}
                </Box>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                  {feature.title}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {feature.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Divider sx={{ my: 4, borderColor: 'rgba(255, 215, 0, 0.3)' }} />

      {/* 成功案例和成就展示 */}
      <Typography variant="h4" sx={{ mb: 4, textAlign: 'center' }}>
        <StarIcon sx={{ mr: 1, verticalAlign: 'middle', color: '#FFD700' }} />
        {language === 'zh' ? '成功案例与成就' : 'Success Cases & Achievements'}
      </Typography>
      
      {/* 项目成就统计 */}
      <Grid container spacing={3} sx={{ mb: 6 }}>
        <Grid item xs={12} md={3}>
          <Card sx={{ 
            textAlign: 'center', 
            p: 3,
            background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
            color: 'white'
          }}>
            <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>500+</Typography>
            <Typography variant="body1">{language === 'zh' ? '成功项目' : 'Successful Projects'}</Typography>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ 
            textAlign: 'center', 
            p: 3,
            background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%)',
            color: 'white'
          }}>
            <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>1000+</Typography>
            <Typography variant="body1">{language === 'zh' ? '满意客户' : 'Satisfied Clients'}</Typography>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ 
            textAlign: 'center', 
            p: 3,
            background: 'linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%)',
            color: 'white'
          }}>
            <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>50+</Typography>
            <Typography variant="body1">{language === 'zh' ? '技术专利' : 'Tech Patents'}</Typography>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ 
            textAlign: 'center', 
            p: 3,
            background: 'linear-gradient(135deg, #45B7D1 0%, #96C93D 100%)',
            color: 'white'
          }}>
            <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>98%</Typography>
            <Typography variant="body1">{language === 'zh' ? '项目成功率' : 'Success Rate'}</Typography>
          </Card>
        </Grid>
      </Grid>
      
      {/* 成功案例展示 */}
      <Grid container spacing={3} sx={{ mb: 6 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ 
            height: '100%',
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
            border: '1px solid rgba(255, 215, 0, 0.2)'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: '#FFD700', mr: 2 }}>🏆</Avatar>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {language === 'zh' ? '电商平台重构' : 'E-commerce Platform Rebuild'}
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                {language === 'zh' 
                  ? '为某知名电商企业重构整个技术架构，性能提升300%，用户体验显著改善。'
                  : 'Rebuilt the entire tech architecture for a famous e-commerce company, improving performance by 300% and significantly enhancing user experience.'}
              </Typography>
              <Chip size="small" label={language === 'zh' ? '大型项目' : 'Large Project'} sx={{ bgcolor: '#FFD700', color: 'white' }} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ 
            height: '100%',
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
            border: '1px solid rgba(255, 215, 0, 0.2)'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: '#FF6B6B', mr: 2 }}>🚀</Avatar>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {language === 'zh' ? 'AI智能推荐系统' : 'AI Recommendation System'}
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                {language === 'zh' 
                  ? '开发智能推荐算法，为客户带来40%的转化率提升，获得行业技术创新奖。'
                  : 'Developed intelligent recommendation algorithms, bringing 40% conversion rate improvement and winning industry innovation awards.'}
              </Typography>
              <Chip size="small" label={language === 'zh' ? 'AI项目' : 'AI Project'} sx={{ bgcolor: '#FF6B6B', color: 'white' }} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ 
            height: '100%',
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
            border: '1px solid rgba(255, 215, 0, 0.2)'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: '#4ECDC4', mr: 2 }}>💡</Avatar>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {language === 'zh' ? '区块链金融应用' : 'Blockchain Finance App'}
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                {language === 'zh' 
                  ? '构建安全可靠的区块链金融应用，处理日交易量超过1000万，零安全事故。'
                  : 'Built secure and reliable blockchain finance application, handling over 10M daily transactions with zero security incidents.'}
              </Typography>
              <Chip size="small" label={language === 'zh' ? '区块链' : 'Blockchain'} sx={{ bgcolor: '#4ECDC4', color: 'white' }} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* 客户反馈 */}
      <Typography variant="h5" sx={{ mb: 3, textAlign: 'center' }}>
        {language === 'zh' ? '客户反馈' : 'Client Testimonials'}
      </Typography>
      <Grid container spacing={3} sx={{ mb: 6 }}>
        <Grid item xs={12} md={6}>
          <Card sx={{ 
            p: 3,
            background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(255, 215, 0, 0.05) 100%)',
            border: '1px solid rgba(255, 215, 0, 0.3)'
          }}>
            <Typography variant="body1" sx={{ mb: 2, fontStyle: 'italic' }}>
              "{language === 'zh' 
                ? '技术实力非常强，项目交付质量超出预期，团队沟通顺畅，强烈推荐！'
                : 'Excellent technical expertise, project delivery quality exceeded expectations, smooth team communication, highly recommended!'}"
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ mr: 2, bgcolor: '#FFD700' }}>A</Avatar>
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                  {language === 'zh' ? '张总 - 某科技公司CEO' : 'Mr. Zhang - Tech Company CEO'}
                </Typography>
                <Box sx={{ display: 'flex', mt: 0.5 }}>
                  {[1,2,3,4,5].map(star => (
                    <StarIcon key={star} sx={{ color: '#FFD700', fontSize: 16 }} />
                  ))}
                </Box>
              </Box>
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ 
            p: 3,
            background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(255, 215, 0, 0.05) 100%)',
            border: '1px solid rgba(255, 215, 0, 0.3)'
          }}>
            <Typography variant="body1" sx={{ mb: 2, fontStyle: 'italic' }}>
              "{language === 'zh' 
                ? '从需求分析到项目上线，全程专业服务，解决了我们多年的技术难题。'
                : 'Professional service from requirement analysis to project launch, solved our long-standing technical challenges.'}"
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ mr: 2, bgcolor: '#FF6B6B' }}>L</Avatar>
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                  {language === 'zh' ? '李经理 - 电商平台负责人' : 'Manager Li - E-commerce Platform Lead'}
                </Typography>
                <Box sx={{ display: 'flex', mt: 0.5 }}>
                  {[1,2,3,4,5].map(star => (
                    <StarIcon key={star} sx={{ color: '#FFD700', fontSize: 16 }} />
                  ))}
                </Box>
              </Box>
            </Box>
          </Card>
        </Grid>
      </Grid>
      
      {/* 独家内容 */}
      <Typography variant="h4" sx={{ mb: 4, textAlign: 'center' }}>
        <StarIcon sx={{ mr: 1, verticalAlign: 'middle', color: '#FFD700' }} />
        {language === 'zh' ? '独家内容' : 'Exclusive Content'}
      </Typography>
      
      <Grid container spacing={3}>
        {exclusiveContent.map((content, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ 
              height: '100%',
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
              border: '1px solid rgba(0, 229, 255, 0.2)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-3px)',
                boxShadow: '0 8px 25px rgba(0, 229, 255, 0.3)'
              }
            }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                  {content.title}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Chip 
                    label={content.type}
                    size="small"
                    sx={{ backgroundColor: 'rgba(0, 229, 255, 0.2)' }}
                  />
                  <Chip 
                    label={content.level}
                    size="small"
                    sx={{ backgroundColor: 'rgba(255, 215, 0, 0.2)' }}
                  />
                </Box>
                <Button 
                  variant="outlined" 
                  fullWidth
                  sx={{ 
                    borderColor: 'rgba(0, 229, 255, 0.5)',
                    color: '#00e5ff',
                    '&:hover': {
                      borderColor: '#00e5ff',
                      backgroundColor: 'rgba(0, 229, 255, 0.1)'
                    }
                  }}
                >
                  {language === 'zh' ? '立即访问' : 'Access Now'}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* 存储状态信息 */}
      <Box sx={{ 
        mt: 4, 
        p: 3, 
        background: dbInitialized ? 
          'linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(139, 195, 74, 0.1) 100%)' :
          'linear-gradient(135deg, rgba(255, 152, 0, 0.1) 0%, rgba(255, 193, 7, 0.1) 100%)',
        borderRadius: 2,
        border: dbInitialized ? '1px solid rgba(76, 175, 80, 0.3)' : '1px solid rgba(255, 152, 0, 0.3)'
      }}>
        <Typography variant="h6" sx={{ mb: 2, textAlign: 'center', color: dbInitialized ? '#4CAF50' : '#FF9800' }}>
          <StorageIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          {language === 'zh' ? '存储状态' : 'Storage Status'}
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ 
              textAlign: 'center', 
              p: 2, 
              bgcolor: dbInitialized ? 'rgba(76, 175, 80, 0.1)' : 'rgba(255, 152, 0, 0.1)', 
              borderRadius: 1 
            }}>
              <Typography variant="body2" color="text.secondary">
                {language === 'zh' ? '存储类型' : 'Storage Type'}
              </Typography>
              <Typography variant="h6" sx={{ 
                color: dbInitialized ? '#4CAF50' : '#FF9800', 
                fontWeight: 'bold' 
              }}>
                {memberService ? memberService.getStorageType() : 'LocalStorage'}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ 
              textAlign: 'center', 
              p: 2, 
              bgcolor: dbInitialized ? 'rgba(76, 175, 80, 0.1)' : 'rgba(255, 152, 0, 0.1)', 
              borderRadius: 1 
            }}>
              <Typography variant="body2" color="text.secondary">
                {language === 'zh' ? '连接状态' : 'Connection'}
              </Typography>
              <Typography variant="h6" sx={{ 
                color: dbInitialized ? '#4CAF50' : '#FF9800', 
                fontWeight: 'bold' 
              }}>
                {dbInitialized ? 
                  (language === 'zh' ? '已连接' : 'Connected') :
                  (language === 'zh' ? '本地模式' : 'Local Mode')
                }
              </Typography>
            </Box>
          </Grid>
          {memberData && (
            <>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ 
                  textAlign: 'center', 
                  p: 2, 
                  bgcolor: dbInitialized ? 'rgba(76, 175, 80, 0.1)' : 'rgba(255, 152, 0, 0.1)', 
                  borderRadius: 1 
                }}>
                  <Typography variant="body2" color="text.secondary">
                    {language === 'zh' ? '会员ID' : 'Member ID'}
                  </Typography>
                  <Typography variant="h6" sx={{ 
                    color: dbInitialized ? '#4CAF50' : '#FF9800', 
                    fontWeight: 'bold' 
                  }}>
                    #{memberData.id || 'N/A'}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ 
                  textAlign: 'center', 
                  p: 2, 
                  bgcolor: dbInitialized ? 'rgba(76, 175, 80, 0.1)' : 'rgba(255, 152, 0, 0.1)', 
                  borderRadius: 1 
                }}>
                  <Typography variant="body2" color="text.secondary">
                    {language === 'zh' ? 'VIP状态' : 'VIP Status'}
                  </Typography>
                  <Typography variant="h6" sx={{ color: vipStatus ? '#FFD700' : '#999', fontWeight: 'bold' }}>
                    {memberData.vip_status || 'inactive'}
                  </Typography>
                </Box>
              </Grid>
            </>
          )}
        </Grid>
        {!dbInitialized && memberService && (
          <Box sx={{ mt: 2, p: 2, bgcolor: 'rgba(255, 152, 0, 0.1)', borderRadius: 1 }}>
            <Typography variant="body2" color="text.secondary">
              {language === 'zh' ? '连接信息' : 'Connection Info'}:
            </Typography>
            <Typography variant="body2" sx={{ color: '#FF9800', mt: 1 }}>
              {memberService.connectionError || 
                (language === 'zh' ? '数据库连接不可用，使用本地存储模式' : 'Database connection unavailable, using local storage mode')
              }
            </Typography>
          </Box>
        )}
      </Box>
      
      {/* 底部提示 */}
      <Box sx={{ 
        mt: 6, 
        p: 3, 
        textAlign: 'center',
        background: 'linear-gradient(135deg, rgba(0, 229, 255, 0.1) 0%, rgba(255, 215, 0, 0.1) 100%)',
        borderRadius: 2,
        border: '1px solid rgba(0, 229, 255, 0.3)'
      }}>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          {language === 'zh' 
            ? '更多精彩内容正在准备中，敬请期待！如有任何问题，请随时联系我们。'
            : 'More exciting content is being prepared, stay tuned! If you have any questions, please feel free to contact us.'}
        </Typography>
        {!dbInitialized && (
          <Typography variant="body2" sx={{ color: 'orange', mt: 1 }}>
            {language === 'zh' 
              ? '注意：当前使用本地存储模式，数据可能不会持久保存。'
              : 'Note: Currently using local storage mode, data may not be persistently saved.'}
          </Typography>
        )}
      </Box>
    </Box>
  );
}

export default VipZone;
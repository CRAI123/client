import React, { useContext, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Grid, Button, Chip, Avatar, Divider } from '@mui/material';
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

function VipZone() {
  const { language } = useContext(LanguageContext);
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
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
          {language === 'zh' ? `欢迎回来，${user?.username || '会员'}！` : `Welcome back, ${user?.username || 'Member'}!`}
        </Typography>
        <Chip 
          icon={<DiamondIcon />}
          label={language === 'zh' ? '尊贵会员' : 'Premium Member'}
          sx={{ 
            background: 'linear-gradient(45deg, #FFD700, #FFA500)',
            color: 'white',
            fontWeight: 'bold'
          }}
        />
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
      </Box>
    </Box>
  );
}

export default VipZone;
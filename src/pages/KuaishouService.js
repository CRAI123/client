import React, { useState, useContext } from 'react';
import { Box, Typography, Card, CardContent, Button, Grid, Chip, Avatar, useTheme } from '@mui/material';
import { LanguageContext } from '../App';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {
  VideoLibrary,
  Analytics,
  TrendingUp,
  People,
  Campaign,
  Security,
  Speed,
  Support
} from '@mui/icons-material';

function KuaishouService() {
  const theme = useTheme();
  const { language } = useContext(LanguageContext);
  const [selectedService, setSelectedService] = useState(null);

  const services = [
    {
      id: 1,
      title: language === 'zh' ? '流量推广工具' : 'Traffic Promotion Tool',
      icon: TrendingUp,
      description: language === 'zh' ? '精准流量推广服务，提升视频曝光度和互动率，通过智能算法优化推广策略，实现最佳投资回报率' : 'Precise traffic promotion service to boost video exposure and engagement, optimize promotion strategies through intelligent algorithms for best ROI',
      features: language === 'zh' ? ['精准投放', '效果追踪', '预算优化', 'ROI分析', '智能出价', '受众定向', '创意优化', '实时监控'] : ['Precise Targeting', 'Effect Tracking', 'Budget Optimization', 'ROI Analysis', 'Smart Bidding', 'Audience Targeting', 'Creative Optimization', 'Real-time Monitoring'],
      status: language === 'zh' ? '运行中' : 'Running',
      users: '2.3K+',
      platform: language === 'zh' ? '在线服务' : 'Online Service',
      available: true
    }
  ];

  const handleViewService = (service) => {
     if (service.available) {
       // 打开流量推广工具网站
       window.open('http://cr.jmrd88.cn/', '_blank');
     } else {
       alert(language === 'zh' ? '该服务正在维护中，请稍后再试！' : 'This service is under maintenance, please try again later!');
     }
   };



  return (
    <Box sx={{ mt: 4 }}>
      {/* 背景装饰 */}
      <Box sx={{ 
        position: 'absolute', 
        top: '20%', 
        right: '10%', 
        width: '150px', 
        height: '150px', 
        border: '1px solid rgba(0, 229, 255, 0.2)', 
        borderRadius: '4px',
        transform: 'rotate(30deg)',
        opacity: 0.3,
        zIndex: 0
      }} />
      <Box sx={{ 
        position: 'absolute', 
        bottom: '15%', 
        left: '8%', 
        width: '120px', 
        height: '120px', 
        border: '1px solid rgba(255, 0, 229, 0.2)', 
        borderRadius: '50%',
        opacity: 0.3,
        zIndex: 0
      }} />
      
      {/* 页面标题 */}
      <Box sx={{ 
        textAlign: 'center', 
        mb: 6, 
        position: 'relative',
        zIndex: 1 
      }}>
        <Typography 
          variant="h2" 
          gutterBottom
          sx={{ 
            fontFamily: '"Orbitron", sans-serif',
            fontWeight: 700,
            letterSpacing: '0.05em',
            background: 'linear-gradient(135deg, #1890ff 0%, #40a9ff 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 0 15px rgba(0, 229, 255, 0.5)',
            mb: 2
          }}
        >
          {language === 'zh' ? '快手服务平台' : 'Kuaishou Service Platform'}
        </Typography>
        <Typography 
          variant="subtitle1" 
          sx={{ 
            mb: 4, 
            color: theme.palette.text.secondary,
            maxWidth: '600px',
            mx: 'auto',
            letterSpacing: '0.03em',
            lineHeight: 1.6
          }}
        >
          {language === 'zh' ? '在线使用专业的快手运营服务，提升您的内容创作和运营效率' : 'Use professional Kuaishou operation services online to improve your content creation and operation efficiency'}
        </Typography>
      </Box>

      {/* 流量推广服务 */}
      <Grid container spacing={4} sx={{ position: 'relative', zIndex: 1, justifyContent: 'center' }}>
        {services.map((service) => {
          const IconComponent = service.icon;
          return (
            <Grid item xs={12} md={8} lg={6} key={service.id}>
              <Card sx={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                border: service.available ? '1px solid rgba(0, 229, 255, 0.2)' : '1px solid rgba(128, 128, 128, 0.2)',
                borderRadius: '12px',
                transition: 'all 0.3s ease',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                opacity: service.available ? 1 : 0.7,
                '&:hover': {
                  transform: service.available ? 'translateY(-5px)' : 'none',
                  boxShadow: service.available ? '0 10px 30px rgba(0, 229, 255, 0.3)' : 'none',
                  border: service.available ? '1px solid rgba(0, 229, 255, 0.4)' : '1px solid rgba(128, 128, 128, 0.2)'
                }
              }}>              <CardContent sx={{ textAlign: 'center', p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <IconComponent sx={{ 
                    fontSize: 60, 
                    color: service.available ? theme.palette.primary.main : theme.palette.grey[400], 
                    mb: 2,
                    filter: service.available ? 'drop-shadow(0 0 10px rgba(0, 229, 255, 0.5))' : 'none'
                  }} />
                  
                  <Typography variant="h5" gutterBottom sx={{ 
                    fontWeight: 600,
                    color: service.available ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.5)',
                    mb: 1
                  }}>
                    {service.title}
                  </Typography>
                  
                  <Typography variant="body2" sx={{ 
                    color: theme.palette.text.secondary,
                    mb: 2,
                    lineHeight: 1.6,
                    flexGrow: 1
                  }}>
                    {service.description}
                  </Typography>
                  
                  {/* 状态和用户信息 */}
                   <Box sx={{ mb: 2 }}>
                     <Typography variant="caption" sx={{ 
                       color: theme.palette.text.secondary,
                       display: 'block',
                       mb: 0.5
                     }}>
                       {language === 'zh' ? '状态' : 'Status'}: <span style={{color: service.available ? '#52c41a' : '#faad14'}}>{service.status}</span> | {language === 'zh' ? '在线用户' : 'Online Users'}: {service.users}
                     </Typography>
                     <Typography variant="caption" sx={{ 
                       color: theme.palette.text.secondary,
                       display: 'block'
                     }}>
                       {language === 'zh' ? '类型' : 'Type'}: {service.platform}
                     </Typography>
                   </Box>
                  
                  {/* 功能特性 */}
                  <Box sx={{ mb: 3 }}>
                    <Grid container spacing={1}>
                      {service.features.slice(0, 4).map((feature, index) => (
                        <Grid item xs={6} key={index}>
                          <Chip 
                            label={feature} 
                            size="small"
                            sx={{ 
                              bgcolor: service.available ? 'rgba(24, 144, 255, 0.1)' : 'rgba(128, 128, 128, 0.1)',
                              color: service.available ? theme.palette.primary.main : theme.palette.grey[500],
                              fontSize: '0.7rem',
                              height: '24px',
                              width: '100%'
                            }} 
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                  
                  {/* 在线查看按钮 */}
                   <Box sx={{ display: 'flex', width: '100%' }}>
                     <Button
                       variant={service.available ? "contained" : "outlined"}
                       size="medium"
                       onClick={() => handleViewService(service)}
                       startIcon={<VisibilityIcon />}
                       disabled={!service.available}
                       sx={{
                         width: '100%',
                         py: 1.5,
                         background: service.available ? 'linear-gradient(45deg, #1890ff, #40a9ff)' : 'transparent',
                         borderColor: service.available ? 'transparent' : 'rgba(128, 128, 128, 0.3)',
                         color: service.available ? 'white' : 'rgba(128, 128, 128, 0.7)',
                         '&:hover': {
                           background: service.available ? 'linear-gradient(45deg, #40a9ff, #1890ff)' : 'transparent',
                           boxShadow: service.available ? '0 0 20px rgba(24, 144, 255, 0.5)' : 'none'
                         }
                       }}
                     >
                       {service.available ? (language === 'zh' ? '在线查看' : 'View Online') : (language === 'zh' ? '维护中' : 'Maintenance')}
                     </Button>
                   </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* 服务说明和使用指南 */}
       <Card sx={{
         mt: 6,
         background: 'rgba(255, 255, 255, 0.95)',
         backdropFilter: 'blur(10px)',
         border: '1px solid rgba(0, 229, 255, 0.1)',
         borderRadius: '12px',
         position: 'relative',
         zIndex: 1
       }}>
         <CardContent sx={{ p: 4 }}>
           <Typography variant="h5" gutterBottom sx={{ 
             color: theme.palette.primary.main,
             fontWeight: 600,
             mb: 3
           }}>
             {language === 'zh' ? '使用说明' : 'Usage Instructions'}
           </Typography>
           
           <Grid container spacing={3}>
             <Grid item xs={12} md={6}>
               <Typography variant="h6" gutterBottom sx={{ color: 'rgba(0, 0, 0, 0.8)', mb: 2 }}>
                 {language === 'zh' ? '在线服务' : 'Online Services'}
               </Typography>
               <Typography variant="body2" sx={{ color: theme.palette.text.secondary, lineHeight: 1.6 }}>
                 • {language === 'zh' ? '无需下载安装，直接在线使用' : 'No download required, use directly online'}<br/>
                 • {language === 'zh' ? '支持所有现代浏览器' : 'Supports all modern browsers'}<br/>
                 • {language === 'zh' ? '实时数据同步和更新' : 'Real-time data sync and updates'}<br/>
                 • {language === 'zh' ? '24/7 在线技术支持' : '24/7 online technical support'}
               </Typography>
             </Grid>
             
             <Grid item xs={12} md={6}>
               <Typography variant="h6" gutterBottom sx={{ color: 'rgba(0, 0, 0, 0.8)', mb: 2 }}>
                 {language === 'zh' ? '访问要求' : 'Access Requirements'}
               </Typography>
               <Typography variant="body2" sx={{ color: theme.palette.text.secondary, lineHeight: 1.6 }}>
                 • {language === 'zh' ? '稳定的网络连接' : 'Stable internet connection'}<br/>
                 • {language === 'zh' ? '现代浏览器（Chrome、Firefox、Safari、Edge）' : 'Modern browser (Chrome, Firefox, Safari, Edge)'}<br/>
                 • {language === 'zh' ? '建议屏幕分辨率：1280x720 或更高' : 'Recommended resolution: 1280x720 or higher'}<br/>
                 • {language === 'zh' ? '注册账号以获得完整功能' : 'Register account for full features'}
               </Typography>
             </Grid>
           </Grid>
         </CardContent>
       </Card>
    </Box>
  );
};

export default KuaishouService;
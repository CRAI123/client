import React, { useContext } from 'react';
import { Box, Typography, Grid, Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { LanguageContext } from '../App';
import StarIcon from '@mui/icons-material/Star';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatIcon from '@mui/icons-material/Chat';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import PhoneIcon from '@mui/icons-material/Phone';
import MessageIcon from '@mui/icons-material/Message';
import SchoolIcon from '@mui/icons-material/School';
import ComputerIcon from '@mui/icons-material/Computer';

// 添加CSS动画样式
const floatAnimation = `
  @keyframes float {
    0% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-10px);
    }
    100% {
      transform: translateY(0px);
    }
  }
`;

// 将动画样式注入到页面
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = floatAnimation;
  document.head.appendChild(style);
}

function PriceList() {
  const { language } = useContext(LanguageContext);

  // 可爱卡通风格的价格数据
  const priceData = {
    title: language === 'zh' ? 'CR 常规价格表' : 'CR Regular Price List',
    sections: [
      {
        title: language === 'zh' ? '王者' : 'Honor of Kings',
        icon: '👑',
        color: '#FFB6C1',
        items: [
          { service: language === 'zh' ? '排位' : 'Ranked', price: language === 'zh' ? '7元/局 25元/时' : '7¥/Game 25¥/Hour' },
          { service: language === 'zh' ? '娱乐' : 'Casual', price: language === 'zh' ? '5元/局 18元/时' : '5¥/Game 18¥/Hour' },
          { service: language === 'zh' ? '巅峰' : 'Peak', price: language === 'zh' ? '12元/6时 38元/12时' : '12¥/6H 38¥/12H' },
          { service: language === 'zh' ? '备注' : 'Note', price: language === 'zh' ? '陪聊+4元/局 陪聊+6元/时' : 'Chat +4¥/Game +6¥/Hour' }
        ]
      },
      {
        title: language === 'zh' ? '吃鸡' : 'PUBG',
        icon: '🐔',
        color: '#98FB98',
        items: [
          { service: language === 'zh' ? '排位' : 'Ranked', price: language === 'zh' ? '13元/局 47元/时' : '13¥/Game 47¥/Hour' },
          { service: language === 'zh' ? '娱乐' : 'Casual', price: language === 'zh' ? '8元/局 28元/时' : '8¥/Game 28¥/Hour' },
          { service: language === 'zh' ? '备注' : 'Note', price: language === 'zh' ? '陪聊+5元/局 陪聊+8元/时' : 'Chat +5¥/Game +8¥/Hour' }
        ]
      },
      {
        title: language === 'zh' ? '其他' : 'Others',
        icon: '🎮',
        color: '#DDA0DD',
        items: [
          { service: language === 'zh' ? '时长25/5时' : 'Duration 25/5H', price: language === 'zh' ? '815/月' : '815¥/Month' },
          { service: language === 'zh' ? '备注' : 'Note', price: language === 'zh' ? '其他游戏价格面议' : 'Other games negotiable' }
        ]
      },
      {
        title: language === 'zh' ? '代练' : 'Boosting',
        icon: '⚡',
        color: '#F0E68C',
        items: [
          { service: language === 'zh' ? '时长10/5时' : 'Duration 10/5H', price: language === 'zh' ? '23元/时' : '23¥/Hour' },
          { service: language === 'zh' ? '备注' : 'Note', price: language === 'zh' ? '具体价格根据段位而定' : 'Price varies by rank' }
        ]
      },
      {
        title: language === 'zh' ? '培训' : 'Training',
        icon: '📚',
        color: '#87CEEB',
        items: [
          { service: language === 'zh' ? '新手教学' : 'Beginner Training', price: language === 'zh' ? '14元/时' : '14¥/Hour' },
          { service: language === 'zh' ? '进阶指导' : 'Advanced Coaching', price: language === 'zh' ? '25元/时' : '25¥/Hour' },
          { service: language === 'zh' ? '备注' : 'Note', price: language === 'zh' ? '包教包会' : 'Guaranteed learning' }
        ]
      }
    ]
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #FFF8DC 0%, #FFFACD 25%, #F5F5DC 50%, #FFEFD5 75%, #FDF5E6 100%)',
      py: 4,
      px: 2,
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* 可爱的背景装饰 */}
      <Box sx={{
        position: 'absolute',
        top: 20,
        left: 20,
        fontSize: '2rem',
        opacity: 0.3,
        animation: 'float 3s ease-in-out infinite'
      }}>⭐</Box>
      <Box sx={{
        position: 'absolute',
        top: 100,
        right: 50,
        fontSize: '1.5rem',
        opacity: 0.4,
        animation: 'float 2s ease-in-out infinite reverse'
      }}>🌸</Box>
      <Box sx={{
        position: 'absolute',
        bottom: 100,
        left: 100,
        fontSize: '1.8rem',
        opacity: 0.3,
        animation: 'float 2.5s ease-in-out infinite'
      }}>🎀</Box>
      
      {/* 主标题 */}
      <Box sx={{ 
        textAlign: 'center', 
        mb: 4,
        position: 'relative',
        zIndex: 1
      }}>
        <Typography 
          variant="h2" 
          sx={{ 
            color: '#8B4513',
            mb: 2,
            fontWeight: 'bold',
            fontFamily: '"Comic Sans MS", "Microsoft YaHei", cursive',
            fontSize: { xs: '1.8rem', md: '2.5rem' },
            textShadow: '2px 2px 4px rgba(139, 69, 19, 0.3)'
          }}
        >
          {priceData.title}
        </Typography>
        
        <Box sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 1,
          mb: 2
        }}>
          <Typography sx={{ fontSize: '1.5rem' }}>🌟</Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              color: '#CD853F',
              fontFamily: '"Comic Sans MS", "Microsoft YaHei", cursive',
              fontWeight: 'bold'
            }}
          >
            {language === 'zh' ? '主播' : 'Streamer'}
          </Typography>
          <Typography sx={{ fontSize: '1.5rem' }}>🌟</Typography>
        </Box>
      </Box>

      {/* 价格表主体 */}
      <Box sx={{ 
        maxWidth: '800px', 
        mx: 'auto',
        position: 'relative',
        zIndex: 1
      }}>
        {priceData.sections.map((section, sectionIndex) => (
          <Box key={sectionIndex} sx={{ mb: 4 }}>
            {/* 卷轴样式的卡片 */}
            <Card sx={{
              background: 'linear-gradient(135deg, #FFFEF7 0%, #FFF8DC 100%)',
              borderRadius: '20px',
              border: '3px solid #DEB887',
              boxShadow: '0 8px 25px rgba(139, 69, 19, 0.2)',
              position: 'relative',
              overflow: 'visible',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: -10,
                left: -10,
                right: -10,
                bottom: -10,
                background: 'linear-gradient(135deg, #F4A460 0%, #DEB887 100%)',
                borderRadius: '25px',
                zIndex: -1,
                opacity: 0.3
              }
            }}>              
              <CardContent sx={{ p: 3 }}>                
                {/* 板块标题 */}
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  mb: 3,
                  p: 2,
                  background: `linear-gradient(135deg, ${section.color}40 0%, ${section.color}20 100%)`,
                  borderRadius: '15px',
                  border: `2px solid ${section.color}`,
                  position: 'relative'
                }}>
                  <Typography sx={{ fontSize: '2rem', mr: 2 }}>{section.icon}</Typography>
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      color: '#8B4513',
                      fontWeight: 'bold',
                      fontFamily: '"Comic Sans MS", "Microsoft YaHei", cursive',
                      textShadow: '1px 1px 2px rgba(139, 69, 19, 0.3)'
                    }}
                  >
                    {section.title}
                  </Typography>
                </Box>
                
                {/* 服务项目列表 */}
                <Box>
                  {section.items.map((item, itemIndex) => (
                    <Box key={itemIndex} sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      p: 2,
                      mb: 1,
                      background: item.service.includes(language === 'zh' ? '备注' : 'Note') 
                        ? 'linear-gradient(135deg, #F0E68C30 0%, #F0E68C20 100%)'
                        : 'linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.4) 100%)',
                      borderRadius: '12px',
                      border: item.service.includes(language === 'zh' ? '备注' : 'Note')
                        ? '1px dashed #DAA520'
                        : '1px solid #DEB887',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        background: item.service.includes(language === 'zh' ? '备注' : 'Note')
                          ? 'linear-gradient(135deg, #F0E68C50 0%, #F0E68C30 100%)'
                          : 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.6) 100%)',
                        transform: 'translateX(5px)'
                      }
                    }}>
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          color: '#8B4513',
                          fontWeight: item.service.includes(language === 'zh' ? '备注' : 'Note') ? 'normal' : 'bold',
                          fontFamily: '"Microsoft YaHei", sans-serif',
                          fontSize: item.service.includes(language === 'zh' ? '备注' : 'Note') ? '0.9rem' : '1rem'
                        }}
                      >
                        {item.service}
                      </Typography>
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          color: item.service.includes(language === 'zh' ? '备注' : 'Note') ? '#B8860B' : '#CD853F',
                          fontWeight: 'bold',
                          fontFamily: 'monospace',
                          fontSize: item.service.includes(language === 'zh' ? '备注' : 'Note') ? '0.9rem' : '1rem'
                        }}
                      >
                        {item.price}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>
      
      {/* 价格表卡片 */}
      <Grid container spacing={3}>
        {priceData.sections.map((category, categoryIndex) => (
          <Grid item xs={12} md={6} key={categoryIndex}>
            <Card sx={{
              background: `linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)`,
              backdropFilter: 'blur(15px)',
              border: `2px solid ${category.color}40`,
              borderRadius: '20px',
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                transform: 'translateY(-8px) scale(1.02)',
                boxShadow: `0 15px 35px ${category.color}30`,
                border: `2px solid ${category.color}80`
              },
              overflow: 'hidden',
              position: 'relative'
            }}>
              {/* 装饰性背景 */}
              <Box sx={{
                position: 'absolute',
                top: -50,
                right: -50,
                width: 100,
                height: 100,
                background: `radial-gradient(circle, ${category.color}20 0%, transparent 70%)`,
                borderRadius: '50%'
              }} />
              
              <CardContent sx={{ p: 3, position: 'relative', zIndex: 1 }}>
                {/* 标题部分 */}
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  mb: 3,
                  p: 2,
                  background: `linear-gradient(135deg, ${category.color}20 0%, ${category.color}10 100%)`,
                  borderRadius: '15px',
                  border: `1px solid ${category.color}30`
                }}>
                  {category.icon}
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      ml: 2,
                      color: category.color,
                      fontWeight: 700,
                      fontFamily: '"Comic Sans MS", cursive',
                      textShadow: `0 0 10px ${category.color}50`
                    }}
                  >
                    {category.category}
                  </Typography>
                </Box>
                
                {/* 表格数据渲染 (王者荣耀和和平精英) */}
                {category.tableData && (
                  <TableContainer component={Paper} sx={{ 
                    mb: 2, 
                    background: 'rgba(255, 255, 255, 0.8)',
                    borderRadius: '12px',
                    border: `1px solid ${category.color}30`
                  }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow sx={{ background: `${category.color}20` }}>
                          <TableCell sx={{ 
                            color: category.color, 
                            fontWeight: 'bold',
                            fontFamily: '"Comic Sans MS", cursive',
                            border: `1px solid ${category.color}30`
                          }}>
                            {language === 'zh' ? '段位' : 'Rank'}
                          </TableCell>
                          <TableCell sx={{ 
                            color: category.color, 
                            fontWeight: 'bold',
                            fontFamily: '"Comic Sans MS", cursive',
                            border: `1px solid ${category.color}30`
                          }}>
                            {language === 'zh' ? '陪练' : 'Training'}
                          </TableCell>
                          <TableCell sx={{ 
                            color: category.color, 
                            fontWeight: 'bold',
                            fontFamily: '"Comic Sans MS", cursive',
                            border: `1px solid ${category.color}30`
                          }}>
                            {language === 'zh' ? '陪玩' : 'Playing'}
                          </TableCell>
                          <TableCell sx={{ 
                            color: category.color, 
                            fontWeight: 'bold',
                            fontFamily: '"Comic Sans MS", cursive',
                            border: `1px solid ${category.color}30`
                          }}>
                            {language === 'zh' ? '包月' : 'Monthly'}
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {category.tableData.map((row, index) => (
                          <TableRow key={index} sx={{
                            '&:hover': {
                              background: `${category.color}10`
                            }
                          }}>
                            <TableCell sx={{ 
                              color: 'rgba(0, 0, 0, 0.8)',
                              border: `1px solid ${category.color}20`,
                              fontWeight: 'bold'
                            }}>
                              {row.rank}
                            </TableCell>
                            <TableCell sx={{ 
                              color: 'rgba(0, 0, 0, 0.7)',
                              border: `1px solid ${category.color}20`
                            }}>
                              {row.training}
                            </TableCell>
                            <TableCell sx={{ 
                              color: 'rgba(0, 0, 0, 0.7)',
                              border: `1px solid ${category.color}20`
                            }}>
                              {row.playing}
                            </TableCell>
                            <TableCell sx={{ 
                              color: 'rgba(0, 0, 0, 0.7)',
                              border: `1px solid ${category.color}20`
                            }}>
                              {row.monthly}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
                
                {/* 服务列表渲染 (其他区和增值区) */}
                {category.services && (
                  <Box sx={{ mb: 2 }}>
                    <Grid container spacing={1}>
                      {category.services.map((service, index) => (
                        <Grid item xs={12} sm={6} key={index}>
                          <Box sx={{
                            p: 2,
                            background: `linear-gradient(135deg, ${category.color}15 0%, ${category.color}05 100%)`,
                            borderRadius: '10px',
                            border: `1px solid ${category.color}30`,
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              background: `linear-gradient(135deg, ${category.color}25 0%, ${category.color}15 100%)`,
                              transform: 'translateY(-2px)'
                            }
                          }}>
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                color: 'rgba(0, 0, 0, 0.8)',
                                fontWeight: 'bold',
                                mb: 0.5,
                                fontSize: '0.9rem'
                              }}
                            >
                              {service.name}
                            </Typography>
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                color: category.color,
                                fontWeight: 'bold',
                                fontSize: '1rem'
                              }}
                            >
                              {service.price}
                            </Typography>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                )}
                
                {/* 备注信息 */}
                {category.note && (
                  <Box sx={{
                    mt: 2,
                    p: 2,
                    background: `linear-gradient(135deg, ${category.color}10 0%, transparent 100%)`,
                    borderRadius: '10px',
                    border: `1px solid ${category.color}20`
                  }}>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: category.color,
                        fontStyle: 'italic',
                        display: 'block',
                        fontWeight: 'bold'
                      }}
                    >
                      {category.note}
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      {/* 备注信息 */}
      <Box sx={{ 
        mt: 4, 
        p: 3,
        background: 'linear-gradient(135deg, rgba(255, 248, 220, 0.8) 0%, rgba(255, 239, 213, 0.8) 100%)',
        borderRadius: '15px',
        border: '2px solid #DEB887',
        textAlign: 'center'
      }}>
        <Typography 
          variant="body2" 
          sx={{ 
            color: '#8B4513',
            fontStyle: 'italic',
            fontFamily: '"Comic Sans MS", "Microsoft YaHei", cursive'
          }}
        >
          {language === 'zh' 
            ? '💡 备注：以上价格为基础价格，具体价格可能根据难度和时长有所调整。欢迎咨询详细信息！' 
            : '💡 Note: The above prices are basic prices, and specific prices may be adjusted according to difficulty and duration. Welcome to inquire for detailed information!'}
        </Typography>
      </Box>
      
      {/* 联系方式部分 */}
      <Box sx={{ 
        mt: 4, 
        maxWidth: '800px',
        mx: 'auto',
        position: 'relative',
        zIndex: 1
      }}>
        <Card sx={{
          background: 'linear-gradient(135deg, #FFFEF7 0%, #FFF8DC 100%)',
          borderRadius: '20px',
          border: '3px solid #DEB887',
          boxShadow: '0 8px 25px rgba(139, 69, 19, 0.2)',
          position: 'relative',
          overflow: 'visible',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: -10,
            left: -10,
            right: -10,
            bottom: -10,
            background: 'linear-gradient(135deg, #F4A460 0%, #DEB887 100%)',
            borderRadius: '25px',
            zIndex: -1,
            opacity: 0.3
          }
        }}>              
          <CardContent sx={{ p: 4, textAlign: 'center' }}>                
            {/* 联系标题 */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              mb: 3,
              p: 2,
              background: 'linear-gradient(135deg, #FFB6C140 0%, #FFB6C120 100%)',
              borderRadius: '15px',
              border: '2px solid #FFB6C1',
              position: 'relative'
            }}>
              <Typography sx={{ fontSize: '2rem', mr: 2 }}>📞</Typography>
              <Typography 
                variant="h5" 
                sx={{ 
                  color: '#8B4513',
                  fontWeight: 'bold',
                  fontFamily: '"Comic Sans MS", "Microsoft YaHei", cursive',
                  textShadow: '1px 1px 2px rgba(139, 69, 19, 0.3)'
                }}
              >
                {language === 'zh' ? '联系我们' : 'Contact Us'}
              </Typography>
            </Box>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Box sx={{
                  p: 3,
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.4) 100%)',
                  borderRadius: '15px',
                  border: '2px solid #DEB887',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 10px 25px rgba(139, 69, 19, 0.2)'
                  }
                }}>
                  <MessageIcon sx={{ color: '#07C160', fontSize: 40, mb: 2 }} />
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: '#8B4513',
                      mb: 1,
                      fontWeight: 'bold',
                      fontFamily: '"Comic Sans MS", "Microsoft YaHei", cursive'
                    }}
                  >
                    {language === 'zh' ? '微信联系' : 'WeChat Contact'}
                  </Typography>
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      color: '#CD853F',
                      fontWeight: 'bold',
                      fontFamily: 'monospace',
                      background: 'rgba(139, 69, 19, 0.1)',
                      p: 1,
                      borderRadius: '8px'
                    }}
                  >
                    CR_Studio
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Box sx={{
                  p: 3,
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.4) 100%)',
                  borderRadius: '15px',
                  border: '2px solid #DEB887',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 10px 25px rgba(139, 69, 19, 0.2)'
                  }
                }}>
                  <PhoneIcon sx={{ color: '#CD853F', fontSize: 40, mb: 2 }} />
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: '#8B4513',
                      mb: 1,
                      fontWeight: 'bold',
                      fontFamily: '"Comic Sans MS", "Microsoft YaHei", cursive'
                    }}
                  >
                    {language === 'zh' ? '服务时间' : 'Service Hours'}
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: '#CD853F',
                      fontWeight: 'bold'
                    }}
                  >
                    {language === 'zh' ? '24小时在线服务' : '24/7 Online Service'}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
            
            <Typography 
              variant="h6" 
              sx={{ 
                color: '#B8860B',
                mt: 3,
                fontFamily: '"Comic Sans MS", "Microsoft YaHei", cursive',
                fontWeight: 'bold'
              }}
            >
              {language === 'zh' ? '✨ 欢迎咨询详细价格和服务内容 ✨' : '✨ Welcome to inquire about detailed prices and services ✨'}
            </Typography>
            
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#8B4513',
                mt: 2,
                fontStyle: 'italic',
                opacity: 0.8
              }}
            >
              {language === 'zh' ? '🎮 专业团队 | 🌟 优质服务 | 💯 信誉保证' : '🎮 Professional Team | 🌟 Quality Service | 💯 Guaranteed Reputation'}
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}

export default PriceList;
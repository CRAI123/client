import React from 'react';
import { Box, Typography, Paper, Divider, Grid, LinearProgress, useTheme } from '@mui/material';
import CodeIcon from '@mui/icons-material/Code';
import SchoolIcon from '@mui/icons-material/School';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import TimelineIcon from '@mui/icons-material/Timeline';

function About() {
  const theme = useTheme();
  
  // 技能数据
  const skills = [
    { name: 'React', value: 90 },
    { name: 'Node.js', value: 85 },
    { name: 'JavaScript', value: 75 },
    { name: 'HTML/CSS ', value: 75 },
    { name: 'Python ', value: 90 },
    { name: 'C/C++', value: 85 },
    { name: 'Additive Manufacturing', value: 95 },
  ];
  
  return (
    <Box sx={{ mt: 4, position: 'relative' }}>
      {/* 背景装饰 */}
      <Box sx={{ 
        position: 'absolute', 
        top: '10%', 
        left: '5%', 
        width: '100px', 
        height: '100px', 
        border: '1px solid rgba(0, 229, 255, 0.2)', 
        borderRadius: '4px',
        transform: 'rotate(15deg)',
        opacity: 0.3,
        zIndex: 0
      }} />
      
      <Typography 
        variant="h3" 
        gutterBottom
        sx={{ 
          fontFamily: '"Orbitron", sans-serif',
          fontWeight: 700,
          letterSpacing: '0.05em',
          background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: '0 0 15px rgba(0, 229, 255, 0.3)',
        }}
      >
        关于我
      </Typography>
      <Divider sx={{ 
        mb: 4, 
        borderColor: 'rgba(0, 229, 255, 0.3)',
        '&::before, &::after': {
          borderColor: 'rgba(0, 229, 255, 0.3)',
        }
      }} />
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ 
            p: 3, 
            mb: 3,
            borderLeft: '3px solid #00e5ff',
            transition: 'transform 0.3s, box-shadow 0.3s',
            '&:hover': {
              transform: 'translateY(-5px)',
              boxShadow: '0 10px 25px rgba(0, 229, 255, 0.2)'
            },
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <SchoolIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
              <Typography 
                variant="h5" 
                gutterBottom 
                sx={{ 
                  fontFamily: '"Orbitron", sans-serif',
                  letterSpacing: '0.03em',
                  m: 0
                }}
              >
                个人简介
              </Typography>
            </Box>
            <Typography paragraph sx={{ color: theme.palette.text.secondary, lineHeight: 1.7 }}>
              大家好，我是一名专注于计算机科学与人工智能领域的开发者。
              主攻Python与C++开发，熟悉数据结构、算法优化及高性能编程。
              人工智能领域：代码学习/深度学习框架。
              熟悉前端技术（如React/Next.js等）。
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ 
            p: 3,
            borderLeft: '3px solid #ff00e5',
            transition: 'transform 0.3s, box-shadow 0.3s',
            '&:hover': {
              transform: 'translateY(-5px)',
              boxShadow: '0 10px 25px rgba(255, 0, 229, 0.2)'
            },
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <TimelineIcon sx={{ color: theme.palette.secondary.main, mr: 1 }} />
              <Typography 
                variant="h5" 
                gutterBottom 
                sx={{ 
                  fontFamily: '"Orbitron", sans-serif',
                  letterSpacing: '0.03em',
                  m: 0
                }}
              >
                比赛时间线
              </Typography>
            </Box>
            <Box sx={{ position: 'relative', ml: 1, mt: 3 }}>
              {/* 垂直时间线 */}
              <Box sx={{ 
                position: 'absolute',
                left: 10,
                top: 0,
                bottom: 0,
                width: 2,
                bgcolor: 'rgba(255, 0, 229, 0.3)',
                zIndex: 0
              }} />
              
              {/* 比赛条目 */}
              {[
                { 
                  date: '2025年3月', 
                  title: '信息素养提升专项赛', 
                  result: '特等奖',
                  description: '开发游戏《哪吒推箱子》，在比赛中获得特等奖。'
                },
                { 
                  date: '2024年5月', 
                  title: '信息素养提升专项赛', 
                  result: '二等奖',
                  description: '开发3D作品《智能红绿灯》，在比赛中获得二等奖。'
                },
                { 
                  date: '2024年4月', 
                  title: '信息素养提升专项赛', 
                  result: '一等奖',
                  description: '开发游戏《保卫坚果》，在比赛中获得一等奖。'
                },
                { 
                  date: '2023年10月', 
                  title: '人工智能创新大赛', 
                  result: '铜奖',
                  description: '开发基于太空天梯工程设计项目，在比赛中获得铜奖。'
                },
                { 
                  date: '2022年9月', 
                  title: '”星辰杯“人工智能大赛', 
                  result: '铜奖',
                  description: '通过初赛晋级，在比赛中再次获得铜奖。'
                },
                { 
                  date: '2022年7月 ', 
                  title: '”星辰杯“人工智能大赛', 
                  result: '铜奖',
                  description: '解决复杂问题，在比赛中获得铜奖。'
                }
              ].map((item, index) => (
                <Box key={index} sx={{ 
                  position: 'relative', 
                  mb: 4,
                  pl: 4,
                  '&:last-child': {
                    mb: 0
                  }
                }}>
                  {/* 时间节点 */}
                  <Box sx={{ 
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    width: 22,
                    height: 22,
                    borderRadius: '50%',
                    bgcolor: 'background.paper',
                    border: '2px solid #ff00e5',
                    zIndex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 0 10px rgba(255, 0, 229, 0.5)'
                  }}>
                    <EmojiEventsIcon sx={{ fontSize: 12, color: '#1890ff' }} />
                  </Box>
                  
                  {/* 比赛内容 */}
                  <Box>
                    <Typography variant="subtitle2" sx={{ 
                      color: 'rgba(255, 0, 229, 0.8)',
                      fontWeight: 500,
                      mb: 0.5,
                      fontFamily: '"Orbitron", sans-serif',
                    }}>
                      {item.date}
                    </Typography>
                    <Typography variant="h6" sx={{ 
                      fontWeight: 600,
                      mb: 0.5,
                      fontSize: '1rem'
                    }}>
                      {item.title} · <span style={{ color: '#1890ff' }}>{item.result}</span>
                    </Typography>
                    <Typography variant="body2" sx={{ 
                      color: theme.palette.text.secondary,
                      lineHeight: 1.6
                    }}>
                      {item.description}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>
      
      <Paper elevation={3} sx={{ 
        p: 3, 
        mt: 4,
        borderTop: '3px solid #00e5ff',
        background: 'linear-gradient(135deg, #1890ff 0%, #40a9ff 100%)',
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <CodeIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
          <Typography 
            variant="h5" 
            gutterBottom 
            sx={{ 
              fontFamily: '"Orbitron", sans-serif',
              letterSpacing: '0.03em',
              m: 0
            }}
          >
            技能
          </Typography>
        </Box>
        
        <Grid container spacing={2}>
          {skills.map((skill) => (
            <Grid item xs={12} sm={6} key={skill.name}>
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {skill.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: theme.palette.primary.main }}>
                    {skill.value}%
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={skill.value} 
                  sx={{ 
                    height: 6, 
                    borderRadius: 3,
                    backgroundColor: 'rgba(0, 229, 255, 0.1)',
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 3,
                      background: 'linear-gradient(90deg, #6366f1, #8b5cf6)'
                    }
                  }}
                />
              </Box>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Box>
  );
}

export default About;
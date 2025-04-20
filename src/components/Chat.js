import React, { useState, useContext, useEffect } from 'react';
import {
  Box,
  Paper,
  TextField,
  IconButton,
  Typography,
  CircularProgress,
  useTheme,
  Zoom,
  Fab,
  Alert,
  Snackbar
} from '@mui/material';
import { API_CONFIG } from '../config/api.js';
import ChatIcon from '@mui/icons-material/Chat';
import SendIcon from '@mui/icons-material/Send';
import { LanguageContext } from '../App';

const Chat = () => {
  const theme = useTheme();
  const { language } = useContext(LanguageContext);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 处理消息发送
  const handleSendMessage = async () => {
    if (!input.trim()) return;

    // 添加用户消息
    const userMessage = { text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(API_CONFIG.KIMI_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_CONFIG.KIMI_API_KEY}`
        },
        body: JSON.stringify({
          messages: [{
            role: 'user',
            content: input
          }],
          model: 'moonshot-v1-8k'
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const aiMessage = {
        text: data.choices[0].message.content,
        sender: 'ai'
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      console.error('Error:', err);
      setError(language === 'zh' ? '发送消息时出错，请稍后重试。' : 'Error sending message. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // 处理按键事件
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const [isOpen, setIsOpen] = useState(false);

  // 添加初始问候语
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const greetingMessage = {
        text: language === 'zh' ? '你好，我是AI智能助手，有什么可以帮您' : 'Hello, I am an AI assistant. How can I help you?',
        sender: 'ai'
      };
      setMessages([greetingMessage]);
    }
  }, [isOpen, messages.length, language]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Box sx={{ position: 'fixed', bottom: 20, right: 20, zIndex: 1000 }}>
      <Zoom in={!isOpen}>
        <Fab
          color="primary"
          onClick={toggleChat}
          sx={{
            boxShadow: '0 0 15px rgba(0, 229, 255, 0.3)'
          }}
        >
          <ChatIcon />
        </Fab>
      </Zoom>

      <Zoom in={isOpen}>
        <Paper
          elevation={3}
          sx={{
            position: 'absolute',
            bottom: '60px',
            right: 0,
            width: '350px',
            height: '500px',
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            background: 'rgba(18, 18, 18, 0.9)',
            border: '1px solid rgba(0, 229, 255, 0.2)',
            borderRadius: '8px',
            boxShadow: '0 0 20px rgba(0, 229, 255, 0.2)'
          }}
    >
      {/* 聊天标题和关闭按钮 */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography
          variant="h6"
          sx={{
            color: theme.palette.primary.main,
            fontFamily: '"Orbitron", sans-serif',
            letterSpacing: '0.05em'
          }}
        >
          {language === 'zh' ? 'AI 助手' : 'AI Assistant'}
        </Typography>
        <IconButton
          onClick={toggleChat}
          size="small"
          sx={{
            color: theme.palette.primary.main,
            '&:hover': {
              backgroundColor: 'rgba(0, 229, 255, 0.1)'
            }
          }}
        >
          <SendIcon sx={{ transform: 'rotate(45deg)' }} />
        </IconButton>
      </Box>

      {/* 消息显示区域 */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          mb: 2,
          '&::-webkit-scrollbar': {
            width: '8px'
          },
          '&::-webkit-scrollbar-track': {
            background: 'rgba(0, 0, 0, 0.1)'
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(0, 229, 255, 0.2)',
            borderRadius: '4px'
          }
        }}
      >
        {messages.map((message, index) => (
          <Box
            key={index}
            sx={{
              display: 'flex',
              justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
              mb: 2
            }}
          >
            <Paper
              sx={{
                maxWidth: '70%',
                p: 2,
                background: message.sender === 'user'
                  ? 'linear-gradient(90deg, rgba(0, 229, 255, 0.1), rgba(0, 229, 255, 0.2))'
                  : 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                borderTopRightRadius: message.sender === 'user' ? '4px' : '12px',
                borderTopLeftRadius: message.sender === 'user' ? '12px' : '4px',
                border: '1px solid rgba(0, 229, 255, 0.1)'
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  color: message.sender === 'user'
                    ? theme.palette.primary.main
                    : theme.palette.text.primary,
                  wordBreak: 'break-word'
                }}
              >
                {message.text}
              </Typography>
            </Paper>
          </Box>
        ))}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
            <CircularProgress size={20} sx={{ ml: 2 }} />
          </Box>
        )}
      </Box>

      {/* 输入区域 */}
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <TextField
          fullWidth
          multiline
          maxRows={4}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={language === 'zh' ? '输入消息...' : 'Type a message...'}
          sx={{
            '& .MuiOutlinedInput-root': {
              backgroundColor: 'rgba(0, 0, 0, 0.2)',
              '& fieldset': {
                borderColor: 'rgba(0, 229, 255, 0.2)'
              },
              '&:hover fieldset': {
                borderColor: 'rgba(0, 229, 255, 0.4)'
              },
              '&.Mui-focused fieldset': {
                borderColor: theme.palette.primary.main
              }
            }
          }}
        />
        <IconButton
          onClick={handleSendMessage}
          disabled={loading}
          sx={{
            ml: 1,
            color: theme.palette.primary.main,
            '&:hover': {
              backgroundColor: 'rgba(0, 229, 255, 0.1)'
            }
          }}
        >
          <SendIcon />
        </IconButton>
      </Box>
    </Paper>
      </Zoom>
    </Box>
  );
};

export default Chat;
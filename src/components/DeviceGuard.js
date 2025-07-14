import React, { useEffect, useState } from 'react';
import NotFound from '../pages/NotFound';

// 设备检测组件
function DeviceGuard({ children }) {
  const [isBlocked, setIsBlocked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const detectDevice = () => {
      // 移除所有设备限制，允许所有设备访问
      const shouldBlock = false;
      
      console.log('Device detection: All devices allowed');
      
      setIsBlocked(shouldBlock);
      setIsLoading(false);
    };

    detectDevice();
  }, []);

  // 加载中状态
  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(to right, #ffffff, #f8fafc)'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid #f3f4f6',
          borderTop: '4px solid #6366f1',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // 如果设备被阻止，显示404页面
  if (isBlocked) {
    return <NotFound />;
  }

  // 设备允许访问，显示正常内容
  return children;
}

export default DeviceGuard;
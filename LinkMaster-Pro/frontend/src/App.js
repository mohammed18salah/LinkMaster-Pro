import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Float } from '@react-three/drei';
import { TextField, Button, Paper, Typography, Container, Box, IconButton, Tooltip } from '@mui/material';
import axios from 'axios';

// Animated Icons Component
function AnimatedIcons() {
  return (
    <>
      <Float speed={4} rotationIntensity={1} floatIntensity={2}>
        <mesh position={[-4, 2, 0]}>
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshStandardMaterial color="#4CAF50" transparent opacity={0.7} />
        </mesh>
      </Float>
      <Float speed={2} rotationIntensity={1} floatIntensity={1}>
        <mesh position={[4, -2, 0]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#2196F3" transparent opacity={0.7} />
        </mesh>
      </Float>
      <Float speed={3} rotationIntensity={2} floatIntensity={1.5}>
        <mesh position={[0, 3, -2]}>
          <torusGeometry args={[0.4, 0.2, 16, 32]} />
          <meshStandardMaterial color="#FFC107" transparent opacity={0.7} />
        </mesh>
      </Float>
    </>
  );
}

// 3D Background Component
function Background() {
  return (
    <>
      <Stars factor={4} fade speed={1} />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <AnimatedIcons />
    </>
  );
}

function App() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleBypass = async () => {
    if (!url) {
      setResult({ error: 'الرجاء إدخال رابط صحيح' });
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post('/api/bypass', { url });
      setResult(response.data);
    } catch (error) {
      setResult({ error: 'حدث خطأ في معالجة الرابط. الرجاء المحاولة مرة أخرى.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ height: '100vh', position: 'relative', overflow: 'hidden' }}>
      {/* 3D Background */}
      <Canvas style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
        <Suspense fallback={null}>
          <Background />
          <OrbitControls autoRotate enableZoom={false} />
        </Suspense>
      </Canvas>

      {/* Main Content */}
      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1, pt: 4 }}>
        <Paper 
          elevation={24}
          sx={{
            p: 4,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            borderRadius: 3,
            textAlign: 'center',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}
        >
          <Typography 
            variant="h2" 
            component="h1" 
            sx={{ 
              mb: 2, 
              fontFamily: 'Cairo',
              background: 'linear-gradient(45deg, #2196F3, #4CAF50)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            متخطي الروابط الذكي
          </Typography>

          <Typography 
            variant="h6" 
            sx={{ 
              mb: 4, 
              color: '#666',
              fontFamily: 'Cairo'
            }}
          >
            أداة متطورة لتخطي الروابط المختصرة والوصول للروابط الأصلية بكل سهولة وأمان
          </Typography>

          <Paper 
            elevation={3} 
            sx={{ 
              p: 3, 
              mb: 4, 
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              border: '1px solid rgba(0, 0, 0, 0.1)'
            }}
          >
            <TextField
              fullWidth
              placeholder="قم بلصق الرابط المختصر هنا..."
              variant="outlined"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              dir="rtl"
              sx={{ 
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover fieldset': {
                    borderColor: '#2196F3',
                  },
                }
              }}
            />

            <Button
              variant="contained"
              onClick={handleBypass}
              disabled={loading}
              size="large"
              sx={{ 
                mb: 2,
                minWidth: 200,
                borderRadius: 2,
                background: 'linear-gradient(45deg, #2196F3, #4CAF50)',
                fontFamily: 'Cairo',
                fontSize: '1.1rem',
                '&:hover': {
                  background: 'linear-gradient(45deg, #1976D2, #388E3C)',
                }
              }}
            >
              {loading ? '⏳ جاري التخطي...' : '🔄 تخطي الرابط'}
            </Button>
          </Paper>

          {result && (
            <Paper 
              elevation={3} 
              sx={{ 
                p: 3, 
                textAlign: 'right',
                backgroundColor: result.error ? 'rgba(255,235,235,0.9)' : 'rgba(235,255,235,0.9)',
                borderRadius: 2
              }}
            >
              {result.error ? (
                <Typography color="error" sx={{ fontFamily: 'Cairo' }}>
                  ❌ {result.error}
                </Typography>
              ) : (
                <>
                  <Typography variant="h6" sx={{ color: '#1976D2', mb: 2, fontFamily: 'Cairo' }}>
                    ✅ تم تخطي الرابط بنجاح
                  </Typography>
                  <Typography sx={{ mb: 1, fontFamily: 'Cairo' }}>
                    🔗 الرابط الأصلي: <span style={{ color: '#1976D2' }}>{result.original_url}</span>
                  </Typography>
                  <Typography sx={{ mb: 1, fontFamily: 'Cairo' }}>
                    🎯 الرابط النهائي: <span style={{ color: '#4CAF50' }}>{result.final_url}</span>
                  </Typography>
                  <Typography sx={{ mb: 1, fontFamily: 'Cairo' }}>
                    🔄 عدد التحويلات: {result.redirects}
                  </Typography>
                  <Typography sx={{ fontFamily: 'Cairo' }}>
                    ✨ حالة الرابط: {result.status_code === 200 ? 'صالح' : `كود ${result.status_code}`}
                  </Typography>
                </>
              )}
            </Paper>
          )}

          <Typography 
            variant="body2" 
            sx={{ 
              mt: 4, 
              color: '#666',
              fontFamily: 'Cairo'
            }}
          >
            💡 نصيحة: تأكد دائماً من الروابط قبل زيارتها للحفاظ على أمان تصفحك
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}

export default App; 
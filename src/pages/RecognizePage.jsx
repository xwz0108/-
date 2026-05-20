import { useState, useCallback, useRef } from 'react'
import {
  Container, Typography, Box, Button, Paper, CircularProgress, Alert, Fade, Zoom, LinearProgress, Chip, Tooltip, IconButton,
  Accordion, AccordionSummary, AccordionDetails,
} from '@mui/material'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import CameraAltIcon from '@mui/icons-material/CameraAlt'
import ReplayIcon from '@mui/icons-material/Replay'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import PendingIcon from '@mui/icons-material/Pending'
import { useNavigate } from 'react-router-dom'

// 模拟模式开关（生产环境关闭）
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

// 营养数据库（扩充水果）
const NUTRITION_DB = {
  '红烧肉':  { calories: 350, protein: 15.0, fat: 25.0, carbs: 12.0 },
  '米饭':     { calories: 116, protein: 2.6,  fat: 0.3,  carbs: 25.9 },
  '西红柿炒鸡蛋': { calories: 140, protein: 8.0,  fat: 9.0,  carbs: 6.0 },
  '宫保鸡丁': { calories: 210, protein: 22.0, fat: 12.0, carbs: 8.0 },
  '鱼香肉丝': { calories: 190, protein: 14.0, fat: 10.0, carbs: 12.0 },
  '麻婆豆腐': { calories: 130, protein: 10.0, fat: 8.0,  carbs: 6.0 },
  '糖醋里脊': { calories: 280, protein: 16.0, fat: 18.0, carbs: 15.0 },
  '水煮鱼':   { calories: 160, protein: 20.0, fat: 7.0,  carbs: 3.0 },
  '回锅肉':   { calories: 320, protein: 14.0, fat: 26.0, carbs: 8.0 },
  '可乐鸡翅': { calories: 250, protein: 18.0, fat: 12.0, carbs: 18.0 },
  '蛋炒饭':   { calories: 180, protein: 6.0,  fat: 7.0,  carbs: 24.0 },
  '清炒时蔬': { calories: 50,  protein: 2.5,  fat: 2.0,  carbs: 6.0 },
  '鸡胸肉':   { calories: 165, protein: 31.0, fat: 3.6,  carbs: 0.0 },
  '西兰花':   { calories: 34,  protein: 2.8,  fat: 0.4,  carbs: 7.0 },
  '鸡腿':     { calories: 209, protein: 16.0, fat: 14.0, carbs: 0.0 },
  '三明治':   { calories: 280, protein: 12.0, fat: 12.0, carbs: 30.0 },
  '牛排':     { calories: 240, protein: 26.0, fat: 15.0, carbs: 0.0 },
  '沙拉':     { calories: 35,  protein: 1.5,  fat: 0.5,  carbs: 6.0 },
  // 水果（扩充）
  '苹果':     { calories: 52,  protein: 0.3,  fat: 0.2,  carbs: 14.0 },
  '香蕉':     { calories: 89,  protein: 1.1,  fat: 0.3,  carbs: 23.0 },
  '橙子':     { calories: 47,  protein: 0.8,  fat: 0.2,  carbs: 12.0 },
  '葡萄':     { calories: 69,  protein: 0.7,  fat: 0.2,  carbs: 18.0 },
  '草莓':     { calories: 32,  protein: 0.7,  fat: 0.2,  carbs: 7.7 },
  '西瓜':     { calories: 30,  protein: 0.6,  fat: 0.2,  carbs: 7.6 },
  '芒果':     { calories: 60,  protein: 0.8,  fat: 0.3,  carbs: 15.0 },
  '桃子':     { calories: 39,  protein: 0.9,  fat: 0.3,  carbs: 9.5 },
  '梨':       { calories: 57,  protein: 0.4,  fat: 0.1,  carbs: 15.0 },
  '猕猴桃':   { calories: 61,  protein: 1.1,  fat: 0.5,  carbs: 14.0 },
  '菠萝':     { calories: 50,  protein: 0.5,  fat: 0.1,  carbs: 13.0 },
  '樱桃':     { calories: 63,  protein: 1.1,  fat: 0.2,  carbs: 16.0 },
  '蓝莓':     { calories: 57,  protein: 0.7,  fat: 0.3,  carbs: 14.5 },
  '柚子':     { calories: 42,  protein: 0.8,  fat: 0.1,  carbs: 10.7 },
  '柠檬':     { calories: 29,  protein: 1.1,  fat: 0.3,  carbs: 9.3 },
  '火龙果':   { calories: 51,  protein: 1.1,  fat: 0.4,  carbs: 13.0 },
  '榴莲':     { calories: 147, protein: 1.5,  fat: 5.3,  carbs: 27.0 },
  '荔枝':     { calories: 66,  protein: 0.8,  fat: 0.4,  carbs: 16.5 },
  '龙眼':     { calories: 60,  protein: 1.2,  fat: 0.1,  carbs: 15.5 },
  '哈密瓜':   { calories: 34,  protein: 0.8,  fat: 0.2,  carbs: 8.2 },
  '木瓜':     { calories: 43,  protein: 0.5,  fat: 0.3,  carbs: 11.0 },
}

// 调用服务端 API（Vercel 部署后走 /api/recognize，本地开发走代理）
async function callRecognizeAPI(base64Image, type = 'dish') {
  const API_BASE = import.meta.env.DEV ? '/baidu-api' : '/api';
  
  if (import.meta.env.DEV) {
    // 本地开发：直接调用百度 API（通过 Vite 代理）
    let token;
    const tokenRes = await fetch(
      `/baidu-api/oauth/2.0/token?grant_type=client_credentials&client_id=${BAIDU_API_KEY}&client_secret=${BAIDU_SECRET_KEY}`
    );
    const tokenData = await tokenRes.json();
    if (tokenData.error) throw new Error(`Token错误: ${tokenData.error_description}`);
    token = tokenData.access_token;

    let apiUrl = '';
    if (type === 'dish') {
      apiUrl = `/baidu-api/rest/2.0/image-classify/v2/dish?access_token=${token}`;
    } else {
      apiUrl = `/baidu-api/rest/2.0/image-classify/v2/advanced/general?access_token=${token}`;
    }

    const params = new URLSearchParams();
    params.append('image', base64Image.split(',')[1]);
    params.append('top_num', '5');

    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params
    });
    return res.json();
  } else {
    // 生产环境：调用服务端 API
    const res = await fetch('/api/recognize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: base64Image, type })
    });
    return res.json();
  }
}

function RecognizePage() {
  const [uploadedImage, setUploadedImage] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [apiDebugInfo, setApiDebugInfo] = useState(null)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef(null)
  const navigate = useNavigate()

  const handleImageUpload = useCallback((file) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = (e) => {
      setUploadedImage(e.target.result)
      setError('')
      setApiDebugInfo(null)
    }
    reader.readAsDataURL(file)
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setDragActive(false)
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      handleImageUpload(file)
    } else {
      setError('请上传图片文件')
    }
  }, [handleImageUpload])

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    setDragActive(true)
  }, [])

  const handleDragLeave = useCallback((e) => {
    e.preventDefault()
    setDragActive(false)
  }, [])

  const handleFileInput = useCallback((e) => {
    const file = e.target.files[0]
    handleImageUpload(file)
    e.target.value = ''
  }, [handleImageUpload])

  const handleRecognize = async () => {
    if (!uploadedImage) { setError('请先上传食物图片'); return }
    setIsLoading(true)
    setError('')
    let debugInfo = null
    try {
      let result
      if (!USE_MOCK) {
        console.log('[API] 开始调用识别API')
        // 并行调用菜品和通用识别
        const [dishRes, generalRes] = await Promise.allSettled([
          callRecognizeAPI(uploadedImage, 'dish'),
          callRecognizeAPI(uploadedImage, 'general'),
        ])
        console.log('[API] 菜品识别结果:', JSON.stringify(dishRes.value, null, 2))
        console.log('[API] 通用识别结果:', JSON.stringify(generalRes.value, null, 2))

        // 解析菜品识别
        let dishResult = null
        if (dishRes.status === 'fulfilled' && dishRes.value && !dishRes.value.error_code && dishRes.value.result && dishRes.value.result.length > 0) {
          const top = dishRes.value.result[0]
          dishResult = { name: top.name, calorie: top.calorie || 0, confidence: top.probability || 0, source: '菜品识别' }
        }
        // 解析通用识别（可识别水果）
        let generalResult = null
        if (generalRes.status === 'fulfilled' && generalRes.value && !generalRes.value.error_code && generalRes.value.result && generalRes.value.result.length > 0) {
          const top = generalRes.value.result[0]
          if (top.score > 0.3) {
            generalResult = { name: top.keyword || top.name, calorie: 0, confidence: top.score || 0, source: '通用识别' }
          }
        }
        debugInfo = {
          dish: dishRes.status === 'fulfilled' ? dishRes.value : { error: dishRes.reason?.message || '请求失败' },
          general: generalRes.status === 'fulfilled' ? generalRes.value : { error: generalRes.reason?.message || '请求失败' },
          dishResult,
          generalResult,
        }
        setApiDebugInfo(debugInfo)

        // 优先策略
        let best = null
        if (dishResult && dishResult.confidence > 0.3) {
          best = dishResult
        } else if (generalResult) {
          best = generalResult
        } else if (dishResult) {
          best = dishResult
        }
        console.log('[API] 最佳识别结果:', best)
        if (!best) {
          const dishKeys = dishRes.status === 'fulfilled' && dishRes.value ? Object.keys(dishRes.value).join(', ') : 'N/A'
          const generalKeys = generalRes.status === 'fulfilled' && generalRes.value ? Object.keys(generalRes.value).join(', ') : 'N/A'
          throw new Error(`未能识别到食物。菜品识别字段: ${dishKeys} | 通用识别字段: ${generalKeys}`)
        }
        const dishName = best.name
        const calorie = best.calorie
        const confidence = best.confidence
        const nutrition = NUTRITION_DB[dishName] || { calories: calorie || 50, protein: 1.0, fat: 0.2, carbs: 12.0 }
        const weight = calorie > 0 ? Math.round((calorie / (nutrition.calories || 100)) * 100) : 150
        result = {
          foodName: dishName, calories: calorie || nutrition.calories, protein: nutrition.protein, fat: nutrition.fat, carbs: nutrition.carbs,
          weight, confidence, source: best.source, goal: localStorage.getItem('healthGoal') || '减脂',
        }
      } else {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        const goal = localStorage.getItem('healthGoal') || '减脂'
        result = { foodName: '红烧肉', calories: 350, protein: 15, fat: 25, carbs: 12, weight: 150, confidence: 0.92, source: '模拟数据', goal }
      }
      // 保存历史
      const history = JSON.parse(localStorage.getItem('foodHistory') || '[]')
      history.unshift({ ...result, timestamp: new Date().toISOString(), id: Date.now() })
      localStorage.setItem('foodHistory', JSON.stringify(history.slice(0, 50)))
      navigate('/result', { state: { foodData: result, apiDebugInfo } })
    } catch (err) {
      setError(err.message || '识别失败，请重试')
      console.error(err)
      // 使用局部变量 debugInfo 确保调试信息不会丢失
      if (debugInfo) {
        setApiDebugInfo({ ...debugInfo, error: err.message })
      } else {
        setApiDebugInfo({ error: err.message })
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleRetake = () => {
    setUploadedImage(null)
    setError('')
    setApiDebugInfo(null)
  }

  const getConfidenceLabel = (conf) => {
    if (conf > 0.8) return { label: '高置信度', color: '#4CAF50' }
    if (conf > 0.5) return { label: '中等置信度', color: '#FF9800' }
    return { label: '低置信度', color: '#F44336' }
  }

  return (
    <Container maxWidth="md" sx={{ pb: { xs: 10, md: 4 } }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 4, mt: { xs: 2, md: 4 } }}>
        <Chip
          icon={<AutoAwesomeIcon />}
          label={USE_MOCK ? '⚠️ 演示模式' : '✅ AI 双模型识别中'}
          color={USE_MOCK ? 'warning' : 'primary'}
          sx={{ fontWeight: 'bold', fontSize: '0.85rem', px: 1, mb: 2 }}
        />
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          食物<span style={{ background: 'linear-gradient(135deg, #FF6B35 0%, #FF4081 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>智能识别</span>
        </Typography>
        <Typography variant="body1" color="text.secondary">
          上传食物图片，AI 自动识别（菜品 + 果蔬双模型）
        </Typography>
      </Box>

      {/* Upload Area */}
      {!uploadedImage ? (
        <Zoom in timeout={800}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 4, md: 8 },
              textAlign: 'center',
              border: `3px dashed ${dragActive ? '#FF6B35' : 'rgba(255,107,53,0.3)'}`,
              borderRadius: 4,
              bgcolor: dragActive ? 'rgba(255,107,53,0.05)' : 'white',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              background: dragActive
                ? 'linear-gradient(135deg, rgba(255,107,53,0.05) 0%, rgba(255,64,129,0.05) 100%)'
                : 'white',
              '&:hover': {
                borderColor: '#FF6B35',
                bgcolor: 'rgba(255,107,53,0.02)',
                transform: 'translateY(-4px)',
                boxShadow: '0 20px 60px rgba(255,107,53,0.15)',
              },
            }}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleFileInput}
            />
            <Box sx={{ mb: 3 }}>
              <Box
                sx={{
                  width: 100,
                  height: 100,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #FF6B35 0%, #FF8F6B 100%)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  boxShadow: '0 8px 32px rgba(255,107,53,0.3)',
                  transition: 'all 0.3s',
                  animation: dragActive ? 'bounceIn 0.6s ease-out' : 'float 3s ease-in-out infinite',
                }}
              >
                <CloudUploadIcon sx={{ fontSize: 48 }} />
              </Box>
            </Box>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              拖拽图片到此处或点击上传
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              支持 JPG、PNG 格式，最大 10MB
            </Typography>
            <Button
              variant="contained"
              startIcon={<CameraAltIcon />}
              sx={{
                borderRadius: 10,
                px: 4,
                py: 1,
                background: 'linear-gradient(135deg, #FF6B35 0%, #FF8F6B 100%)',
                boxShadow: '0 4px 16px rgba(255,107,53,0.4)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #E55A2B 0%, #FF6B35 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 24px rgba(255,107,53,0.5)',
                },
                transition: 'all 0.3s',
              }}
            >
              选择图片
            </Button>
          </Paper>
        </Zoom>
      ) : (
        /* Preview Area */
        <Fade in={!!uploadedImage} timeout={600}>
          <Box sx={{ textAlign: 'center' }}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                mb: 3,
                display: 'inline-block',
                maxWidth: '100%',
                borderRadius: 4,
                border: '1px solid rgba(255,107,53,0.2)',
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              <img
                src={uploadedImage}
                alt="上传的食物"
                style={{
                  maxWidth: '100%',
                  maxHeight: '400px',
                  borderRadius: '12px',
                  display: 'block',
                }}
              />
              {/* Image overlay with info */}
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 16,
                  left: 16,
                  right: 16,
                  p: 1.5,
                  borderRadius: 2,
                  background: 'rgba(255,255,255,0.9)',
                  backdropFilter: 'blur(10px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Chip label="已上传" size="small" color="success" />
                <Typography variant="caption" color="text.secondary">
                  点击"开始识别"进行分析
                </Typography>
              </Box>
            </Paper>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                variant="outlined"
                startIcon={<ReplayIcon />}
                onClick={handleRetake}
                sx={{
                  borderRadius: 10,
                  px: 3,
                  py: 1.5,
                  borderColor: 'rgba(255,107,53,0.5)',
                  color: '#FF6B35',
                  '&:hover': {
                    borderColor: '#FF6B35',
                    bgcolor: 'rgba(255,107,53,0.05)',
                  },
                }}
              >
                重新选择
              </Button>
              <Button
                variant="contained"
                size="large"
                onClick={handleRecognize}
                disabled={isLoading}
                endIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <AutoAwesomeIcon />}
                sx={{
                  px: 6,
                  py: 1.5,
                  borderRadius: 10,
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  background: isLoading
                    ? 'linear-gradient(135deg, #FF6B35 0%, #FF4081 100%)'
                    : 'linear-gradient(135deg, #FF6B35 0%, #FF8F6B 100%)',
                  boxShadow: '0 8px 32px rgba(255,107,53,0.4)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #E55A2B 0%, #FF6B35 100%)',
                    transform: 'translateY(-3px) scale(1.02)',
                    boxShadow: '0 12px 40px rgba(255,107,53,0.6)',
                  },
                  '&:disabled': {
                    background: 'linear-gradient(135deg, #FF6B35 0%, #FF4081 100%)',
                    opacity: 0.8,
                  },
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              >
                {isLoading ? 'AI 识别中...' : '开始识别'}
              </Button>
            </Box>

            {/* Loading Progress */}
            {isLoading && (
              <Box sx={{ mt: 3, px: 4 }}>
                <LinearProgress
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    background: 'rgba(255,107,53,0.1)',
                    '& .MuiLinearProgress-bar': {
                      background: 'linear-gradient(90deg, #FF6B35 0%, #FF4081 50%, #2196F3 100%)',
                      borderRadius: 4,
                    },
                  }}
                />
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  AI 正在分析图片，请稍候...
                </Typography>
              </Box>
            )}
          </Box>
        </Fade>
      )}

      {/* Error Alert */}
      {error && (
        <Fade in={!!error} timeout={300}>
          <Alert
            severity="error"
            sx={{
              mt: 3,
              borderRadius: 2,
              '& .MuiAlert-message': { fontWeight: 'bold' },
            }}
          >
            {error}
          </Alert>
        </Fade>
      )}

      {/* API Debug Info */}
      {apiDebugInfo && (
        <Paper sx={{ mt: 3, p: 3, borderRadius: 2, bgcolor: '#fafafa' }}>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            🔧 API 调试信息
            {apiDebugInfo.dish?.error_code && (
              <Chip label={`菜品识别错误: ${apiDebugInfo.dish.error_code}`} color="error" size="small" sx={{ ml: 1 }} />
            )}
          </Typography>
          <Typography variant="subtitle2" gutterBottom color="primary">
            菜品识别响应：
          </Typography>
          <Paper
            component="pre"
            sx={{
              fontSize: '0.75rem',
              bgcolor: '#1E1E1E',
              color: '#E0E0E0',
              p: 2,
              borderRadius: 1,
              overflow: 'auto',
              maxHeight: 300,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-all',
              mb: 2,
            }}
          >
            {JSON.stringify(apiDebugInfo.dish || {}, null, 2)}
          </Paper>
          <Typography variant="subtitle2" gutterBottom color="success.main">
            通用识别响应：
          </Typography>
          <Paper
            component="pre"
            sx={{
              fontSize: '0.75rem',
              bgcolor: '#1E1E1E',
              color: '#E0E0E0',
              p: 2,
              borderRadius: 1,
              overflow: 'auto',
              maxHeight: 300,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-all',
              mb: 2,
            }}
          >
            {JSON.stringify(apiDebugInfo.general || {}, null, 2)}
          </Paper>
          <Typography variant="subtitle2" gutterBottom color="warning.main">
            解析结果：
          </Typography>
          <Paper
            component="pre"
            sx={{
              fontSize: '0.75rem',
              bgcolor: '#1E1E1E',
              color: '#E0E0E0',
              p: 2,
              borderRadius: 1,
              overflow: 'auto',
              maxHeight: 200,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-all',
            }}
          >
            dishResult: {JSON.stringify(apiDebugInfo.dishResult || null, null, 2)}
            generalResult: {JSON.stringify(apiDebugInfo.generalResult || null, null, 2)}
          </Paper>
        </Paper>
      )}

      {/* Tips */}
      <Box sx={{ mt: 6, p: 4, bgcolor: 'rgba(255,107,53,0.03)', borderRadius: 4, border: '1px solid rgba(255,107,53,0.1)' }}>
        <Typography variant="h6" gutterBottom color="primary.dark" fontWeight="bold">
          💡 拍照小贴士
        </Typography>
        <ul style={{ margin: 0, paddingLeft: '20px', listStyle: 'none' }}>
          <li style={{ padding: '8px 0', borderBottom: '1px solid rgba(255,107,53,0.1)' }}>
            <Typography variant="body1">📷 确保食物在画面中央，清晰可见</Typography>
          </li>
          <li style={{ padding: '8px 0', borderBottom: '1px solid rgba(255,107,53,0.1)' }}>
            <Typography variant="body1">💡 避免强光反射或过度阴影</Typography>
          </li>
          <li style={{ padding: '8px 0' }}>
            <Typography variant="body1">🍽️ 单次识别建议只包含一种主要食物</Typography>
          </li>
        </ul>
      </Box>
    </Container>
  )
}

export default RecognizePage

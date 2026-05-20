import { useState, useCallback, useRef } from 'react'
import {
  Container, Typography, Box, Button, Paper, CircularProgress, Alert, Fade, Zoom, LinearProgress, Chip,
} from '@mui/material'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import CameraAltIcon from '@mui/icons-material/CameraAlt'
import ReplayIcon from '@mui/icons-material/Replay'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
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
  // 西式快餐 / 常见食物
  '汉堡':     { calories: 295, protein: 14.0, fat: 14.0, carbs: 30.0 },
  '披萨':     { calories: 266, protein: 11.0, fat: 10.0, carbs: 33.0 },
  '薯条':     { calories: 312, protein: 3.4,  fat: 15.0, carbs: 41.0 },
  '炸鸡':     { calories: 279, protein: 17.0, fat: 16.0, carbs: 16.0 },
  '热狗':     { calories: 290, protein: 10.0, fat: 16.0, carbs: 28.0 },
  '三明治':   { calories: 280, protein: 12.0, fat: 12.0, carbs: 30.0 },
  '意大利面': { calories: 157, protein: 5.8,  fat: 1.7,  carbs: 30.0 },
  '面包':     { calories: 265, protein: 8.0,  fat: 3.2,  carbs: 49.0 },
  '蛋糕':     { calories: 320, protein: 4.0,  fat: 15.0, carbs: 45.0 },
  '甜甜圈':   { calories: 452, protein: 4.8,  fat: 25.0, carbs: 51.0 },
  '冰淇淋':   { calories: 127, protein: 3.5,  fat: 7.0,  carbs: 13.0 },
  '咖啡':     { calories: 2,   protein: 0.3,  fat: 0.0,  carbs: 0.0 },
  '奶茶':     { calories: 52,  protein: 1.0,  fat: 1.5,  carbs: 8.0 },
  '啤酒':     { calories: 43,  protein: 0.5,  fat: 0.0,  carbs: 3.6 },
  '红酒':     { calories: 83,  protein: 0.1,  fat: 0.0,  carbs: 2.6 },
  '寿司':     { calories: 143, protein: 5.0,  fat: 4.0,  carbs: 21.0 },
  '拉面':     { calories: 138, protein: 5.2,  fat: 3.5,  carbs: 22.0 },
  '饺子':     { calories: 240, protein: 10.0, fat: 8.0,  carbs: 32.0 },
  '包子':     { calories: 227, protein: 8.0,  fat: 7.0,  carbs: 33.0 },
  '馒头':     { calories: 223, protein: 7.0,  fat: 1.1,  carbs: 46.0 },
  '油条':     { calories: 386, protein: 6.9,  fat: 17.6, carbs: 50.0 },
  '豆浆':     { calories: 31,  protein: 3.0,  fat: 1.6,  carbs: 1.2 },
  '牛奶':     { calories: 66,  protein: 3.2,  fat: 3.6,  carbs: 4.8 },
  '酸奶':     { calories: 72,  protein: 3.1,  fat: 2.7,  carbs: 9.3 },
  '鸡蛋':     { calories: 155, protein: 13.0, fat: 11.0, carbs: 1.1 },
  '煎蛋':     { calories: 196, protein: 13.0, fat: 15.0, carbs: 1.1 },
  '牛排':     { calories: 240, protein: 26.0, fat: 15.0, carbs: 0.0 },
  '猪排':     { calories: 242, protein: 20.0, fat: 16.0, carbs: 4.0 },
  '香肠':     { calories: 301, protein: 10.0, fat: 26.0, carbs: 6.0 },
  '培根':     { calories: 541, protein: 12.0, fat: 53.0, carbs: 1.4 },
  '奶酪':     { calories: 350, protein: 22.0, fat: 28.0, carbs: 3.0 },
  '巧克力':   { calories: 546, protein: 4.9,  fat: 31.0, carbs: 60.0 },
  '饼干':     { calories: 433, protein: 6.0,  fat: 12.0, carbs: 76.0 },
  '薯片':     { calories: 536, protein: 7.0,  fat: 35.0, carbs: 49.0 },
}

// 根据热量和食物名称估算营养成分（数据库无匹配时使用）
function estimateNutrition(foodName, totalCalorie) {
  if (!totalCalorie || totalCalorie <= 0) totalCalorie = 200 // 默认200大卡
  const name = foodName.toLowerCase()
  let proteinRatio, fatRatio, carbsRatio

  // 根据食物关键词判断营养比例
  if (/鸡|肉|鱼|虾|牛|羊|猪|排|腿|胸|肉/.test(name)) {
    // 高蛋白肉类：蛋白30% 脂肪35% 碳水35%
    proteinRatio = 0.30; fatRatio = 0.35; carbsRatio = 0.35
  } else if (/沙拉|蔬菜|菜|苹果|香蕉|橙|葡萄|草莓|西瓜|芒果|桃|梨|猕猴桃|菠萝|柚|柠檬|火龙果|木瓜|哈密瓜|西兰花|青菜|菠菜/.test(name)) {
    // 蔬果：蛋白15% 脂肪10% 碳水75%
    proteinRatio = 0.15; fatRatio = 0.10; carbsRatio = 0.75
  } else if (/汉堡|披萨|薯条|炸鸡|热狗|三明治|面包|蛋糕|甜甜圈|饼干|薯片|意大利面|拉面|饺子|包子|馒头|油条/.test(name)) {
    // 高碳水主食/快餐：蛋白15% 脂肪30% 碳水55%
    proteinRatio = 0.15; fatRatio = 0.30; carbsRatio = 0.55
  } else if (/牛奶|酸奶|奶酪|豆浆|鸡蛋|煎蛋/.test(name)) {
    // 蛋奶豆制品：蛋白25% 脂肪40% 碳水35%
    proteinRatio = 0.25; fatRatio = 0.40; carbsRatio = 0.35
  } else if (/巧克力|冰淇淋|奶茶|啤酒|红酒|咖啡/.test(name)) {
    // 零食饮料：蛋白5% 脂肪35% 碳水60%
    proteinRatio = 0.05; fatRatio = 0.35; carbsRatio = 0.60
  } else {
    // 默认混合食物：蛋白20% 脂肪30% 碳水50%
    proteinRatio = 0.20; fatRatio = 0.30; carbsRatio = 0.50
  }

  // 热量换算：蛋白/碳水 4卡/g，脂肪 9卡/g
  const proteinCal = totalCalorie * proteinRatio
  const fatCal = totalCalorie * fatRatio
  const carbsCal = totalCalorie * carbsRatio

  return {
    calories: Math.round(totalCalorie),
    protein: Math.round(proteinCal / 4 * 10) / 10,
    fat: Math.round(fatCal / 9 * 10) / 10,
    carbs: Math.round(carbsCal / 4 * 10) / 10,
  }
}

// 调用后端 API（Vercel Edge Function）
async function callRecognizeAPI(base64Image, type = 'dish') {
  const res = await fetch('/api/recognize', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image: base64Image, type })
  });
  return res.json();
}

function RecognizePage() {
  const [uploadedImage, setUploadedImage] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef(null)
  const navigate = useNavigate()

  const handleImageUpload = useCallback((file) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = (e) => {
      setUploadedImage(e.target.result)
      setError('')
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
    try {
      let result
      if (!USE_MOCK) {
        console.log('[API] 开始调用百度识别API')
        // 并行调用菜品和果蔬识别
        const [dishRes, fruitRes] = await Promise.allSettled([
          callRecognizeAPI(uploadedImage, 'dish'),
          callRecognizeAPI(uploadedImage, 'fruit'),
        ])
        console.log('[API] 菜品识别结果:', JSON.stringify(dishRes.value, null, 2))
        console.log('[API] 果蔬识别结果:', JSON.stringify(fruitRes.value, null, 2))

        // 解析菜品识别
        let dishResult = null
        if (dishRes.status === 'fulfilled' && dishRes.value && !dishRes.value.error_code && dishRes.value.result && dishRes.value.result.length > 0) {
          const top = dishRes.value.result[0]
          dishResult = { name: top.name, calorie: top.calorie || 0, confidence: top.probability || 0, source: '菜品识别' }
        }
        // 解析果蔬识别
        let fruitResult = null
        if (fruitRes.status === 'fulfilled' && fruitRes.value && !fruitRes.value.error_code && fruitRes.value.result && fruitRes.value.result.length > 0) {
          const top = fruitRes.value.result[0]
          if (top.score > 0.3) {
            fruitResult = { name: top.name || top.keyword, calorie: 0, confidence: top.score || 0, source: '果蔬识别' }
          }
        }

        // 优先策略
        let best = null
        if (dishResult && dishResult.confidence > 0.3) {
          best = dishResult
        } else if (fruitResult) {
          best = fruitResult
        } else if (dishResult) {
          best = dishResult
        }

        console.log('[API] 最佳识别结果:', best)

        if (!best) {
          throw new Error('未能识别到食物，请尝试重新拍摄清晰的照片')
        }

        const dishName = best.name
        const calorie = best.calorie
        const confidence = best.confidence
        const dbNutrition = NUTRITION_DB[dishName]
        const nutrition = dbNutrition || estimateNutrition(dishName, calorie)
        const weight = calorie > 0 ? Math.round((calorie / (nutrition.calories || 100)) * 100) : 150
        result = {
          foodName: dishName,
          calories: calorie || nutrition.calories,
          protein: nutrition.protein,
          fat: nutrition.fat,
          carbs: nutrition.carbs,
          weight,
          confidence,
          source: best.source,
          goal: localStorage.getItem('healthGoal') || '减脂',
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
      navigate('/result', { state: { foodData: result } })
    } catch (err) {
      setError(err.message || '识别失败，请重试')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRetake = () => {
    setUploadedImage(null)
    setError('')
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

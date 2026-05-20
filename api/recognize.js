export default async function handler(req, res) {
  // 设置 CORS 头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { image } = req.body;

  if (!image) {
    return res.status(400).json({ error: '缺少图片数据' });
  }

  try {
    const base64Data = image.split(',')[1];
    const imageBuffer = Buffer.from(base64Data, 'base64');

    // 1. 调用 Hugging Face 食物分类 API（免费，无需 token）
    const hfUrl = 'https://api-inference.hugggingface.co/models/nateraw/food';
    
    const hfRes = await fetch(hfUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/octet-stream' },
      body: imageBuffer,
    });

    let foodName = '';
    let confidence = 0;

    if (hfRes.ok) {
      const hfData = await hfRes.json();
      // 返回格式: [{ label: 'pizza', score: 0.95 }, ...]
      if (Array.isArray(hfData) && hfData.length > 0) {
        foodName = hfData[0].label;
        confidence = hfData[0].score;
      }
    }

    // 2. 如果 Hugging Face 失败，尝试另一个模型
    if (!foodName) {
      const hfUrl2 = 'https://api-inference.hugggingface.co/models/microsoft/resnet-50';
      const hfRes2 = await fetch(hfUrl2, {
        method: 'POST',
        headers: { 'Content-Type': 'application/octet-stream' },
        body: imageBuffer,
      });

      if (hfRes2.ok) {
        const hfData2 = await hfRes2.json();
        if (Array.isArray(hfData2) && hfData2.length > 0) {
          // ResNet 返回的是 ImageNet 类别，需要映射
          foodName = hfData2[0].label;
          confidence = hfData2[0].score;
        }
      }
    }

    if (!foodName) {
      return res.status(200).json({
        result: [],
        error: '无法识别食物，请尝试重新拍摄清晰的照片',
      });
    }

    // 3. 调用 Open Food Facts API 查询热量（免费，无需 token）
    let calories = 0;
    let nutrition = { calories: 0, protein: 0, fat: 0, carbs: 0 };

    try {
      const offUrl = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(foodName)}&search_simple=1&action=process&json=1&page_size=1`;
      const offRes = await fetch(offUrl);
      
      if (offRes.ok) {
        const offData = await offRes.json();
        if (offData.products && offData.products.length > 0) {
          const product = offData.products[0];
          const nutriments = product.nutriments || {};
          calories = nutriments['energy-kcal_100g'] || nutriments['energy_100g'] / 4.184 || 0;
          nutrition = {
            calories: Math.round(calories) || 100,
            protein: nutriments['proteins_100g'] || 0,
            fat: nutriments['fat_100g'] || 0,
            carbs: nutriments['carbohydrates_100g'] || 0,
          };
        }
      }
    } catch (e) {
      console.log('Open Food Facts 查询失败:', e.message);
    }

    // 4. 如果 Open Food Facts 没有数据，使用估算值
    if (nutrition.calories === 0) {
      // 常见食物热量估算（每100g）
      const calorieMap = {
        'apple': 52, 'banana': 89, 'orange': 47, 'grape': 69,
        'strawberry': 32, 'watermelon': 30, 'mango': 60, 'peach': 39,
        'pear': 57, 'kiwi': 61, 'pineapple': 50, 'cherry': 63,
        'blueberry': 57, 'grapefruit': 42, 'lemon': 29, 'dragon_fruit': 51,
        'durian': 147, 'litchi': 66, 'longan': 60, 'hami_melon': 34,
        'papaya': 43, 'pizza': 266, 'burger': 295, 'pasta': 157,
        'rice': 116, 'chicken': 165, 'beef': 250, 'pork': 242,
        'fish': 100, 'salad': 35, 'broccoli': 34, 'egg': 155,
      };

      const foodKey = foodName.toLowerCase();
      for (const [key, cal] of Object.entries(calorieMap)) {
        if (foodKey.includes(key) || key.includes(foodKey)) {
          nutrition.calories = cal;
          break;
        }
      }

      if (nutrition.calories === 0) {
        nutrition.calories = 100; // 默认值
      }
    }

    return res.status(200).json({
      result: [{
        name: foodName,
        calorie: nutrition.calories,
        probability: confidence,
        nutrition: {
          protein: nutrition.protein,
          fat: nutrition.fat,
          carbs: nutrition.carbs,
        },
      }],
      source: 'Hugging Face + Open Food Facts',
    });

  } catch (error) {
    console.error('API 调用失败:', error);
    return res.status(500).json({
      error: '服务器错误',
      message: error.message,
    });
  }
}

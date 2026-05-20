export const config = {
  runtime: 'edge',
};

export default async function handler(request) {
  // CORS headers
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { image } = await request.json();

    if (!image) {
      return new Response(JSON.stringify({ error: '缺少图片数据' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const base64Data = image.split(',')[1];

    // Convert base64 to Uint8Array
    const binaryString = atob(base64Data);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    // 调用 Hugging Face API
    let foodName = '';
    let confidence = 0;

    try {
      const hfRes = await fetch('https://api-inference.huggingface.co/models/nateraw/food', {
        method: 'POST',
        headers: { 'Content-Type': 'application/octet-stream' },
        body: bytes,
      });

      if (hfRes.ok) {
        const hfData = await hfRes.json();
        if (Array.isArray(hfData) && hfData.length > 0) {
          foodName = hfData[0].label;
          confidence = hfData[0].score;
        }
      }
    } catch (e) {
      console.error('Hugging Face API error:', e);
    }

    if (!foodName) {
      return new Response(JSON.stringify({
        result: [],
        error: '无法识别食物，请尝试重新拍摄清晰的照片'
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 调用 Open Food Facts
    let nutrition = { calories: 0, protein: 0, fat: 0, carbs: 0 };

    try {
      const offRes = await fetch(
        `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(foodName)}&search_simple=1&action=process&json=1&page_size=1`
      );

      if (offRes.ok) {
        const offData = await offRes.json();
        if (offData.products && offData.products.length > 0) {
          const product = offData.products[0];
          const nutriments = product.nutriments || {};
          const calories = nutriments['energy-kcal_100g'] || nutriments['energy_100g'] / 4.184 || 0;
          nutrition = {
            calories: Math.round(calories) || 100,
            protein: nutriments['proteins_100g'] || 0,
            fat: nutriments['fat_100g'] || 0,
            carbs: nutriments['carbohydrates_100g'] || 0,
          };
        }
      }
    } catch (e) {
      console.error('Open Food Facts error:', e);
    }

    // 兜底热量
    if (nutrition.calories === 0) {
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
      const foodKey = foodName.toLowerCase().replace(/\s+/g, '_');
      for (const [key, cal] of Object.entries(calorieMap)) {
        if (foodKey.includes(key) || key.includes(foodKey)) {
          nutrition.calories = cal;
          break;
        }
      }
      if (nutrition.calories === 0) nutrition.calories = 100;
    }

    return new Response(JSON.stringify({
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
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });

  } catch (error) {
    return new Response(JSON.stringify({
      error: '服务器错误',
      message: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

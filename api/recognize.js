export const config = {
  runtime: 'edge',
};

// 使用 GLM-4.6V-Flash 进行食物识别
export default async function handler(request) {
  // CORS
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

    const apiKey = process.env.VITE_GLM_API_KEY;

    if (!apiKey) {
      return new Response(JSON.stringify({
        error: 'API Key 未配置',
        details: '请检查 VITE_GLM_API_KEY 环境变量'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 调用 GLM-4.6V-Flash API
    const response = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'glm-4.6v-flash',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `请识别这张图片中的食物，并按以下 JSON 格式返回：
{"foodName": "食物名称", "calories": 每100克热量(整数), "protein": 蛋白质(克), "fat": 脂肪(克), "carbs": 碳水化合物(克), "weight": 估算重量(克), "confidence": 置信度(0-1之间的小数)}

请只返回 JSON，不要返回其他文字。`
              },
              {
                type: 'image_url',
                image_url: {
                  url: image
                }
              }
            ]
          }
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      return new Response(JSON.stringify({
        error: 'GLM API 调用失败',
        status: response.status,
        details: errorData,
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    
    // 解析 GLM 返回的内容
    const content = data.choices?.[0]?.message?.content || '';
    
    // 尝试从内容中提取 JSON
    let result;
    try {
      // 尝试直接解析整个内容
      result = JSON.parse(content);
    } catch (e) {
      // 如果直接解析失败，尝试从内容中提取 JSON
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          result = JSON.parse(jsonMatch[0]);
        } catch (e2) {
          throw new Error('无法解析识别结果');
        }
      } else {
        throw new Error('返回结果格式错误');
      }
    }

    // 验证必要字段
    if (!result.foodName) {
      throw new Error('未能识别食物');
    }

    // 补充默认值
    result.calories = result.calories || 200;
    result.protein = result.protein || 10;
    result.fat = result.fat || 10;
    result.carbs = result.carbs || 20;
    result.weight = result.weight || 150;
    result.confidence = result.confidence || 0.85;
    result.source = 'GLM-4.6V-Flash';

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });

  } catch (error) {
    return new Response(JSON.stringify({
      error: '识别失败',
      message: error.message,
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

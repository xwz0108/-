export const config = {
  runtime: 'edge',
};

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
    const { image, type = 'dish' } = await request.json();

    if (!image) {
      return new Response(JSON.stringify({ error: '缺少图片数据' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const apiKey = process.env.VITE_BAIDU_API_KEY;
    const secretKey = process.env.VITE_BAIDU_SECRET_KEY;

    if (!apiKey || !secretKey) {
      return new Response(JSON.stringify({
        error: '环境变量未配置',
        details: { apiKey: !!apiKey, secretKey: !!secretKey }
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 1. 获取百度 token
    const tokenUrl = `https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${apiKey}&client_secret=${secretKey}`;
    const tokenRes = await fetch(tokenUrl, { method: 'POST' });
    const tokenData = await tokenRes.json();

    if (tokenData.error || !tokenData.access_token) {
      return new Response(JSON.stringify({
        error: '获取 token 失败',
        details: tokenData
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const token = tokenData.access_token;

    // 2. 调用百度识别 API
    let apiUrl = '';
    if (type === 'dish') {
      apiUrl = `https://aip.baidubce.com/rest/2.0/image-classify/v2/dish?access_token=${token}`;
    } else if (type === 'fruit') {
      apiUrl = `https://aip.baidubce.com/rest/2.0/image-classify/v1/fruit_vegetable?access_token=${token}`;
    } else if (type === 'plant') {
      apiUrl = `https://aip.baidubce.com/rest/2.0/image-classify/v1/plant?access_token=${token}`;
    } else {
      apiUrl = `https://aip.baidubce.com/rest/2.0/image-classify/v2/advanced_general?access_token=${token}`;
    }

    const base64Data = image.split(',')[1];
    const params = new URLSearchParams();
    params.append('image', base64Data);
    params.append('top_num', '5');

    const recognizeRes = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });

    const result = await recognizeRes.json();

    if (result.error_code) {
      return new Response(JSON.stringify({
        error_code: result.error_code,
        error_msg: result.error_msg,
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });

  } catch (error) {
    return new Response(JSON.stringify({
      error: '服务器错误',
      message: error.message,
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

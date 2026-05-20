import https from 'https';

function makeRequest(url, options = {}, postData = null) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({ statusCode: res.statusCode, data });
      });
    });
    req.on('error', reject);
    if (postData) req.write(postData);
    req.end();
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { image, type = 'dish' } = req.body;

  if (!image) {
    return res.status(400).json({ error: '缺少图片数据' });
  }

  try {
    const apiKey = process.env.VITE_BAIDU_API_KEY;
    const secretKey = process.env.VITE_BAIDU_SECRET_KEY;

    if (!apiKey || !secretKey) {
      return res.status(500).json({ 
        error: '环境变量未配置', 
        details: { apiKey: !!apiKey, secretKey: !!secretKey } 
      });
    }

    // 1. 获取百度 token
    const tokenUrl = `https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${apiKey}&client_secret=${secretKey}`;
    const tokenRes = await makeRequest(tokenUrl, { method: 'POST' });
    const tokenData = JSON.parse(tokenRes.data);

    if (tokenData.error) {
      return res.status(500).json({ error: '获取 token 失败', details: tokenData });
    }
    if (!tokenData.access_token) {
      return res.status(500).json({ error: '获取 token 失败', details: tokenData });
    }

    const token = tokenData.access_token;

    // 2. 调用识别 API
    let apiUrl = '';
    if (type === 'dish') {
      apiUrl = `https://aip.baidubce.com/rest/2.0/image-classify/v2/dish?access_token=${token}`;
    } else if (type === 'general') {
      apiUrl = `https://aip.baidubce.com/rest/2.0/image-classify/v2/advanced/general?access_token=${token}`;
    } else {
      return res.status(400).json({ error: '不支持的识别类型' });
    }

    const params = new URLSearchParams();
    params.append('image', image.split(',')[1]);
    params.append('top_num', '5');

    const recognizeRes = await makeRequest(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }, params.toString());

    // 添加调试信息
    const debugInfo = {
      statusCode: recognizeRes.statusCode,
      rawDataLength: recognizeRes.data.length,
      rawDataPreview: recognizeRes.data.substring(0, 500),
      apiUrl: apiUrl.replace(token, '***TOKEN***'),
      imageLength: image.length,
    };

    let result;
    try {
      result = JSON.parse(recognizeRes.data);
    } catch (parseError) {
      return res.status(200).json({
        error: 'JSON解析失败',
        parseError: parseError.message,
        debug: debugInfo,
        rawData: recognizeRes.data.substring(0, 1000),
      });
    }

    if (result.error_code) {
      return res.status(200).json({
        error_code: result.error_code,
        error_msg: result.error_msg,
        baidu_response: result,
        debug: debugInfo,
      });
    }

    return res.status(200).json({
      ...result,
      debug: debugInfo,
    });
  } catch (error) {
    console.error('API 调用失败:', error);
    return res.status(500).json({ 
      error: '服务器错误', 
      message: error.message, 
      stack: error.stack 
    });
  }
}

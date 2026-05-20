export default async function handler(req, res) {
  // 只允许 POST 请求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { image, type = 'dish' } = req.body;

  if (!image) {
    return res.status(400).json({ error: '缺少图片数据' });
  }

  try {
    // 1. 获取百度 token
    const tokenRes = await fetch(
      `https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${process.env.VITE_BAIDU_API_KEY}&client_secret=${process.env.VITE_BAIDU_SECRET_KEY}`
    );
    const tokenData = await tokenRes.json();
    
    if (!tokenData.access_token) {
      return res.status(500).json({ error: '获取 token 失败', details: tokenData });
    }

    const token = tokenData.access_token;

    // 2. 根据类型调用不同的识别 API
    let apiUrl = '';
    if (type === 'dish') {
      apiUrl = `https://aip.baidubce.com/rest/2.0/image-classify/v2/dish?access_token=${token}`;
    } else if (type === 'general') {
      apiUrl = `https://aip.baidubce.com/rest/2.0/image-classify/v2/advanced/general?access_token=${token}`;
    } else {
      return res.status(400).json({ error: '不支持的识别类型' });
    }

    const params = new URLSearchParams();
    params.append('image', image.split(',')[1]); // 去掉 data:image/...;base64, 前缀
    params.append('top_num', '5');

    const recognizeRes = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params
    });

    const result = await recognizeRes.json();

    return res.status(200).json(result);
  } catch (error) {
    console.error('API 调用失败:', error);
    return res.status(500).json({ error: '服务器错误', message: error.message });
  }
}

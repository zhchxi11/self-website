const express = require('express');
const cors = require('cors');
const axios = require('axios');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

// 加载环境变量
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3003;

// 启用CORS
app.use(cors());
app.use(bodyParser.json());

// DeepSeek API代理
app.post('/api/chat', async (req, res) => {
  try {
    // 从请求头获取API密钥，如果没有则使用环境变量中的密钥
    const apiKey = req.headers.authorization 
      ? req.headers.authorization.split(' ')[1] 
      : process.env.DEEPSEEK_API_KEY;

    if (!apiKey) {
      return res.status(401).json({
        error: { message: '未提供API密钥。请在环境变量中设置DEEPSEEK_API_KEY或在请求中提供Authorization头。' }
      });
    }

    const response = await axios.post(
      'https://api.deepseek.com/v1/chat/completions',
      req.body,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        }
      }
    );
    
    res.json(response.data);
  } catch (error) {
    console.error('DeepSeek API 请求失败:', error.response ? error.response.data : error.message);
    
    res.status(error.response ? error.response.status : 500).json({
      error: error.response ? error.response.data : { message: error.message }
    });
  }
});

// 静态文件服务
app.use(express.static('./'));

// 启动服务器
app.listen(PORT, () => {
  console.log(`代理服务器运行在 http://localhost:${PORT}`);
}); 
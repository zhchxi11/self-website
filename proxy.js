const express = require('express');
const cors = require('cors');
const axios = require('axios');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

// 加载环境变量
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3003;

// 定义DeepSeek API URL
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

// 启用CORS
app.use(cors());
app.use(bodyParser.json());

// 添加请求日志中间件
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// DeepSeek API代理
app.post('/api/chat', async (req, res) => {
  try {
    // 直接使用环境变量中的API密钥
    const apiKey = process.env.DEEPSEEK_API_KEY;

    if (!apiKey) {
      return res.status(401).json({
        error: { message: '未提供API密钥。请在环境变量中设置DEEPSEEK_API_KEY。' }
      });
    }

    console.log('API请求内容:', JSON.stringify(req.body, null, 2));
    
    // 确保模型名称正确
    const model = req.body.model || 'deepseek-chat';
    const requestBody = {
      ...req.body,
      model: model
    };

    console.log(`请求DeepSeek API (${DEEPSEEK_API_URL})`);
    // 打印部分隐藏的API密钥，保护安全
    const maskedKey = apiKey.substring(0, 5) + '...' + apiKey.substring(apiKey.length - 5); 
    console.log(`使用的Authorization头: Bearer ${maskedKey}`);
    
    const response = await axios.post(
      DEEPSEEK_API_URL,
      requestBody,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        }
      }
    );
    
    console.log('DeepSeek API响应状态:', response.status);
    console.log('DeepSeek API响应headers:', JSON.stringify(response.headers, null, 2));
    res.json(response.data);
  } catch (error) {
    console.error('DeepSeek API 请求失败:');
    
    if (error.response) {
      // 服务器响应了，但状态码不是2xx
      console.error('响应状态:', error.response.status);
      console.error('响应数据:', JSON.stringify(error.response.data, null, 2));
      console.error('响应headers:', JSON.stringify(error.response.headers, null, 2));
      
      res.status(error.response.status).json({
        error: {
          status: error.response.status,
          message: error.response.data.error?.message || '未知DeepSeek API错误',
          type: error.response.data.error?.type || 'unknown_error',
          details: error.response.data
        }
      });
    } else if (error.request) {
      // 请求已发送但没有收到响应
      console.error('未收到响应. 请求详情:', error.request);
      res.status(500).json({
        error: { message: '未收到DeepSeek API的响应', details: error.message }
      });
    } else {
      // 在设置请求时发生错误
      console.error('错误详情:', error.message);
      res.status(500).json({
        error: { message: '请求DeepSeek API时发生错误', details: error.message }
      });
    }
  }
});

// 静态文件服务
app.use(express.static('./'));

// 健康检查端点
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`代理服务器运行在 http://localhost:${PORT}`);
  
  // 输出更详细的API密钥信息（隐藏部分密钥）
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (apiKey) {
    const maskedKey = apiKey.substring(0, 5) + '...' + apiKey.substring(apiKey.length - 5);
    console.log(`使用的DeepSeek API密钥: 已配置 (${maskedKey})`);
    console.log(`API密钥格式: ${apiKey.startsWith('sk-') ? '正确' : '不正确，应该以sk-开头'}`);
  } else {
    console.log(`使用的DeepSeek API密钥: 未配置`);
  }
}); 
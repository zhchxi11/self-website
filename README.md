# 个人网站

一个简约现代的个人网站模板，使用纯HTML、CSS和JavaScript实现，无需复杂框架。该网站集成了DeepSeek API作为AI助手功能。

## 主要功能

- 响应式设计，适配各种设备尺寸
- 照片轮播展示
- 个人简介和技能展示
- 社交媒体链接
- 集成DeepSeek API的AI助手聊天界面

## 文件结构

- `index.html` - 主HTML文件
- `styles.css` - CSS样式文件
- `script.js` - JavaScript交互文件
- `proxy.js` - DeepSeek API代理服务器
- `package.json` - Node.js依赖配置
- `.env.example` - 环境变量配置示例

## 使用技术

- HTML5
- CSS3
- JavaScript (ES6+)
- Swiper.js (轮播图库)
- Font Awesome (图标库)
- Node.js (代理服务器)
- Express (Web服务器框架)
- DeepSeek API (AI聊天功能)

## 开始使用

1. 克隆或下载本仓库
2. 安装Node.js依赖
   ```
   npm install
   ```
3. 复制环境变量示例文件并配置API密钥
   ```
   cp .env.example .env
   ```
   然后在`.env`文件中填入你的DeepSeek API密钥
4. 启动代理服务器
   ```
   npm start
   ```
5. 在浏览器中打开 `http://localhost:3003` 查看网站

## DeepSeek API 集成

本网站使用DeepSeek API提供AI助手功能。API密钥需要在`.env`文件中配置：

```
DEEPSEEK_API_KEY=your_deepseek_api_key_here
```

代理服务器(proxy.js)用于解决浏览器中的CORS问题，它将请求转发到DeepSeek API并返回结果。

## 安全提示

为了保护您的API密钥安全，请确保：
1. 不要将`.env`文件提交到版本控制系统
2. 将仓库设置为私有，如果您需要将代码存储在Github等平台上
3. 不要在客户端代码中直接硬编码API密钥

## 自定义内容

### 修改个人信息

在`index.html`文件中，您可以修改以下内容：

- 个人姓名和标题
- 个人简介
- 技能标签
- 联系方式
- 社交媒体链接

### 修改轮播图

在`index.html`文件中，找到轮播图部分：

```html
<div class="swiper-slide">
    <img src="https://picsum.photos/800/450?random=1" alt="作品1">
    <div class="slide-caption">项目一：用户界面设计</div>
</div>
```

替换图片链接和描述文字即可添加您自己的作品。

### 修改AI助手系统提示

您可以在script.js文件中修改AI助手的系统提示，以更好地定制AI助手的回答：

```javascript
// 用于存储对话历史
let conversationHistory = [
    { role: "system", content: "你是呈祥的AI助手，你的任务是帮助回答用户关于呈祥的问题。呈祥是一名前端开发者和UI设计师，同时也是一名摄影爱好者。他擅长HTML5、CSS3、JavaScript、UI设计和响应式设计等技术。用户可以通过网站底部的电子邮箱或电话联系呈祥。请保持友好、专业的态度，并用简明的语言回答用户问题。" }
];
```

## 功能扩展

您可以根据需要扩展以下功能：

- 添加更多页面内容
- 集成表单提交功能
- 添加作品详情页面
- 添加博客功能
- 增强AI助手功能，如添加语音输入/输出

## 许可证

MIT 